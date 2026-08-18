"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAllDownloadablesPage } from "@/lib/data/downloadables";
import type { Downloadable } from "@/types";
import { extractDriveFileId, isLikelyDriveUrl, probeDriveFile } from "@/lib/thumbnail/drive";

export type ActionResult = { error: string | null };

const BUCKET = "downloadables";

// Every path that shows downloadable data anywhere on the site.
function revalidateDownloadablePaths() {
  revalidatePath("/admin/downloadables");
  revalidatePath("/downloadables");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: "Not authenticated." as const };
  }

  return { supabase, error: null };
}

/**
 * Validates a pasted Drive link before it's saved: makes sure it's a
 * real Drive URL, that a file ID can be parsed out of it, and that
 * the file is actually reachable ("Anyone with the link"). Returns
 * the size/extension info to store alongside the link so we don't
 * need to re-probe on every download.
 */
async function validateDriveUrl(
  url: string
): Promise<{ error: string } | { fileSizeBytes: number | null; fileExt: string | null }> {
  if (!url) {
    return { error: "Google Drive link is required." };
  }
  if (!isLikelyDriveUrl(url)) {
    return { error: "That doesn't look like a Google Drive link." };
  }
  const fileId = extractDriveFileId(url);
  if (!fileId) {
    return { error: "Couldn't find a file ID in that link." };
  }

  const probe = await probeDriveFile(fileId);
  if (!probe.accessible) {
    return {
      error:
        'Couldn\'t open that file. Make sure sharing is set to "Anyone with the link."',
    };
  }

  return { fileSizeBytes: probe.sizeBytes, fileExt: probe.ext };
}

/**
 * Deletes a legacy Supabase-uploaded file from storage given its
 * public URL. No-op for Drive links or if parsing fails — this only
 * exists to clean up rows created back when uploads were allowed.
 */
async function deleteUploadedFile(
  supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>,
  fileUrl: string,
  source: string
) {
  if (source !== "upload") return;
  const marker = `/${BUCKET}/`;
  const idx = fileUrl.indexOf(marker);
  if (idx === -1) return;
  const path = fileUrl.slice(idx + marker.length);
  if (!path) return;
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function createDownloadable(
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const publishNow = formData.get("publish_now") === "on";

  if (!title) {
    return { error: "Title is required." };
  }

  const fileUrl = String(formData.get("drive_url") ?? "").trim();
  const validated = await validateDriveUrl(fileUrl);
  if ("error" in validated) {
    return { error: validated.error };
  }

  const { error } = await supabase.from("downloadables").insert({
    title,
    description: description || null,
    category: category || null,
    file_url: fileUrl,
    file_size_bytes: validated.fileSizeBytes,
    file_ext: validated.fileExt,
    source: "drive",
    status: publishNow ? "published" : "draft",
  });

  if (error) {
    return { error: error.message };
  }

  revalidateDownloadablePaths();
  return { error: null };
}

export async function updateDownloadable(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();

  if (!title) {
    return { error: "Title is required." };
  }

  const driveUrl = String(formData.get("drive_url") ?? "").trim();
  const validated = await validateDriveUrl(driveUrl);
  if ("error" in validated) {
    return { error: validated.error };
  }

  // Fetch current row so a legacy Supabase-uploaded file gets cleaned
  // up from storage when it's replaced by a Drive link.
  const { data: existing, error: fetchError } = await supabase
    .from("downloadables")
    .select("file_url, source")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return { error: fetchError?.message ?? "Downloadable not found." };
  }

  if (existing.source === "upload") {
    await deleteUploadedFile(supabase, existing.file_url, existing.source);
  }

  const { error } = await supabase
    .from("downloadables")
    .update({
      title,
      description: description || null,
      category: category || null,
      file_url: driveUrl,
      file_size_bytes: validated.fileSizeBytes,
      file_ext: validated.fileExt,
      source: "drive",
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateDownloadablePaths();
  return { error: null };
}

export async function deleteDownloadable(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase
    .from("downloadables")
    .select("file_url, source")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("downloadables")
    .delete()
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  if (existing) {
    await deleteUploadedFile(supabase, existing.file_url, existing.source);
  }

  revalidateDownloadablePaths();
  return { error: null };
}

export async function setDownloadableStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("downloadables")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateDownloadablePaths();
  return { error: null };
}

export async function fetchDownloadablesPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: Downloadable[]; hasMore: boolean; error: string | null }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { items: [], hasMore: false, error: authError };

  const { items, hasMore } = await getAllDownloadablesPage(offset, limit, status);
  return { items, hasMore, error: null };
}
