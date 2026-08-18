import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categoryLabel } from "@/lib/data/categories";

export type SiteSearchResult = {
  id: string;
  type: "downloadable" | "slms" | "staff" | "event" | "announcement";
  title: string;
  subtitle: string;
  url: string;
  icon: string;
};

const RESULTS_PER_SOURCE = 5;
const MAX_RESULTS = 8;

/**
 * Unified public search across downloadables, SLMS collections, staff,
 * events, and announcements — used by the header search bar. Only ever
 * touches published rows (RLS enforces this independently too).
 *
 * Ranks title-prefix matches above title-contains, and title matches
 * above category-only matches, so typing "science" surfaces a
 * "Science Fair" event before a downloadable merely filed under a
 * "Science" category.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const like = `%${q}%`;

  const [downloadables, slms, staff, events, announcements] = await Promise.all([
    supabase
      .from("downloadables")
      .select("id, title, category")
      .eq("status", "published")
      .or(`title.ilike.${like},category.ilike.${like}`)
      .limit(RESULTS_PER_SOURCE),
    supabase
      .from("archive_links")
      .select("id, label, category")
      .eq("status", "published")
      .or(`label.ilike.${like},category.ilike.${like}`)
      .limit(RESULTS_PER_SOURCE),
    supabase
      .from("staff")
      .select("id, full_name, role")
      .eq("status", "published")
      .or(`full_name.ilike.${like},role.ilike.${like}`)
      .limit(RESULTS_PER_SOURCE),
    supabase
      .from("events")
      .select("id, title, category")
      .eq("status", "published")
      .or(`title.ilike.${like},category.ilike.${like}`)
      .limit(RESULTS_PER_SOURCE),
    supabase
      .from("announcements")
      .select("id, title, category")
      .eq("status", "published")
      .or(`title.ilike.${like},category.ilike.${like}`)
      .limit(RESULTS_PER_SOURCE),
  ]);

  const results: SiteSearchResult[] = [];

  for (const row of downloadables.data ?? []) {
    results.push({
      id: row.id,
      type: "downloadable",
      title: row.title,
      subtitle: row.category ? `Downloadable · ${row.category}` : "Downloadable",
      url: `/downloadables?highlight=${row.id}`,
      icon: "folder_open",
    });
  }

  for (const row of slms.data ?? []) {
    results.push({
      id: row.id,
      type: "slms",
      title: row.label,
      subtitle: row.category ? `SLMS · ${row.category}` : "SLMS",
      url: `/slms/${row.id}`,
      icon: "laptop_mac",
    });
  }

  for (const row of staff.data ?? []) {
    results.push({
      id: row.id,
      type: "staff",
      title: row.full_name,
      subtitle: row.role ? `Staff · ${row.role}` : "Staff",
      url: `/staff?highlight=${row.id}`,
      icon: "person",
    });
  }

  for (const row of events.data ?? []) {
    results.push({
      id: row.id,
      type: "event",
      title: row.title,
      subtitle: `Event · ${categoryLabel(row.category)}`,
      url: `/news-events?highlight=event:${row.id}`,
      icon: "event",
    });
  }

  for (const row of announcements.data ?? []) {
    results.push({
      id: row.id,
      type: "announcement",
      title: row.title,
      subtitle: `Announcement · ${categoryLabel(row.category)}`,
      url: `/news-events?highlight=announcement:${row.id}`,
      icon: "campaign",
    });
  }

  const qLower = q.toLowerCase();
  function rank(result: SiteSearchResult) {
    const titleLower = result.title.toLowerCase();
    if (titleLower === qLower) return 0;
    if (titleLower.startsWith(qLower)) return 1;
    if (titleLower.includes(qLower)) return 2;
    return 3; // matched on category/role only
  }

  results.sort((a, b) => rank(a) - rank(b) || a.title.localeCompare(b.title));

  return NextResponse.json({ results: results.slice(0, MAX_RESULTS) });
}
