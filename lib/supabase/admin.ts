import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// NOTE: server-only. This reads SUPABASE_SERVICE_ROLE_KEY, which must never
// reach the browser. Only import this from Server Components, Route
// Handlers, or "use server" actions — never from a "use client" file.

/**
 * Admin (service-role) Supabase client. Bypasses Row Level Security and
 * can query/manage auth users directly — never import this from a
 * Client Component and never send this key to the browser.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (from Project Settings > API in the
 * Supabase dashboard) in addition to the existing NEXT_PUBLIC_SUPABASE_URL.
 * Used for the "forgot password" flow to confirm an email belongs to an
 * admin account before a reset link is sent.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Looks up an admin account by email (case-insensitive). Pages through
 * the auth users list since GoTrue's listUsers doesn't take an email
 * filter — fine for the small number of admin accounts this site has.
 */
export async function findAuthUserByEmail(email: string) {
  const admin = createAdminClient();
  const normalized = email.trim().toLowerCase();

  const perPage = 200;
  for (let page = 1; page <= 25; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (match) return match;

    if (data.users.length < perPage) break; // last page
  }

  return null;
}
