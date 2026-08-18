import { createClient } from "@/lib/supabase/server";
import type { ArchiveLink } from "@/types";

/**
 * Public read: published archive links only, grouped implicitly by
 * category via ordering. Safe to call from any Server Component —
 * RLS enforces "published only" independently, this is just the
 * query shape.
 */
export async function getPublishedArchiveLinks(): Promise<ArchiveLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("archive_links")
    .select("*")
    .eq("status", "published")
    .order("category", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    console.error("getPublishedArchiveLinks failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Public read, paginated: one page of published archive links (same
 * category/label sort as getPublishedArchiveLinks) plus whether more
 * exist. Lets the SLMS grid render progressively instead of loading
 * every module folder up front.
 */
export async function getPublishedArchiveLinksPage(
  offset: number,
  limit: number
): Promise<{ items: ArchiveLink[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("archive_links")
    .select("*")
    .eq("status", "published")
    .order("category", { ascending: true })
    .order("label", { ascending: true })
    .range(offset, offset + limit);

  if (error) {
    console.error("getPublishedArchiveLinksPage failed:", error.message);
    return { items: [], hasMore: false };
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

/**
 * Public read: a single published collection by id, for the resource
 * collection page. Returns null for drafts / missing rows so the page
 * can 404 without leaking which ids exist.
 */
export async function getPublishedArchiveLinkById(id: string): Promise<ArchiveLink | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("archive_links")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data;
}

/**
 * Admin read: every archive link regardless of status. Relies on the
 * caller already being behind the admin auth check (dashboard layout)
 * — RLS also enforces this at the DB level for authenticated sessions.
 */
export async function getAllArchiveLinks(): Promise<ArchiveLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("archive_links")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllArchiveLinks failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Admin read, paginated: one page of archive links (same newest-first
 * order as getAllArchiveLinks), optionally narrowed to a single
 * status, plus whether more exist. Lets the admin list render its
 * first batch fast and fetch the rest lazily via "Load more" instead
 * of pulling the entire table on every dashboard visit.
 */
export async function getAllArchiveLinksPage(
  offset: number,
  limit: number,
  status?: "draft" | "published"
): Promise<{ items: ArchiveLink[]; hasMore: boolean }> {
  const supabase = await createClient();
  let query = supabase
    .from("archive_links")
    .select("*")
    .order("created_at", { ascending: false });

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error } = await query.range(offset, offset + limit);

  if (error) {
    console.error("getAllArchiveLinksPage failed:", error.message);
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
export async function getArchiveLinkStatusCounts(): Promise<{
  all: number;
  published: number;
  draft: number;
}> {
  const supabase = await createClient();
  const [all, published, draft] = await Promise.all([
    supabase.from("archive_links").select("id", { count: "exact", head: true }),
    supabase
      .from("archive_links")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("archive_links")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),
  ]);

  return {
    all: all.count ?? 0,
    published: published.count ?? 0,
    draft: draft.count ?? 0,
  };
}