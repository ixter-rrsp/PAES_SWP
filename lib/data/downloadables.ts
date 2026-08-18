import { createClient } from "@/lib/supabase/server";
import type { Downloadable } from "@/types";

/**
 * Public read: published downloadables only, newest first.
 * Safe to call from any Server Component on the public site — RLS
 * enforces "published only" independently, this is just the query shape.
 */
export async function getPublishedDownloadables(
  limit?: number
): Promise<Downloadable[]> {
  const supabase = await createClient();
  let query = supabase
    .from("downloadables")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getPublishedDownloadables failed:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Public read, paginated: one page of published downloadables at a
 * time (newest first) plus whether more exist after it. Used by the
 * downloadables page to render an initial batch fast and fetch the
 * rest lazily as the visitor scrolls, instead of loading every file
 * up front.
 */
export async function getPublishedDownloadablesPage(
  offset: number,
  limit: number
): Promise<{ items: Downloadable[]; hasMore: boolean }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("downloadables")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit); // fetch one extra row to detect "more"

  if (error) {
    console.error("getPublishedDownloadablesPage failed:", error.message);
    return { items: [], hasMore: false };
  }

  const rows = data ?? [];
  const hasMore = rows.length > limit;
  return { items: hasMore ? rows.slice(0, limit) : rows, hasMore };
}

/**
 * Admin read: every downloadable regardless of status, newest first.
 * Relies on the caller already being behind the admin auth check
 * (dashboard layout / server action) — RLS also enforces this at the
 * DB level for authenticated sessions only.
 */
export async function getAllDownloadables(): Promise<Downloadable[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("downloadables")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllDownloadables failed:", error.message);
    return [];
  }

  return data ?? [];
}
