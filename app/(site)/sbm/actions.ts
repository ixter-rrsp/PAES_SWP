"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { verifyAccessCode } from "@/lib/access-code";
import { checkRateLimit } from "@/lib/rate-limit";

export type UnlockResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

async function clientKey() {
  const h = await headers();
  const forwardedFor = h.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : (h.get("x-real-ip") ?? "unknown");
  return `sbm-unlock:${ip}`;
}

/**
 * Checks a visitor-entered code against the stored hash and, only on
 * a match, returns the OneDrive URL. The folder id alone never
 * reveals the link — this is the one place it gets resolved for the
 * public site. Rate-limited per IP so the code can't be brute-forced.
 */
export async function unlockSbmFolder(
  folderId: string,
  code: string
): Promise<UnlockResult> {
  const rate = checkRateLimit(await clientKey(), 8, 60_000);
  if (!rate.ok) {
    return { ok: false, error: "Too many attempts. Please wait a minute and try again." };
  }

  const trimmedCode = code.trim();
  if (!trimmedCode) return { ok: false, error: "Enter the access code." };

  const supabase = await createClient();
  const { data: folder, error } = await supabase
    .from("sbm_folders")
    .select("onedrive_url, access_code_hash, access_code_salt, sbm_year_id")
    .eq("id", folderId)
    .single();

  if (error || !folder) {
    return { ok: false, error: "That folder couldn't be found." };
  }

  // Confirm the parent year is actually published — the RLS policy
  // already enforces this, but checking here too keeps the intent
  // explicit and fails closed if that policy is ever loosened.
  const { data: year } = await supabase
    .from("sbm_years")
    .select("status")
    .eq("id", folder.sbm_year_id)
    .single();

  if (!year || year.status !== "published") {
    return { ok: false, error: "That folder couldn't be found." };
  }

  if (!folder.access_code_hash || !folder.access_code_salt) {
    // No gate set — shouldn't normally be reached from the UI, but
    // hand back the link rather than erroring.
    return { ok: true, url: folder.onedrive_url };
  }

  const valid = verifyAccessCode(trimmedCode, folder.access_code_hash, folder.access_code_salt);
  if (!valid) {
    return { ok: false, error: "Incorrect code." };
  }

  return { ok: true, url: folder.onedrive_url };
}
