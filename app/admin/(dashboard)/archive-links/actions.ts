"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isLikelyDriveUrl } from "@/lib/thumbnail/drive";

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
    url: String(formData.get("url") ?? "").trim(),
    category: String(formData.get("category") ?? "").trim(),
  };
}

export async function createArchiveLink(formData: FormData): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { label, url, category } = readFields(formData);
  const publishNow = formData.get("publish_now") === "on";

  if (!label) return { error: "Label is required." };
  if (!url) return { error: "Google Drive link is required." };
  if (!isLikelyDriveUrl(url)) {
    return { error: "That doesn't look like a Google Drive link." };
  }

  const { error } = await supabase.from("archive_links").insert({
    label,
    url,
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

  const { label, url, category } = readFields(formData);

  if (!label) return { error: "Label is required." };
  if (!url) return { error: "Google Drive link is required." };
  if (!isLikelyDriveUrl(url)) {
    return { error: "That doesn't look like a Google Drive link." };
  }

  const { error } = await supabase
    .from("archive_links")
    .update({ label, url, category: category || null })
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
