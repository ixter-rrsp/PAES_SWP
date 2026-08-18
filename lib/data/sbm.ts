import { createClient } from "@/lib/supabase/server";
import type { SbmFolder, SbmYear, SbmYearWithFolders } from "@/types";

async function fetchFoldersForYears(yearIds: string[]): Promise<SbmFolder[]> {
  if (yearIds.length === 0) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sbm_folders")
    .select("*")
    .in("sbm_year_id", yearIds)
    .order("display_order", { ascending: true })
    .order("label", { ascending: true });

  if (error) {
    console.error("fetchFoldersForYears failed:", error.message);
    return [];
  }

  return data ?? [];
}

/** Admin read: every school year regardless of status, with full folder rows. */
export async function getAllSbmYears(): Promise<SbmYearWithFolders[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sbm_years")
    .select("*")
    .order("display_order", { ascending: true })
    .order("school_year", { ascending: false });

  if (error) {
    console.error("getAllSbmYears failed:", error.message);
    return [];
  }

  const years = (data ?? []) as SbmYear[];
  const folders = await fetchFoldersForYears(years.map((y) => y.id));
  const byYear = new Map<string, SbmFolder[]>();
  for (const folder of folders) {
    const list = byYear.get(folder.sbm_year_id) ?? [];
    list.push(folder);
    byYear.set(folder.sbm_year_id, list);
  }

  return years.map((y) => ({ ...y, folders: byYear.get(y.id) ?? [] }));
}
