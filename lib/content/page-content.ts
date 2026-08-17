import { createClient } from "@/lib/supabase/server";
import type { PageContentMap } from "@/types";

/**
 * Fetches every saved content block for a page and flattens it into a
 * simple { block_key: value } map. Public pages and the admin mimic both
 * call this the same way — the only difference is whether the caller
 * wraps the result in an editable <PageContentProvider>.
 */
export async function getPageContentMap(pageSlug: string): Promise<PageContentMap> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("page_content")
    .select("block_key, value")
    .eq("page_slug", pageSlug);

  if (error || !data) {
    return {};
  }

  const map: PageContentMap = {};
  for (const row of data) {
    map[row.block_key] = row.value;
  }
  return map;
}
