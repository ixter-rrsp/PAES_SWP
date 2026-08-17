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
