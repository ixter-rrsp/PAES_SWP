import { createClient } from "@/lib/supabase/client";

const BUCKET = "site-images";

export type UploadImageResult = { url: string | null; error: string | null };

/**
 * Uploads a single image file to the public `site-images` bucket and
 * returns its public URL. `folder` groups uploads for tidier storage
 * browsing, e.g. "page-config/about" or "staff".
 */
export async function uploadImage(file: File, folder: string): Promise<UploadImageResult> {
  if (!file.type.startsWith("image/")) {
    return { url: null, error: "Please choose an image file." };
  }
  if (file.size > 8 * 1024 * 1024) {
    return { url: null, error: "Image is larger than 8MB." };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { url: null, error: error.message };
  }

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
