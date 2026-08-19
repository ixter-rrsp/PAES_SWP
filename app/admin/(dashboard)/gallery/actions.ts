"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/data/activity";
import type { GalleryFrame } from "@/types";

export type ActionResult = { error: string | null };

function revalidateGalleryPaths(id?: string) {
  revalidatePath("/admin/gallery");
  if (id) revalidatePath(`/admin/gallery/${id}`);
  revalidatePath("/gallery");
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

/** A frame shape as sent up from the grid editor, before it has an id. */
type FrameInput = {
  row_start: number;
  column_start: number;
  row_span: number;
  column_span: number;
  image_url: string | null;
  sort_order: number;
};

/**
 * Rejects out-of-bounds frames and any pair of frames whose
 * rectangles overlap. Mirrors the client-side checks so a
 * misbehaving or bypassed client can never corrupt a saved layout.
 */
function validateFrames(
  frames: FrameInput[],
  rows: number,
  columns: number
): string | null {
  for (const f of frames) {
    if (f.row_span < 1 || f.column_span < 1) {
      return "Every frame must span at least one row and one column.";
    }
    if (
      f.row_start < 1 ||
      f.column_start < 1 ||
      f.row_start + f.row_span - 1 > rows ||
      f.column_start + f.column_span - 1 > columns
    ) {
      return "A frame falls outside the grid bounds.";
    }
  }

  for (let i = 0; i < frames.length; i++) {
    for (let j = i + 1; j < frames.length; j++) {
      const a = frames[i];
      const b = frames[j];
      const overlaps =
        a.row_start < b.row_start + b.row_span &&
        a.row_start + a.row_span > b.row_start &&
        a.column_start < b.column_start + b.column_span &&
        a.column_start + a.column_span > b.column_start;
      if (overlaps) {
        return "Image frames cannot overlap.";
      }
    }
  }

  return null;
}

export async function createGallery(formData: FormData): Promise<ActionResult & { id?: string }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const rows = Math.max(1, Number(formData.get("rows") ?? 4) || 4);
  const columns = Math.max(1, Number(formData.get("columns") ?? 8) || 8);

  if (!title) return { error: "Gallery name is required." };
  if (rows > 40 || columns > 40) return { error: "Grid is too large (max 40 x 40)." };

  const { data, error } = await supabase
    .from("gallery")
    .insert({ title, rows, columns })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "created",
    entityType: "gallery",
    entityId: data?.id ?? null,
    entityLabel: title,
  });

  revalidateGalleryPaths();
  return { error: null, id: data?.id };
}

export async function updateGalleryMeta(id: string, formData: FormData): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const rows = Math.max(1, Number(formData.get("rows") ?? 4) || 4);
  const columns = Math.max(1, Number(formData.get("columns") ?? 8) || 8);

  if (!title) return { error: "Gallery name is required." };
  if (rows > 40 || columns > 40) return { error: "Grid is too large (max 40 x 40)." };

  // Shrinking the grid could strand existing frames outside the new
  // bounds — refuse rather than silently truncating someone's layout.
  const { data: frames, error: framesError } = await supabase
    .from("gallery_frames")
    .select("row_start, column_start, row_span, column_span")
    .eq("gallery_id", id);

  if (framesError) return { error: framesError.message };

  const outOfBounds = (frames ?? []).some(
    (f) => f.row_start + f.row_span - 1 > rows || f.column_start + f.column_span - 1 > columns
  );
  if (outOfBounds) {
    return {
      error:
        "Can't shrink the grid below the size needed by existing frames. Remove or resize those frames first.",
    };
  }

  const { error } = await supabase
    .from("gallery")
    .update({ title, rows, columns, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: "updated",
    entityType: "gallery",
    entityId: id,
    entityLabel: title,
  });

  revalidateGalleryPaths(id);
  return { error: null };
}

export async function setGalleryStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase.from("gallery").select("title").eq("id", id).single();

  const { error } = await supabase.from("gallery").update({ status }).eq("id", id);
  if (error) return { error: error.message };

  await logActivity(supabase, {
    action: status === "published" ? "published" : "unpublished",
    entityType: "gallery",
    entityId: id,
    entityLabel: existing?.title ?? "Untitled gallery",
  });

  revalidateGalleryPaths(id);
  return { error: null };
}

export async function deleteGallery(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase.from("gallery").select("title").eq("id", id).single();

  const { data: deleted, error } = await supabase
    .from("gallery")
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
    entityType: "gallery",
    entityId: id,
    entityLabel: existing?.title ?? "Untitled gallery",
  });

  revalidateGalleryPaths();
  return { error: null };
}

/**
 * Replaces every frame belonging to a gallery with the given set in
 * one go. The grid editor sends its whole in-memory frame list on
 * "Save Gallery" rather than diffing individual cell edits, so a
 * delete-then-insert here keeps the DB an exact mirror of what the
 * admin sees â€” including frame removals and un-merges.
 */
export async function saveGalleryFrames(
  galleryId: string,
  frames: FrameInput[]
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: gallery, error: galleryError } = await supabase
    .from("gallery")
    .select("id, title, rows, columns")
    .eq("id", galleryId)
    .single();

  if (galleryError || !gallery) return { error: galleryError?.message ?? "Gallery not found." };

  const validationError = validateFrames(frames, gallery.rows, gallery.columns);
  if (validationError) return { error: validationError };

  const { error: deleteError } = await supabase
    .from("gallery_frames")
    .delete()
    .eq("gallery_id", galleryId);
  if (deleteError) return { error: deleteError.message };

  if (frames.length > 0) {
    const { error: insertError } = await supabase.from("gallery_frames").insert(
      frames.map((f) => ({
        gallery_id: galleryId,
        row_start: f.row_start,
        column_start: f.column_start,
        row_span: f.row_span,
        column_span: f.column_span,
        image_url: f.image_url,
        sort_order: f.sort_order,
      }))
    );
    if (insertError) return { error: insertError.message };
  }

  await supabase.from("gallery").update({ updated_at: new Date().toISOString() }).eq("id", galleryId);

  await logActivity(supabase, {
    action: "updated",
    entityType: "gallery",
    entityId: galleryId,
    entityLabel: `${gallery.title} (layout saved)`,
  });

  revalidateGalleryPaths(galleryId);
  return { error: null };
}

export type { FrameInput, GalleryFrame };
