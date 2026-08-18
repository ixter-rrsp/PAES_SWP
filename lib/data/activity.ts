import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import type { ActivityAction, ActivityLogEntry } from "@/types";

/**
 * Writes one row to activity_log, attributed to whoever is signed in
 * on this `supabase` client. Called from every mutating server action
 * (create/update/delete/status change) so the dashboard's "Recent
 * Activity" table always knows *who* did *what*.
 *
 * Deliberately never throws: logging a failure to log shouldn't ever
 * take down the actual mutation that already succeeded. Errors are
 * just written to the server console.
 */
export async function logActivity(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any, any, any>,
  entry: {
    action: ActivityAction;
    entityType: string;
    entityId?: string | null;
    entityLabel: string;
  }
): Promise<void> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("activity_log").insert({
      actor_id: user?.id ?? null,
      actor_email: user?.email ?? null,
      actor_name:
        (user?.user_metadata?.full_name as string | undefined) ??
        (user?.user_metadata?.name as string | undefined) ??
        null,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId ?? null,
      entity_label: entry.entityLabel,
    });

    if (error) {
      console.error("logActivity failed:", error.message);
    }
  } catch (err) {
    console.error("logActivity threw:", err);
  }
}

/**
 * Most recent activity across every content type, newest first, for
 * the admin dashboard's "Recent Activity" table.
 */
export async function getRecentActivity(limit = 10): Promise<ActivityLogEntry[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getRecentActivity failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * One page of activity for the dashboard's "Recent Activity" table,
 * newest first, plus the total row count so the UI can render page
 * numbers (10 rows per page).
 */
export async function getRecentActivityPage(
  page: number,
  pageSize = 10
): Promise<{ items: ActivityLogEntry[]; total: number }> {
  const supabase = await createClient();

  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("activity_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getRecentActivityPage failed:", error.message);
    return { items: [], total: 0 };
  }

  return { items: data ?? [], total: count ?? 0 };
}

export type DashboardStats = {
  totalAnnouncements: number;
  announcementsPublishedLast7Days: number;
  upcomingEventsNext7Days: number;
  pendingDrafts: number;
};

/**
 * Real counts for the three summary cards at the top of the
 * dashboard, replacing the old hardcoded mock numbers. Runs the
 * counts in parallel since they're independent head-only queries
 * (`count: "exact", head: true"` — no rows are actually fetched).
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const nowIso = now.toISOString();

  const [
    totalAnnouncements,
    announcementsPublishedLast7Days,
    upcomingEventsNext7Days,
    draftAnnouncements,
    draftEvents,
    draftStaff,
    draftDownloadables,
    draftArchiveLinks,
  ] = await Promise.all([
    supabase.from("announcements").select("id", { count: "exact", head: true }),
    supabase
      .from("announcements")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .gte("published_at", sevenDaysAgo),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("status", "published")
      .gte("starts_at", nowIso)
      .lte("starts_at", sevenDaysFromNow),
    supabase.from("announcements").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("events").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("staff").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("downloadables").select("id", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("archive_links").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  return {
    totalAnnouncements: totalAnnouncements.count ?? 0,
    announcementsPublishedLast7Days: announcementsPublishedLast7Days.count ?? 0,
    upcomingEventsNext7Days: upcomingEventsNext7Days.count ?? 0,
    pendingDrafts:
      (draftAnnouncements.count ?? 0) +
      (draftEvents.count ?? 0) +
      (draftStaff.count ?? 0) +
      (draftDownloadables.count ?? 0) +
      (draftArchiveLinks.count ?? 0),
  };
}
