import { createClient } from "@/lib/supabase/server";
import type { Announcement } from "@/types";

/**
 * Public read: published announcements only, newest first.
 * Safe to call from any Server Component on the public site — RLS
 * enforces "published only" independently, this is just the query shape.
 */
export async function getPublishedAnnouncements(
  limit?: number
): Promise<Announcement[]> {
  const supabase = await createClient();
  let query = supabase
    .from("announcements")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPublishedAnnouncements failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Public read, paginated: one page of published announcements at a
 * time (newest first) plus whether more exist. Used to feed the News
 * &amp; Events page's combined feed lazily instead of pulling every
 * announcement on first load.
 */
export async function getPublishedAnnouncementsPage(
  offset: number,
  limit: number
): Promise<{ items: Announcement[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false, nullsFirst: false })
    .range(offset, offset + limit);

  if (error) {
    console.error("getPublishedAnnouncementsPage failed:", error.message);
    return { items: [], hasMore: false };
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

/**
 * Admin read: every announcement regardless of status, newest first.
 * Relies on the caller already being behind the admin auth check
 * (dashboard layout / server action) — RLS also enforces this at the
 * DB level for authenticated sessions only.
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllAnnouncements failed:", error.message);
    return [];
  }

  return data ?? [];
}
