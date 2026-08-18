import { createClient } from "@/lib/supabase/server";
import type { StaffMember } from "@/types";

/**
 * Public read: published staff only, grouped implicitly by
 * department via ordering (department, then display_order, then
 * name). Safe to call from any Server Component — RLS enforces
 * "published only" independently, this is just the query shape.
 */
export async function getPublishedStaff(): Promise<StaffMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("status", "published")
    .order("department", { ascending: true, nullsFirst: false })
    .order("display_order", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    console.error("getPublishedStaff failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Public read, paginated: one page of published staff (same sort as
 * getPublishedStaff) plus whether more exist. Powers a "load more"
 * directory that renders progressively instead of fetching every
 * staff member on first paint.
 */
export async function getPublishedStaffPage(
  offset: number,
  limit: number
): Promise<{ items: StaffMember[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .eq("status", "published")
    .order("department", { ascending: true, nullsFirst: false })
    .order("display_order", { ascending: true })
    .order("full_name", { ascending: true })
    .range(offset, offset + limit);

  if (error) {
    console.error("getPublishedStaffPage failed:", error.message);
    return { items: [], hasMore: false };
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

/**
 * Admin read: every staff member regardless of status. Relies on the
 * caller already being behind the admin auth check (dashboard layout)
 * — RLS also enforces this at the DB level for authenticated sessions.
 */
export async function getAllStaff(): Promise<StaffMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("department", { ascending: true, nullsFirst: false })
    .order("display_order", { ascending: true })
    .order("full_name", { ascending: true });

  if (error) {
    console.error("getAllStaff failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Admin read, paginated: one page of staff (same department / order /
 * name sort as getAllStaff), optionally narrowed to a single status,
 * plus whether more exist. Lets the admin list render its first batch
 * fast and fetch the rest lazily via "Load more" instead of pulling
 * the entire table on every dashboard visit.
 */
export async function getAllStaffPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: StaffMember[]; hasMore: boolean }> {
  const supabase = await createClient();
  let query = supabase
    .from("staff")
    .select("*")
    .order("department", { ascending: true, nullsFirst: false })
    .order("display_order", { ascending: true })
    .order("full_name", { ascending: true });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query.range(offset, offset + limit);

  if (error) {
    console.error("getAllStaffPage failed:", error.message);
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
export async function getStaffStatusCounts(): Promise<{
  all: number;
  published: number;
  draft: number;
}> {
  const supabase = await createClient();
  const [all, published, draft] = await Promise.all([
    supabase.from("staff").select("id", { count: "exact", head: true }),
    supabase.from("staff").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("staff").select("id", { count: "exact", head: true }).eq("status", "draft"),
  ]);

  return {
    all: all.count ?? 0,
    published: published.count ?? 0,
    draft: draft.count ?? 0,
  };
}
