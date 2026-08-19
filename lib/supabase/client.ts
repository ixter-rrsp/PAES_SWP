import { createBrowserClient } from "@supabase/ssr";

// @supabase/ssr's browser client stores the session in cookies (not
// localStorage) so the server can read the same session via
// lib/supabase/server.ts. That means "remember me" has to be implemented
// through the cookie's maxAge, not by swapping storage backends.
const REMEMBER_ME_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
const SESSION_ONLY_MAX_AGE = 60 * 60 * 8; // 8 hours — one working session

/**
 * Browser Supabase client.
 *
 * Pass `{ rememberMe: false }` (the login page's "Keep me logged in"
 * checkbox, when unchecked) to shorten the session cookie's lifetime to a
 * single ~8 hour session instead of the normal 30-day persistent cookie.
 */
export function createClient(options?: { rememberMe?: boolean }) {
  const maxAge = options?.rememberMe === false ? SESSION_ONLY_MAX_AGE : REMEMBER_ME_MAX_AGE;

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        maxAge,
      },
    }
  );
}
