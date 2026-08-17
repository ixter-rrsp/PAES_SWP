"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
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

  const { error } = await supabase.from("archive_links").insert({
    label,
    drive_folder_id: validated.folderId,
    category: category || null,
    status: publishNow ? "published" : "draft",
  });

  if (error) return { error: error.message };

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

  revalidateArchiveLinkPaths();
  return { error: null };
}

export async function setArchiveLinkStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("archive_links")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateArchiveLinkPaths();
  return { error: null };
}

export async function deleteArchiveLink(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("archive_links").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateArchiveLinkPaths();
  return { error: null };
}
