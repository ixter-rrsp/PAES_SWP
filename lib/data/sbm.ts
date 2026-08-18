import { createClient } from "@/lib/supabase/server";
import type {
  PublicSbmFolder,
  PublicSbmYear,
  SbmFolder,
  SbmYear,
  SbmYearWithFolders,
} from "@/types";

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

/**
 * Public read: published school years, folders stripped down to the
 * browser-safe shape. A folder with an access code set never carries
 * its onedrive_url here — that's only ever resolved server-side, by
 * unlockSbmFolder in app/(site)/sbm/actions.ts, after the code checks
 * out. This is what should be passed into any "use client" component.
 */
export async function getPublishedSbmYears(): Promise<PublicSbmYear[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sbm_years")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("school_year", { ascending: false });

  if (error) {
    console.error("getPublishedSbmYears failed:", error.message);
    return [];
  }

  const years = (data ?? []) as SbmYear[];
  const folders = await fetchFoldersForYears(years.map((y) => y.id));
  const byYear = new Map<string, PublicSbmFolder[]>();
  for (const folder of folders) {
    const requiresCode = !!folder.access_code_hash;
    const publicFolder: PublicSbmFolder = {
      id: folder.id,
      label: folder.label,
      description: folder.description,
      requires_code: requiresCode,
      onedrive_url: requiresCode ? null : folder.onedrive_url,
    };
    const list = byYear.get(folder.sbm_year_id) ?? [];
    list.push(publicFolder);
    byYear.set(folder.sbm_year_id, list);
  }

  return years.map((y) => ({
    id: y.id,
    school_year: y.school_year,
    content: y.content,
    display_order: y.display_order,
    created_at: y.created_at,
    updated_at: y.updated_at,
    folders: byYear.get(y.id) ?? [],
  }));
}
