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

/**
 * Admin read, paginated: one page of events (same soonest-first order
 * as getAllEvents), optionally narrowed to a single status, plus
 * whether more exist. Lets the admin list render its first batch fast
 * and fetch the rest lazily via "Load more" instead of pulling the
 * entire table on every dashboard visit.
 */
export async function getAllEventsPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: Event[]; hasMore: boolean }> {
  const supabase = await createClient();
  let query = supabase.from("events").select("*").order("starts_at", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query.range(offset, offset + limit);

  if (error) {
    console.error("getAllEventsPage failed:", error.message);
    return { items: [], hasMore: false };
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

/**
 * Admin read: cheap counts (no rows fetched) for the status filter
 * tabs, so the "All / Published / Draft (n)" badges stay accurate
 * even though the table itself only ever holds one lazily-loaded
 * page at a time.
 */
export async function getEventStatusCounts(): Promise<{
  all: number;
  published: number;
  draft: number;
}> {
  const supabase = await createClient();
  const [all, published, draft] = await Promise.all([
    supabase.from("events").select("id", { count: "exact", head: true }),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  return {
    all: all.count ?? 0,
    published: published.count ?? 0,
    draft: draft.count ?? 0,
  };
}
