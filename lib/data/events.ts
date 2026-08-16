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
