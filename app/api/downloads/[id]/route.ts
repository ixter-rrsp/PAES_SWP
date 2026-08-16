import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractDriveFileId, EXT_BY_MIME } from "@/lib/thumbnail/drive";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Downloads are heavier than thumbnail fetches (whole file, not a
// small preview) — keep this tighter. 20 downloads/minute per IP is
// generous for a real visitor, tight enough to blunt scripted abuse.
const LIMIT = 20;
const WINDOW_MS = 60_000;

/**
 * Fetches the file from Google Drive. For files under ~100MB this
 * returns the bytes directly. Larger files get an HTML "can't scan
 * for viruses" interstitial instead of the file — we detect that and
 * retry with the confirm token it embeds.
 */
async function fetchDriveFile(fileId: string): Promise<Response | null> {
  const base = "https://drive.google.com/uc?export=download";
  let res = await fetch(`${base}&id=${fileId}`, { redirect: "follow" });

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) {
    const html = await res.text();
    const confirmMatch = html.match(/confirm=([0-9A-Za-z_-]+)/);
    const uuidMatch = html.match(/uuid=([0-9a-zA-Z-]+)/);

    if (!confirmMatch) return null;

    const uuidParam = uuidMatch ? `&uuid=${uuidMatch[1]}` : "";
    res = await fetch(
      `${base}&id=${fileId}&confirm=${confirmMatch[1]}${uuidParam}`,
      { redirect: "follow" }
    );

    const retryContentType = res.headers.get("content-type") ?? "";
    if (retryContentType.includes("text/html")) return null;
  }

  return res;
}

/** Pulls the filename Drive sends back, e.g. attachment; filename="Form.pdf" */
function extractFilenameFromContentDisposition(
  header: string | null
): string | null {
  if (!header) return null;
  const starMatch = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (starMatch) {
    try {
      return decodeURIComponent(starMatch[1]);
    } catch {
      // fall through
    }
  }
  const plainMatch = header.match(/filename="?([^";]+)"?/i);
  return plainMatch ? plainMatch[1] : null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`download:${ip}`, LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many downloads from this connection. Try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rate.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: item, error } = await supabase
    .from("downloadables")
    .select("title, file_url, source, status, file_ext")
    .eq("id", id)
    .single();

  if (error || !item || item.status !== "published") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (item.source !== "drive") {
    // Legacy Supabase-uploaded row — send it straight to the stored
    // public URL rather than trying to proxy it as a Drive file.
    return NextResponse.redirect(item.file_url);
  }

  const fileId = extractDriveFileId(item.file_url);
  if (!fileId) {
    return NextResponse.json(
      { error: "This link isn't a valid Google Drive file link." },
      { status: 400 }
    );
  }

  let driveRes: Response | null;
  try {
    driveRes = await fetchDriveFile(fileId);
  } catch {
    driveRes = null;
  }

  if (!driveRes || !driveRes.ok || !driveRes.body) {
    return NextResponse.json(
      {
        error:
          "Couldn't fetch this file from Google Drive. Make sure it's shared as \"Anyone with the link.\"",
      },
      { status: 502 }
    );
  }

  const contentType =
    driveRes.headers.get("content-type") || "application/octet-stream";

  // Prefer the real filename (and extension) Drive itself reports.
  // Fall back to <title>.<ext guessed from mime type> if Drive
  // didn't send one, and only bare <title> as a last resort.
  const driveFilename = extractFilenameFromContentDisposition(
    driveRes.headers.get("content-disposition")
  );

  const baseTitle = item.title.replace(/[\\/:*?"<>|]/g, "").trim() || "download";
  const hasExtension = /\.[a-zA-Z0-9]{2,5}$/.test(baseTitle);
  const guessedExt = item.file_ext || EXT_BY_MIME[contentType.split(";")[0].trim()];

  const safeName =
    driveFilename ??
    (hasExtension
      ? baseTitle
      : guessedExt
      ? `${baseTitle}.${guessedExt}`
      : baseTitle);

  // Plain filename for older clients, plus RFC 5987 filename* for
  // correct handling of special characters in modern browsers.
  const asciiFallback = safeName.replace(/[^\x20-\x7E]/g, "_");

  return new NextResponse(driveRes.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(
        safeName
      )}`,
      "Cache-Control": "no-store",
    },
  });
}
