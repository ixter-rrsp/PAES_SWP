"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAllAnnouncementsPage } from "@/lib/data/announcements";
import type { Announcement } from "@/types";

export type ActionResult = { error: string | null };

// Every path that shows announcement data anywhere on the site.
// One place to update when a new page starts reading this table.
function revalidateAnnouncementPaths() {
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  revalidatePath("/news-events");
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

export async function createAnnouncement(
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const category = String(formData.get("category") ?? "general").trim() || "general";
  const publishNow = formData.get("publish_now") === "on";

  if (!title) {
    return { error: "Title is required." };
  }

  const { error } = await supabase.from("announcements").insert({
    title,
    body,
    cover_image_url: coverImageUrl || null,
    category,
    status: publishNow ? "published" : "draft",
    published_at: publishNow ? new Date().toISOString() : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidateAnnouncementPaths();
  return { error: null };
}

export async function updateAnnouncement(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const category = String(formData.get("category") ?? "general").trim() || "general";

  if (!title) {
    return { error: "Title is required." };
  }

  const { error } = await supabase
    .from("announcements")
    .update({
      title,
      body,
      cover_image_url: coverImageUrl || null,
      category,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateAnnouncementPaths();
  return { error: null };
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("announcements").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateAnnouncementPaths();
  return { error: null };
}

export async function setAnnouncementStatus(
  id: string,
  status: "draft" | "published",
  currentPublishedAt: string | null
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("announcements")
    .update({
      status,
      // First time it's published, stamp published_at. Un-publishing
      // (back to draft) doesn't clear it, so a re-publish keeps the
      // original date rather than looking brand new.
      published_at:
        status === "published" ? currentPublishedAt ?? new Date().toISOString() : currentPublishedAt,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateAnnouncementPaths();
  return { error: null };
}

export async function fetchAnnouncementsPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: Announcement[]; hasMore: boolean; error: string | null }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { items: [], hasMore: false, error: authError };

  const { items, hasMore } = await getAllAnnouncementsPage(offset, limit, status);
  return { items, hasMore, error: null };
}
