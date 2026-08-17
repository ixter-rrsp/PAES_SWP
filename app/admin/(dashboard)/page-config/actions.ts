"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { PageContentBlockType } from "@/types";

export type ActionResult = { error: string | null };

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase: null, error: "Not authenticated." as const };
  }

  return { supabase, error: null };
}

// Every page slug that currently reads from page_content — add to this list
// (and its matching public route) whenever a new page joins the CMS.
const PUBLIC_PATH_FOR_SLUG: Record<string, string> = {
  about: "/about",
};

export async function savePageContentBlock(
  pageSlug: string,
  blockKey: string,
  blockType: PageContentBlockType,
  value: string | null
): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase.from("page_content").upsert(
    {
      page_slug: pageSlug,
      block_key: blockKey,
      block_type: blockType,
      value,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "page_slug,block_key" }
  );

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/page-config");
  const publicPath = PUBLIC_PATH_FOR_SLUG[pageSlug];
  if (publicPath) revalidatePath(publicPath);

  return { error: null };
}

export async function resetPageContentBlock(pageSlug: string, blockKey: string): Promise<ActionResult> {
  const { supabase, error: authError } = await requireAdmin();
  if (!supabase) return { error: authError };

  const { error } = await supabase
    .from("page_content")
    .delete()
    .eq("page_slug", pageSlug)
    .eq("block_key", blockKey);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/page-config");
  const publicPath = PUBLIC_PATH_FOR_SLUG[pageSlug];
  if (publicPath) revalidatePath(publicPath);

  return { error: null };
}
