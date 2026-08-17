import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isFolderWithinTree, listFolderContents } from "@/lib/google-drive-service";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const LIMIT = 30;
const WINDOW_MS = 60_000;

/**
 * GET /api/resource-collections/[id]?folder=<optional subfolder id>
 * Public: lists the contents of a published collection's Drive
 * folder — both subfolders and files — one directory at a time. The
 * folder itself stays private — this is the only path a student has
 * to its contents, per the architecture:
 *   Student -> SLMS backend -> (authz check) -> Drive API -> folder
 *
 * Collections can contain nested subfolders (e.g. Quarter > Subject),
 * so this is lazy: with no `folder` param it lists the collection's
 * root; the client passes `folder=<id>` to descend into a subfolder
 * returned by a previous call. Any `folder` param is checked against
 * the collection's own tree before use, so a student can't pass an
 * arbitrary Drive folder id the service account happens to see.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const rate = checkRateLimit(`resource-collection:${getClientIp(req)}`, LIMIT, WINDOW_MS);
  if (!rate.ok) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: collection, error } = await supabase
    .from("archive_links")
    .select("id, label, category, drive_folder_id, status")
    .eq("id", id)
    .single();

  if (error || !collection || collection.status !== "published") {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (!collection.drive_folder_id) {
    return NextResponse.json(
      { error: "This collection doesn't have a Google Drive folder configured yet." },
      { status: 409 }
    );
  }

  const requestedFolder = req.nextUrl.searchParams.get("folder")?.trim() || null;
  let targetFolderId = collection.drive_folder_id;

  if (requestedFolder && requestedFolder !== collection.drive_folder_id) {
    const withinTree = await isFolderWithinTree(collection.drive_folder_id, requestedFolder);
    if (!withinTree) {
      return NextResponse.json({ error: "Folder not found in this collection." }, { status: 404 });
    }
    targetFolderId = requestedFolder;
  }

  const result = await listFolderContents(targetFolderId);
  if (!result.ok) {
    const status = result.error.code === "not_found" ? 404 : result.error.code === "unauthorized" ? 502 : 500;
    return NextResponse.json({ error: result.error.message }, { status });
  }

  return NextResponse.json(
    {
      collection: { id: collection.id, label: collection.label, category: collection.category },
      folderId: targetFolderId,
      isRoot: targetFolderId === collection.drive_folder_id,
      folders: result.folders,
      files: result.files,
    },
    {
      headers: {
        // Short cache: file lists change rarely, but admins do add
        // files directly in Drive without touching our DB.
        "Cache-Control": "private, max-age=60",
      },
    }
  );
}
