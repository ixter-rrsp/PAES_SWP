"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { hashAccessCode, verifyAccessCode } from "@/lib/access-code";
import { checkRateLimit } from "@/lib/rate-limit";
import { isLikelyOneDriveUrl, normalizeOneDriveUrl } from "@/lib/onedrive";
import { logActivity } from "@/lib/data/activity";

export type ActionResult = { error: string | null };

function revalidateSbmPaths() {
  // SBM now lives admin-side only — no public route to revalidate.
  revalidatePath("/admin/sbm-pages");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, user: null, error: "Not authenticated." as const };
  }

  return { supabase, user, error: null };
}

/**
 * Confirms the code entered in the admin UI matches the folder's
 * stored hash before any edit/delete goes through. Rate-limited per
 * admin user so a compromised session can't be used to brute-force a
 * folder's code.
 */
async function verifyFolderCode(
  supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>,
  userId: string,
  folderId: string,
  code: string
): Promise<{ error: string } | { ok: true }> {
  const rate = checkRateLimit(`sbm-folder-code:${userId}`, 10, 60_000);
  if (!rate.ok) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }

  const trimmed = code.trim();
  if (!trimmed) return { error: "Enter the folder's access code to continue." };

  const { data: folder, error } = await supabase
    .from("sbm_folders")
    .select("access_code_hash, access_code_salt")
    .eq("id", folderId)
    .single();

  if (error || !folder || !folder.access_code_hash || !folder.access_code_salt) {
    return { error: "That folder couldn't be found." };
  }

  const valid = verifyAccessCode(trimmed, folder.access_code_hash, folder.access_code_salt);
  if (!valid) return { error: "Incorrect access code." };

  return { ok: true };
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

  const { data, error } = await supabase
    .from("sbm_years")
    .insert({
      school_year: schoolYear,
      content: "",
      status: "draft",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "created",
    entityType: "sbm_year",
    entityId: data?.id ?? null,
    entityLabel: schoolYear,
  });

  revalidateSbmPaths();
  return { error: null };
}

export async function updateSbmYearContent(
  id: string,
  content: string
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase
    .from("sbm_years")
    .select("school_year")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("sbm_years")
    .update({ content })
    .eq("id", id);

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "updated",
    entityType: "sbm_year",
    entityId: id,
    entityLabel: existing?.school_year ?? "Unknown school year",
  });

  revalidateSbmPaths();
  return { error: null };
}

export async function deleteSbmYear(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase
    .from("sbm_years")
    .select("school_year")
    .eq("id", id)
    .single();

  const { data: deleted, error } = await supabase
    .from("sbm_years")
    .delete()
    .eq("id", id)
    .select("id");

  if (!error && (!deleted || deleted.length === 0)) {
    return { error: "Delete was blocked or nothing matched that id." };
  }

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "deleted",
    entityType: "sbm_year",
    entityId: id,
    entityLabel: existing?.school_year ?? "Unknown school year",
  });

  revalidateSbmPaths();
  return { error: null };
}

// ---------- OneDrive folder links ----------
//
// SBM now lives admin-side only (no public unlock flow), so the access
// code's job changed: it's a mandatory gate on every action taken
// against a folder. A folder can't be created without one, and editing
// or deleting an existing folder requires re-entering its current code
// — there's no "remove the code" escape hatch anymore.

export async function createSbmFolder(
  sbmYearId: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const onedriveUrl = String(formData.get("onedrive_url") ?? "").trim();
  const accessCode = String(formData.get("access_code") ?? "").trim();

  if (!label) return { error: "Folder name is required." };
  if (!accessCode) return { error: "An access code is required for every folder." };

  const validated = validateFolderUrl(onedriveUrl);
  if ("error" in validated) return { error: validated.error };

  const { hash, salt } = hashAccessCode(accessCode);

  const { data, error } = await supabase
    .from("sbm_folders")
    .insert({
      sbm_year_id: sbmYearId,
      label,
      description: description || null,
      onedrive_url: validated.url,
      access_code_hash: hash,
      access_code_salt: salt,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "created",
    entityType: "sbm_folder",
    entityId: data?.id ?? null,
    entityLabel: label,
  });

  revalidateSbmPaths();
  return { error: null };
}

export async function updateSbmFolder(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!supabase || !user) return { error: authError };

  const currentCode = String(formData.get("current_access_code") ?? "");
  const verified = await verifyFolderCode(supabase, user.id, id, currentCode);
  if ("error" in verified) return { error: verified.error };

  const label = String(formData.get("label") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const onedriveUrl = String(formData.get("onedrive_url") ?? "").trim();
  const newAccessCode = String(formData.get("new_access_code") ?? "").trim();

  if (!label) return { error: "Folder name is required." };

  const validated = validateFolderUrl(onedriveUrl);
  if ("error" in validated) return { error: validated.error };

  const update: Record<string, unknown> = {
    label,
    description: description || null,
    onedrive_url: validated.url,
  };

  // Only rotate the code if a new one was actually typed in.
  if (newAccessCode) {
    const { hash, salt } = hashAccessCode(newAccessCode);
    update.access_code_hash = hash;
    update.access_code_salt = salt;
  }

  const { error } = await supabase.from("sbm_folders").update(update).eq("id", id);

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "updated",
    entityType: "sbm_folder",
    entityId: id,
    entityLabel: label,
  });

  revalidateSbmPaths();
  return { error: null };
}

export async function deleteSbmFolder(id: string, code: string): Promise<ActionResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!supabase || !user) return { error: authError };

  const verified = await verifyFolderCode(supabase, user.id, id, code);
  if ("error" in verified) return { error: verified.error };

  const { data: existing } = await supabase
    .from("sbm_folders")
    .select("label")
    .eq("id", id)
    .single();

  const { data: deleted, error } = await supabase
    .from("sbm_folders")
    .delete()
    .eq("id", id)
    .select("id");

  if (!error && (!deleted || deleted.length === 0)) {
    return { error: "Delete was blocked or nothing matched that id." };
  }

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "deleted",
    entityType: "sbm_folder",
    entityId: id,
    entityLabel: existing?.label ?? "Unknown folder",
  });

  revalidateSbmPaths();
  return { error: null };
}

export type OpenFolderResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Resolves a folder's OneDrive link only after the code checks out —
 * opening/viewing a folder is an "action" too, so it's gated the same
 * way edit and delete are.
 */
export async function openSbmFolder(id: string, code: string): Promise<OpenFolderResult> {
  const { supabase, user, error: authError } = await requireAdmin();
  if (!supabase || !user) return { ok: false, error: authError ?? "Not authenticated." };

  const verified = await verifyFolderCode(supabase, user.id, id, code);
  if ("error" in verified) return { ok: false, error: verified.error };

  const { data: folder, error } = await supabase
    .from("sbm_folders")
    .select("onedrive_url")
    .eq("id", id)
    .single();

  if (error || !folder) return { ok: false, error: "That folder couldn't be found." };

  return { ok: true, url: folder.onedrive_url };
}
