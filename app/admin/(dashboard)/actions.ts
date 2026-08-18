"use server";

import { createClient } from "@/lib/supabase/server";
import { getRecentActivityPage } from "@/lib/data/activity";
import type { ActivityLogEntry } from "@/types";

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated." as const };
  }

  return { ok: true, error: null };
}

export async function fetchRecentActivityPage(
  page: number,
  pageSize = 10
): Promise<{ items: ActivityLogEntry[]; total: number; error: string | null }> {
  const { ok, error: authError } = await requireAdmin();
  if (!ok) return { items: [], total: 0, error: authError };

  const { items, total } = await getRecentActivityPage(page, pageSize);
  return { items, total, error: null };
}
