/**
 * Pulls the Google Drive file ID out of any of the common share-link
 * shapes admins might paste in:
 *   https://drive.google.com/file/d/<id>/view?usp=sharing
 *   https://drive.google.com/open?id=<id>
 *   https://drive.google.com/uc?id=<id>&export=download
 */
export function extractDriveFileId(url: string): string | null {
  const patterns = [/\/file\/d\/([a-zA-Z0-9_-]+)/, /[?&]id=([a-zA-Z0-9_-]+)/];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function isLikelyDriveUrl(url: string) {
  return /drive\.google\.com/.test(url);
}

export const EXT_BY_MIME: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    "xlsx",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation":
    "pptx",
  "application/zip": "zip",
  "text/csv": "csv",
  "text/plain": "txt",
  "image/jpeg": "jpg",
  "image/png": "png",
};

export type DriveProbeResult = {
  accessible: boolean;
  sizeBytes: number | null;
  contentType: string | null;
  ext: string | null;
};

/**
 * Checks whether a Drive file is publicly reachable ("Anyone with the
 * link") and, where possible, its size and type — without downloading
 * the whole thing. Used both to validate a link when an admin saves it
 * and to power the live preview in the admin form.
 *
 * Strategy: request byte range 0-0 from the download endpoint. A
 * normal file responds 206 with a Content-Range header holding the
 * true size. Large files (which Drive can't virus-scan) return an
 * HTML interstitial instead — we fall back to the thumbnail endpoint
 * just to confirm accessibility + content type in that case, since
 * range requests don't help us there anyway.
 */
export async function probeDriveFile(fileId: string): Promise<DriveProbeResult> {
  try {
    const res = await fetch(
      `https://drive.google.com/uc?export=download&id=${fileId}`,
      { headers: { Range: "bytes=0-0" }, redirect: "follow" }
    );
    const contentType = res.headers.get("content-type");

    if (contentType?.includes("text/html")) {
      await res.body?.cancel().catch(() => {});
      const thumbRes = await fetch(
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w200`
      );
      const thumbType = thumbRes.headers.get("content-type");
      await thumbRes.body?.cancel().catch(() => {});
      return {
        accessible: thumbRes.ok,
        sizeBytes: null,
        contentType: thumbType,
        ext: thumbType ? EXT_BY_MIME[thumbType.split(";")[0].trim()] ?? null : null,
      };
    }

    const range = res.headers.get("content-range"); // "bytes 0-0/12345"
    const total = range ? Number(range.split("/")[1]) : null;
    await res.body?.cancel().catch(() => {});

    const accessible = res.ok || res.status === 206;
    return {
      accessible,
      sizeBytes: Number.isFinite(total) ? total : null,
      contentType,
      ext: contentType ? EXT_BY_MIME[contentType.split(";")[0].trim()] ?? null : null,
    };
  } catch {
    return { accessible: false, sizeBytes: null, contentType: null, ext: null };
  }
}
