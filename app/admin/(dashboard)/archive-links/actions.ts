"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAllArchiveLinksPage } from "@/lib/data/archive-links";
import { logActivity } from "@/lib/data/activity";
import type { ArchiveLink } from "@/types";
import { extractDriveFolderId, isLikelyDriveUrl } from "@/lib/drive";
import { probeFolderAccess } from "@/lib/google-drive-service";

export type ActionResult = { error: string | null };

function revalidateArchiveLinkPaths() {
  revalidatePath("/admin/archive-links");
  revalidatePath("/slms");
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

function readFields(formData: FormData) {
  return {
    label: String(formData.get("label") ?? "").trim(),
    driveUrl: String(formData.get("drive_url") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
  };
}

/**
 * Validates a pasted Drive folder link before saving: real Drive URL,
 * a folder ID can be parsed out of it, and the service account can
 * actually see the folder (i.e. it's been shared with it). This is
 * the gate that stops an admin from publishing a collection that
 * silently shows "no resources" to every student.
 */
async function validateFolderUrl(
  url: string
): Promise<{ error: string } | { folderId: string }> {
  if (!url) return { error: "Google Drive folder link is required." };
  if (!isLikelyDriveUrl(url)) {
    return { error: "That doesn't look like a Google Drive link." };
  }
  const folderId = extractDriveFolderId(url);
  if (!folderId) {
    return { error: "Couldn't find a folder ID in that link." };
  }

  const probe = await probeFolderAccess(folderId);
  if (!probe.accessible) {
    return {
      error:
        probe.error ??
        "Couldn't access that folder. Make sure it's shared with the service account's email.",
    };
  }

  return { folderId };
}

export async function createArchiveLink(formData: FormData): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { label, driveUrl, category } = readFields(formData);
  const publishNow = formData.get("publish_now") === "on";

  if (!label) return { error: "Label is required." };

  const validated = await validateFolderUrl(driveUrl);
  if ("error" in validated) return { error: validated.error };

  const { data, error } = await supabase
    .from("archive_links")
    .insert({
      label,
      drive_folder_id: validated.folderId,
      category: category || null,
      status: publishNow ? "published" : "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "created",
    entityType: "archive_link",
    entityId: data?.id ?? null,
    entityLabel: label,
  });

  revalidateArchiveLinkPaths();
  return { error: null };
}

export async function updateArchiveLink(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { label, driveUrl, category } = readFields(formData);

  if (!label) return { error: "Label is required." };

  const validated = await validateFolderUrl(driveUrl);
  if ("error" in validated) return { error: validated.error };

  const { error } = await supabase
    .from("archive_links")
    .update({
      label,
      drive_folder_id: validated.folderId,
      category: category || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "updated",
    entityType: "archive_link",
    entityId: id,
    entityLabel: label,
  });

  revalidateArchiveLinkPaths();
  return { error: null };
}

export async function setArchiveLinkStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase
    .from("archive_links")
    .select("label")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("archive_links")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: status === "published" ? "published" : "unpublished",
    entityType: "archive_link",
    entityId: id,
    entityLabel: existing?.label ?? "Untitled archive link",
  });

  revalidateArchiveLinkPaths();
  return { error: null };
}

export async function deleteArchiveLink(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase
    .from("archive_links")
    .select("label")
    .eq("id", id)
    .single();

  const { data: deleted, error } = await supabase
    .from("archive_links")
    .delete()
    .eq("id", id)
    .select("id");

  if (!error && (!deleted || deleted.length === 0)) {
    // RLS (or a stale id) silently matched zero rows — delete()
    // alone reports success even when nothing was removed. Surface
    // that as a real error instead of letting the UI optimistically
    // clear a row that's still in the database.
    return { error: "Delete was blocked or nothing matched that id." };
  }

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "deleted",
    entityType: "archive_link",
    entityId: id,
    entityLabel: existing?.label ?? "Untitled archive link",
  });

  revalidateArchiveLinkPaths();
  return { error: null };
}

export async function fetchArchiveLinksPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: ArchiveLink[]; hasMore: boolean; error: string | null }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { items: [], hasMore: false, error: authError };

  const { items, hasMore } = await getAllArchiveLinksPage(offset, limit, status);
  return { items, hasMore, error: null };
}
