"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hashAccessCode } from "@/lib/access-code";
import { isLikelyOneDriveUrl, normalizeOneDriveUrl } from "@/lib/onedrive";
import type { SbmYearStatus } from "@/types";

export type ActionResult = { error: string | null };

function revalidateSbmPaths() {
  revalidatePath("/admin/sbm-pages");
  revalidatePath("/sbm");
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

function validateFolderUrl(url: string): { error: string } | { url: string } {
  if (!url) return { error: "OneDrive folder link is required." };
  if (!isLikelyOneDriveUrl(url)) {
    return {
      error:
        "That doesn't look like a OneDrive link (expected onedrive.live.com, 1drv.ms, or a sharepoint.com folder link).",
    };
  }
  return { url: normalizeOneDriveUrl(url) };
}

// ---------- School years ----------

export async function createSbmYear(formData: FormData): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const schoolYear = String(formData.get("school_year") ?? "").trim();
  if (!schoolYear) return { error: "School year is required, e.g. 2024-2025." };

  const { error } = await supabase.from("sbm_years").insert({
    school_year: schoolYear,
    content: "",
    status: "draft",
  });

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}

export async function updateSbmYearContent(
  id: string,
  content: string
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("sbm_years")
    .update({ content })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}

export async function setSbmYearStatus(
  id: string,
  status: SbmYearStatus
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("sbm_years")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}

export async function deleteSbmYear(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("sbm_years").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}

// ---------- OneDrive folder links ----------

/**
 * access_code is optional plain text from the form. Empty/omitted on
 * create = no gate, folder opens directly. On update, empty = leave
 * whatever's already stored untouched (so re-saving other fields
 * doesn't accidentally wipe a code) — use clearSbmFolderAccessCode to
 * remove one deliberately.
 */
function readAccessCode(formData: FormData): string {
  return String(formData.get("access_code") ?? "").trim();
}

export async function createSbmFolder(
  sbmYearId: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const onedriveUrl = String(formData.get("onedrive_url") ?? "").trim();
  const accessCode = readAccessCode(formData);

  if (!label) return { error: "Folder name is required." };

  const validated = validateFolderUrl(onedriveUrl);
  if ("error" in validated) return { error: validated.error };

  const codeFields = accessCode
    ? (() => {
        const { hash, salt } = hashAccessCode(accessCode);
        return { access_code_hash: hash, access_code_salt: salt };
      })()
    : { access_code_hash: null, access_code_salt: null };

  const { error } = await supabase.from("sbm_folders").insert({
    sbm_year_id: sbmYearId,
    label,
    description: description || null,
    onedrive_url: validated.url,
    ...codeFields,
  });

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}

export async function updateSbmFolder(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const onedriveUrl = String(formData.get("onedrive_url") ?? "").trim();
  const accessCode = readAccessCode(formData);

  if (!label) return { error: "Folder name is required." };

  const validated = validateFolderUrl(onedriveUrl);
  if ("error" in validated) return { error: validated.error };

  const update: Record<string, unknown> = {
    label,
    description: description || null,
    onedrive_url: validated.url,
  };

  // Only touch the code if a new one was actually typed in — leaves
  // an existing gate (or the absence of one) alone otherwise.
  if (accessCode) {
    const { hash, salt } = hashAccessCode(accessCode);
    update.access_code_hash = hash;
    update.access_code_salt = salt;
  }

  const { error } = await supabase.from("sbm_folders").update(update).eq("id", id);

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}

/** Removes a folder's access code so it opens directly again. */
export async function clearSbmFolderAccessCode(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("sbm_folders")
    .update({ access_code_hash: null, access_code_salt: null })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}

export async function deleteSbmFolder(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("sbm_folders").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidateSbmPaths();
  return { error: null };
}
