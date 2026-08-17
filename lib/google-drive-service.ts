import { createSign } from "node:crypto";

/**
 * Server-side Google Drive access for SLM Resource Collections.
 *
 * Auth model: a Google Cloud service account, NOT OAuth on behalf of
 * a user. Each SLM folder must be shared with the service account's
 * email as "Viewer" — the folder itself stays private otherwise.
 * Credentials never leave the server; nothing here is imported by
 * client components.
 *
 * Required env vars (server-side only — do NOT prefix with
 * NEXT_PUBLIC_):
 *   GOOGLE_DRIVE_CLIENT_EMAIL   - service account's client_email
 *   GOOGLE_DRIVE_PRIVATE_KEY    - service account's private_key
 *                                 (paste as-is; \n escapes are handled below)
 *
 * We sign the OAuth JWT ourselves with node:crypto rather than
 * pulling in `googleapis` — the whole flow is ~40 lines and avoids a
 * fairly heavy dependency for what's a handful of REST calls.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

export type DriveApiError = { code: "not_configured" | "unauthorized" | "not_found" | "unknown"; message: string };

function base64url(input: Buffer | string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function getCredentials(): { clientEmail: string; privateKey: string } | null {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_DRIVE_PRIVATE_KEY;
  if (!clientEmail || !rawKey) return null;
  // Env vars often arrive with literal "\n" instead of real newlines.
  const privateKey = rawKey.includes("\\n") ? rawKey.replace(/\\n/g, "\n") : rawKey;
  return { clientEmail, privateKey };
}

// Cached in module scope: fine for a single Node process, same
// per-instance tradeoff as the in-memory rate limiter.
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 30_000) {
    return cachedToken.token;
  }

  const creds = getCredentials();
  if (!creds) return null;

  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claimSet = base64url(
    JSON.stringify({
      iss: creds.clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    })
  );

  const signer = createSign("RSA-SHA256");
  signer.update(`${header}.${claimSet}`);
  signer.end();
  const signature = base64url(signer.sign(creds.privateKey));

  const assertion = `${header}.${claimSet}.${signature}`;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("Google Drive token exchange failed:", res.status, text);
    return null;
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
  return cachedToken.token;
}

export type DriveFileMeta = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size: string | null; // Drive returns size as a string; null for native Docs/Sheets/Slides
  parents?: string[]; // only populated by getFileMeta(), not listFilesInFolder()
};

export type ListFolderResult =
  | { ok: true; files: DriveFileMeta[] }
  | { ok: false; error: DriveApiError };

const MAX_FILES = 500; // hard cap so a huge folder can't hang the request

/**
 * Lists (non-trashed, non-folder) files directly inside a folder.
 * Paginates internally up to MAX_FILES. Does not recurse into
 * subfolders — keep SLM collections flat, one folder per collection.
 */
export async function listFilesInFolder(folderId: string): Promise<ListFolderResult> {
  const token = await getAccessToken();
  if (!token) {
    return { ok: false, error: { code: "not_configured", message: "Google Drive isn't configured on the server." } };
  }

  const files: DriveFileMeta[] = [];
  let pageToken: string | undefined;

  try {
    do {
      const params = new URLSearchParams({
        q: `'${folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
        fields: "nextPageToken, files(id, name, mimeType, modifiedTime, size)",
        pageSize: "100",
        supportsAllDrives: "true",
        includeItemsFromAllDrives: "true",
        orderBy: "name_natural",
      });
      if (pageToken) params.set("pageToken", pageToken);

      const res = await fetch(`${DRIVE_API}/files?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        return {
          ok: false,
          error: {
            code: "unauthorized",
            message: "The service account can't access this folder. Make sure it's shared with the service account's email.",
          },
        };
      }
      if (res.status === 404) {
        return { ok: false, error: { code: "not_found", message: "That folder doesn't exist or isn't shared." } };
      }
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Drive list files failed:", res.status, text);
        return { ok: false, error: { code: "unknown", message: "Couldn't load files from Google Drive." } };
      }

      const data = (await res.json()) as { files: DriveFileMeta[]; nextPageToken?: string };
      files.push(...data.files);
      pageToken = data.nextPageToken;
    } while (pageToken && files.length < MAX_FILES);

    return { ok: true, files: files.slice(0, MAX_FILES) };
  } catch (err) {
    console.error("Drive list files threw:", err);
    return { ok: false, error: { code: "unknown", message: "Couldn't reach Google Drive." } };
  }
}

/**
 * Confirms the service account can see a folder at all (used by the
 * admin-only preview when saving a collection). Cheap: asks for 1 file.
 */
export async function probeFolderAccess(
  folderId: string
): Promise<{ accessible: boolean; fileCount: number | null; error: string | null }> {
  const result = await listFilesInFolder(folderId);
  if (!result.ok) {
    return { accessible: false, fileCount: null, error: result.error.message };
  }
  return { accessible: true, fileCount: result.files.length, error: null };
}

export type StreamFileResult =
  | { ok: true; body: ReadableStream<Uint8Array>; contentType: string; contentLength: string | null }
  | { ok: false; status: number; error: string };

/**
 * Streams a single file's bytes through our server using the service
 * account — the student never talks to Drive directly. Pass a Range
 * header through when present so video files can be scrubbed instead
 * of downloaded in full.
 */
export async function streamDriveFile(
  fileId: string,
  rangeHeader: string | null
): Promise<StreamFileResult> {
  const token = await getAccessToken();
  if (!token) {
    return { ok: false, status: 500, error: "Google Drive isn't configured on the server." };
  }

  try {
    const res = await fetch(
      `${DRIVE_API}/files/${fileId}?alt=media&supportsAllDrives=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(rangeHeader ? { Range: rangeHeader } : {}),
        },
      }
    );

    if (res.status === 401 || res.status === 403) {
      return { ok: false, status: 403, error: "Access to this file was denied." };
    }
    if (res.status === 404) {
      return { ok: false, status: 404, error: "File not found." };
    }
    if (!res.ok && res.status !== 206) {
      const text = await res.text().catch(() => "");
      console.error("Drive file stream failed:", res.status, text);
      return { ok: false, status: 502, error: "Couldn't fetch this file from Google Drive." };
    }
    if (!res.body) {
      return { ok: false, status: 502, error: "Google Drive returned an empty response." };
    }

    return {
      ok: true,
      body: res.body,
      contentType: res.headers.get("content-type") || "application/octet-stream",
      contentLength: res.headers.get("content-length"),
    };
  } catch (err) {
    console.error("Drive file stream threw:", err);
    return { ok: false, status: 502, error: "Couldn't reach Google Drive." };
  }
}

/** Fetches just a file's metadata (used to confirm folder membership before streaming). */
export async function getFileMeta(fileId: string): Promise<DriveFileMeta | null> {
  const token = await getAccessToken();
  if (!token) return null;

  try {
    const res = await fetch(
      `${DRIVE_API}/files/${fileId}?fields=id,name,mimeType,modifiedTime,size,parents&supportsAllDrives=true`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) return null;
    return (await res.json()) as DriveFileMeta;
  } catch {
    return null;
  }
}
