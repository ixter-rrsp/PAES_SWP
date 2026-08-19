import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { categoryLabel } from "@/lib/data/categories";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

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
 * Escapes a raw search term for safe use inside a PostgREST `.or()`
 * filter string. PostgREST's or()/and() syntax treats `,`, `(`, `)`
 * and `.` as structural delimiters, so a term containing them (e.g.
 * `q=a,title.eq.b` or `q=a)or(id.neq.null`) could otherwise inject
 * extra filter clauses or malformed syntax instead of being treated
 * as a literal value to search for.
 *
 * PostgREST's documented escape hatch is to wrap the value in double
 * quotes, with any literal backslash or double-quote inside it
 * backslash-escaped — see the "Reserved Characters" section of the
 * PostgREST docs. Wrapping in quotes like this makes every character
 * inside literal, so commas/parens/periods in the search term can no
 * longer be interpreted as filter syntax.
 *
 * Also strips `%` and `_` (ilike wildcard/single-char-match tokens) so
 * a search term can't be used to widen its own match pattern beyond
 * what the surrounding `%...%` wrapping intends.
 */
function escapeOrPatternValue(term: string): string {
  const withoutWildcards = term.replace(/[%_]/g, " ");
  const escaped = withoutWildcards.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  return `"${escaped}"`;
}

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
  // Every other public route in this app rate-limits by IP; the search
  // bar is a lightweight but repeatable query (5 queries fan out per
  // request), so it's an easy target for scripted abuse without this.
  const rate = checkRateLimit(`search:${getClientIp(request)}`, 30, 60_000);
  if (!rate.ok) {
    return NextResponse.json({ results: [] }, { status: 429 });
  }

  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const supabase = await createClient();
  const like = `%${escapeOrPatternValue(q)}%`;

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
