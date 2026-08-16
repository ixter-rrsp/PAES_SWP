"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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

function isLikelyDriveUrl(url: string) {
  return /drive\.google\.com/.test(url);
}

/**
 * Uploads a file to the downloadables bucket and returns its public
 * URL + size. Path is namespaced by a random prefix so two admins
 * uploading "form.pdf" on the same day don't collide.
 */
async function uploadFile(
  supabase: NonNullable<Awaited<ReturnType<typeof requireAdmin>>["supabase"]>,
  file: File
): Promise<{ url: string; sizeBytes: number } | { error: string }> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, sizeBytes: file.size };
}

/**
 * Deletes an uploaded file from storage given its public URL.
 * No-op (and no error) for Drive links or if parsing fails —
 * best-effort cleanup, never blocks the DB operation.
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
  const source = String(formData.get("source") ?? "upload") as
    | "upload"
    | "drive";
  const publishNow = formData.get("publish_now") === "on";

  if (!title) {
    return { error: "Title is required." };
  }

  let fileUrl = "";
  let fileSizeBytes: number | null = null;

  if (source === "drive") {
    fileUrl = String(formData.get("drive_url") ?? "").trim();
    if (!fileUrl) {
      return { error: "Google Drive link is required." };
    }
    if (!isLikelyDriveUrl(fileUrl)) {
      return { error: "That doesn't look like a Google Drive link." };
    }
  } else {
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { error: "Please choose a file to upload." };
    }
    const uploaded = await uploadFile(supabase, file);
    if ("error" in uploaded) {
      return { error: uploaded.error };
    }
    fileUrl = uploaded.url;
    fileSizeBytes = uploaded.sizeBytes;
  }

  const { error } = await supabase.from("downloadables").insert({
    title,
    description: description || null,
    category: category || null,
    file_url: fileUrl,
    file_size_bytes: fileSizeBytes,
    source,
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
  const source = String(formData.get("source") ?? "upload") as
    | "upload"
    | "drive";

  if (!title) {
    return { error: "Title is required." };
  }

  // Fetch current row so we know the old file to clean up if it's
  // being replaced (either a new upload, or switching to a Drive link).
  const { data: existing, error: fetchError } = await supabase
    .from("downloadables")
    .select("file_url, source")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return { error: fetchError?.message ?? "Downloadable not found." };
  }

  let fileUrl = existing.file_url;
  let fileSizeBytes: number | null | undefined = undefined; // undefined = don't touch

  if (source === "drive") {
    const driveUrl = String(formData.get("drive_url") ?? "").trim();
    if (!driveUrl) {
      return { error: "Google Drive link is required." };
    }
    if (!isLikelyDriveUrl(driveUrl)) {
      return { error: "That doesn't look like a Google Drive link." };
    }
    if (existing.source === "upload") {
      await deleteUploadedFile(supabase, existing.file_url, existing.source);
    }
    fileUrl = driveUrl;
    fileSizeBytes = null;
  } else {
    const file = formData.get("file");
    if (file instanceof File && file.size > 0) {
      const uploaded = await uploadFile(supabase, file);
      if ("error" in uploaded) {
        return { error: uploaded.error };
      }
      if (existing.source === "upload") {
        await deleteUploadedFile(supabase, existing.file_url, existing.source);
      }
      fileUrl = uploaded.url;
      fileSizeBytes = uploaded.sizeBytes;
    }
    // else: no new file chosen, keep the existing uploaded file as-is
  }

  const updatePayload: Record<string, unknown> = {
    title,
    description: description || null,
    category: category || null,
    file_url: fileUrl,
    source,
  };
  if (fileSizeBytes !== undefined) {
    updatePayload.file_size_bytes = fileSizeBytes;
  }

  const { error } = await supabase
    .from("downloadables")
    .update(updatePayload)
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
