import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { findFileInTree, streamDriveFile } from "@/lib/google-drive-service";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Heavier than the list route (whole file body, possibly video) —
// keep it tighter, matching the Downloadables download limit.
const LIMIT = 20;
const WINDOW_MS = 60_000;

/**
 * GET /api/resource-collections/[id]/files/[fileId]
 * Streams one file from a published collection's folder through our
 * server. The student never receives a Drive URL or Drive
 * permissions — only bytes from our own domain. Supports Range
 * requests so video files can be scrubbed instead of downloaded whole.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; fileId: string }> }
) {
  const rate = checkRateLimit(`resource-file:${getClientIp(req)}`, LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const { id, fileId } = await params;
  const supabase = await createClient();

  const { data: collection, error } = await supabase
    .from("archive_links")
    .select("drive_folder_id, status")
    .eq("id", id)
    .single();

  if (error || !collection || collection.status !== "published" || !collection.drive_folder_id) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  // Confirm this fileId actually lives somewhere in the collection's
  // folder tree — without this check, a valid published-collection id
  // would let someone pull the fileId query param to fetch any file
  // the service account can see, not just ones in this collection.
  //
  // This walks the collection's subfolders looking for the file,
  // rather than trusting the file's own `parents` field: for files
  // shared with a service account (rather than owned by it), Drive
  // can return an empty `parents` array even though the file
  // genuinely lives in the folder tree. Walking the tree we already
  // know is public also means this works the same whether the file
  // sits at the collection's root or several subfolders deep.
  const meta = await findFileInTree(collection.drive_folder_id, fileId);
  if (!meta) {
    return NextResponse.json({ error: "File not found in this collection." }, { status: 404 });
  }

  const rangeHeader = req.headers.get("range");
  const result = await streamDriveFile(fileId, rangeHeader);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const safeName = meta.name.replace(/[\\/:*?"<>|]/g, "").trim() || "download";
  const asciiFallback = safeName.replace(/[^\x20-\x7E]/g, "_");

  const isVideo = meta.mimeType.startsWith("video/");
  const headers: Record<string, string> = {
    "Content-Type": result.contentType,
    // Videos: let the browser play inline / seek. Everything else:
    // force download, same as the Downloadables proxy.
    "Content-Disposition": `${isVideo ? "inline" : "attachment"}; filename="${asciiFallback}"; filename*=UTF-8''${encodeURIComponent(safeName)}`,
    "Cache-Control": "private, no-store",
    "Accept-Ranges": "bytes",
  };
  if (result.contentLength) headers["Content-Length"] = result.contentLength;

  return new NextResponse(result.body, {
    status: rangeHeader ? 206 : 200,
    headers,
  });
}
