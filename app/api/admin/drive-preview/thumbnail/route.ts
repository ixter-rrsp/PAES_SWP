import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractDriveFileId, isLikelyDriveUrl } from "@/lib/thumbnail/drive";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}

/**
 * GET /api/admin/drive-preview/thumbnail?url=<drive share link>
 * Streams a thumbnail for a link the admin has pasted but not yet
 * saved, so the form can show a preview before submitting. Admin-only
 * — the public site uses /api/downloads/[id]/thumbnail instead, which
 * only works for published rows.
 */
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const url = req.nextUrl.searchParams.get("url")?.trim() ?? "";
  if (!url || !isLikelyDriveUrl(url)) {
    return NextResponse.json({ error: "Not a Google Drive link." }, { status: 400 });
  }

  const fileId = extractDriveFileId(url);
  if (!fileId) {
    return NextResponse.json({ error: "No preview available." }, { status: 404 });
  }

  let driveRes: Response;
  try {
    driveRes = await fetch(
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`,
      { redirect: "follow" }
    );
  } catch {
    return NextResponse.json({ error: "Preview unavailable." }, { status: 502 });
  }

  if (!driveRes.ok || !driveRes.body) {
    return NextResponse.json({ error: "Preview unavailable." }, { status: 502 });
  }

  const contentType = driveRes.headers.get("content-type") || "image/jpeg";

  return new NextResponse(driveRes.body, {
    headers: {
      "Content-Type": contentType,
      // Not cached — the admin may be iterating through several
      // candidate links, each keyed by the same query shape.
      "Cache-Control": "no-store",
    },
  });
}
