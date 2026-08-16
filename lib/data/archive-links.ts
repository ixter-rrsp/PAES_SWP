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
