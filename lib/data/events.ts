import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types";

/**
 * Public read: published events only, soonest first.
 * Ordered by starts_at (not created_at) since that's what visitors
 * actually care about — a Nov event should outrank an Oct one even
 * if it was entered into the CMS first.
 */
export async function getPublishedEvents(limit?: number): Promise<Event[]> {
  const supabase = await createClient();
  let query = supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("starts_at", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPublishedEvents failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Public read, paginated: one page of published events, newest
 * starts_at first, plus whether more exist. Deliberately ordered
 * opposite of getPublishedEvents (which is soonest-first for "what's
 * coming up" use) — this variant feeds the News &amp; Events page's
 * combined feed, which is sorted most-recent-first like a news feed,
 * so pagination has to walk the same direction as that merge.
 */
export async function getPublishedEventsPage(
  offset: number,
  limit: number
): Promise<{ items: Event[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .order("starts_at", { ascending: false })
    .range(offset, offset + limit);

  if (error) {
    console.error("getPublishedEventsPage failed:", error.message);
    return { items: [], hasMore: false };
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

/**
 * Admin read: every event regardless of status, soonest-first by
 * start date (not created_at) — matches how an admin scans a list
 * of upcoming vs. past events.
 */
export async function getAllEvents(): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error) {
    console.error("getAllEvents failed:", error.message);
    return [];
  }

  return data ?? [];
}
