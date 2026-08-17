import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractDriveFolderId, isLikelyDriveUrl } from "@/lib/drive";
import { probeFolderAccess } from "@/lib/google-drive-service";
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
 * GET /api/admin/drive-folder-preview?url=<drive folder link>
 * Lets the admin form confirm the service account can actually see a
 * pasted folder — and how many files are in it — before saving.
 */
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const rate = checkRateLimit(`drive-folder-preview:${getClientIp(req)}`, LIMIT, WINDOW_MS);
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

  const folderId = extractDriveFolderId(url);
  if (!folderId) {
    return NextResponse.json(
      { accessible: false, error: "Couldn't find a folder ID in that link." },
      { status: 200 }
    );
  }

  const probe = await probeFolderAccess(folderId);
  return NextResponse.json({
    accessible: probe.accessible,
    fileCount: probe.fileCount,
    error: probe.error,
    folderId,
  });
}
