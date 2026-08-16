import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { extractDriveFileId } from "@/lib/thumbnail/drive";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Thumbnails are small and cached client/edge-side (see headers
// below), so this can be looser than the download limit — mainly
// here to stop a scripted loop from bypassing the cache.
const LIMIT = 60;
const WINDOW_MS = 60_000;

// Google renders this for previewable files (PDFs, docs, images, etc)
// as an actual page-1 render — it's the same thumbnail the Drive UI
// and "open in new tab" preview use. Undocumented but stable and
// works for anything shared as "Anyone with the link."
function driveThumbnailUrl(fileId: string, width: number) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${width}`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const rate = checkRateLimit(`thumbnail:${ip}`, LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again shortly." },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil((rate.resetAt - Date.now()) / 1000).toString(),
        },
      }
    );
  }

  const { id } = await params;
  const width = Math.min(
    Math.max(Number(req.nextUrl.searchParams.get("w")) || 400, 100),
    1600
  );

  const supabase = await createClient();
  const { data: item, error } = await supabase
    .from("downloadables")
    .select("file_url, source, status")
    .eq("id", id)
    .single();

  if (error || !item || item.status !== "published" || item.source !== "drive") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const fileId = extractDriveFileId(item.file_url);
  if (!fileId) {
    return NextResponse.json({ error: "No preview available." }, { status: 404 });
  }

  let driveRes: Response;
  try {
    driveRes = await fetch(driveThumbnailUrl(fileId, width), {
      redirect: "follow",
    });
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
      // Thumbnails rarely change and this is hit once per card per
      // page load — cache it client + edge side for a day.
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
