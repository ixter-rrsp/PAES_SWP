"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAllEventsPage } from "@/lib/data/events";
import { logActivity } from "@/lib/data/activity";
import type { Event } from "@/types";

export type ActionResult = { error: string | null };

// Every path that shows event data anywhere on the site.
// One place to update when a new page starts reading this table.
function revalidateEventPaths() {
  revalidatePath("/admin/events");
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

function toTimestamp(value: FormDataEntryValue | null): string | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  // <input type="datetime-local"> gives "2026-08-16T14:30" with no
  // timezone. Most browsers parse that bare string as local time via
  // `new Date(str)`, but some JS engines treat a date-only string
  // differently — since this always has a "T" separator it's safe,
  // but we still guard against a malformed/incomplete value (e.g. the
  // user only picked a date and no time) rather than silently sending
  // an invalid timestamp to Supabase.
  if (!str.includes("T")) return null;
  const date = new Date(str);
  return isNaN(date.getTime()) ? null : date.toISOString();
}

export async function createEvent(formData: FormData): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const category = String(formData.get("category") ?? "general").trim() || "general";
  const startsAt = toTimestamp(formData.get("starts_at"));
  const endsAt = toTimestamp(formData.get("ends_at"));
  const publishNow = formData.get("publish_now") === "on";

  if (!title) {
    return { error: "Title is required." };
  }
  if (!startsAt) {
    return { error: "Start date/time is required." };
  }
  if (endsAt && endsAt < startsAt) {
    return { error: "End time can't be before the start time." };
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      title,
      description,
      location: location || null,
      cover_image_url: coverImageUrl || null,
      category,
      starts_at: startsAt,
      ends_at: endsAt,
      status: publishNow ? "published" : "draft",
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  await logActivity(supabase, {
    action: "created",
    entityType: "event",
    entityId: data?.id ?? null,
    entityLabel: title,
  });

  revalidateEventPaths();
  return { error: null };
}

export async function updateEvent(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const category = String(formData.get("category") ?? "general").trim() || "general";
  const startsAt = toTimestamp(formData.get("starts_at"));
  const endsAt = toTimestamp(formData.get("ends_at"));

  if (!title) {
    return { error: "Title is required." };
  }
  if (!startsAt) {
    return { error: "Start date/time is required." };
  }
  if (endsAt && endsAt < startsAt) {
    return { error: "End time can't be before the start time." };
  }

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description,
      location: location || null,
      cover_image_url: coverImageUrl || null,
      category,
      starts_at: startsAt,
      ends_at: endsAt,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logActivity(supabase, {
    action: "updated",
    entityType: "event",
    entityId: id,
    entityLabel: title,
  });

  revalidateEventPaths();
  return { error: null };
}

export async function deleteEvent(id: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase
    .from("events")
    .select("title")
    .eq("id", id)
    .single();

  const { data: deleted, error } = await supabase
    .from("events")
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

  if (error) {
    return { error: error.message };
  }

  await logActivity(supabase, {
    action: "deleted",
    entityType: "event",
    entityId: id,
    entityLabel: existing?.title ?? "Untitled event",
  });

  revalidateEventPaths();
  return { error: null };
}

export async function setEventStatus(
  id: string,
  status: "draft" | "published"
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { data: existing } = await supabase
    .from("events")
    .select("title")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("events")
    .update({ status })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  await logActivity(supabase, {
    action: status === "published" ? "published" : "unpublished",
    entityType: "event",
    entityId: id,
    entityLabel: existing?.title ?? "Untitled event",
  });

  revalidateEventPaths();
  return { error: null };
}

export async function fetchEventsPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: Event[]; hasMore: boolean; error: string | null }> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { items: [], hasMore: false, error: authError };

  const { items, hasMore } = await getAllEventsPage(offset, limit, status);
  return { items, hasMore, error: null };
}
