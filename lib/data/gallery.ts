import { createClient } from "@/lib/supabase/server";
import type { Gallery, GalleryFrame, GalleryWithFrames } from "@/types";

/**
 * Admin read: every gallery layout, newest first. Mirrors the list
 * pattern used by other admin sections (staff, events, ...).
 */
export async function getAllGalleries(): Promise<Gallery[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllGalleries failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Public read: every published gallery with its frames, newest
 * first, for the public /gallery page. RLS also enforces
 * "published only" independently — this mirrors that at the query
 * level so unpublished frames are never even requested.
 */
export async function getPublishedGalleries(): Promise<GalleryWithFrames[]> {
  const supabase = await createClient();

  const { data: galleries, error: galleriesError } = await supabase
    .from("gallery")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (galleriesError) {
    console.error("getPublishedGalleries failed:", galleriesError.message);
    return [];
  }

  if (!galleries || galleries.length === 0) return [];

  const { data: frames, error: framesError } = await supabase
    .from("gallery_frames")
    .select("*")
    .in(
      "gallery_id",
      galleries.map((g) => g.id)
    )
    .order("sort_order", { ascending: true });

  if (framesError) {
    console.error("getPublishedGalleries (frames) failed:", framesError.message);
    return galleries.map((g) => ({ ...g, frames: [] }));
  }

  return galleries.map((g) => ({
    ...g,
    frames: (frames ?? []).filter((f) => f.gallery_id === g.id) as GalleryFrame[],
  }));
}

/**
 * Admin read: a single gallery plus its saved frames, ordered so the
 * grid reconstructs identically to how it was last saved.
 */
export async function getGalleryWithFrames(id: string): Promise<GalleryWithFrames | null> {
  const supabase = await createClient();

  const { data: gallery, error: galleryError } = await supabase
    .from("gallery")
    .select("*")
    .eq("id", id)
    .single();

  if (galleryError || !gallery) {
    if (galleryError) console.error("getGalleryWithFrames failed:", galleryError.message);
    return null;
  }

  const { data: frames, error: framesError } = await supabase
    .from("gallery_frames")
    .select("*")
    .eq("gallery_id", id)
    .order("sort_order", { ascending: true });

  if (framesError) {
    console.error("getGalleryWithFrames (frames) failed:", framesError.message);
    return { ...gallery, frames: [] };
  }

  return { ...gallery, frames: (frames ?? []) as GalleryFrame[] };
}
