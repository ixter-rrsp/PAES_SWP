import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractDriveFileId, isLikelyDriveUrl, probeDriveFile } from "@/lib/drive";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const LIMIT = 30;
const WINDOW_MS = 60_000;

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

/**
 * GET /api/admin/drive-preview?url=<drive file link>
 * Lets the Downloadables admin form confirm a pasted single-file link
 * is publicly reachable and shows its size/type before they save.
 *
 * NOTE: this used to accidentally contain the *folder*-probing logic
 * (probeFolderAccess), which belongs to the Archive Links feature and
 * now lives at /api/admin/drive-folder-preview instead. That mixup is
 * why Downloadables previews were broken and Archive Links' folder
 * check 404'd.
 */
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const rate = checkRateLimit(`drive-preview:${getClientIp(req)}`, LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json({ error: "Slow down a moment." }, { status: 429 });
  }

  const url = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!url || !isLikelyDriveUrl(url)) {
    return NextResponse.json(
      { accessible: false, error: "Not a Google Drive link." },
      { status: 200 }
    );
  }

  const fileId = extractDriveFileId(url);
  if (!fileId) {
    return NextResponse.json(
      { accessible: false, error: "Couldn't find a file ID in that link." },
      { status: 200 }
    );
  }

  const probe = await probeDriveFile(fileId);
  return NextResponse.json({
    accessible: probe.accessible,
    sizeBytes: probe.sizeBytes,
    contentType: probe.contentType,
    ext: probe.ext,
    error: probe.accessible ? null : "This file isn't publicly accessible.",
    fileId,
  });
}
