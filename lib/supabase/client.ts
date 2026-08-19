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
        // Explicit (not left to library defaults) — fixes ZAP's cookie
        // Secure/SameSite/scope findings on the session cookie this client
        // sets at login. Note: this cookie can NOT be HttpOnly — it's
        // written via document.cookie by browser JS (that's how
        // @supabase/ssr keeps client components in sync with the
        // server-side session), and HttpOnly is a browser restriction
        // JS itself can never set on its own cookies, in any library.
        // The realistic mitigation for that specific flag is shrinking
        // the app's XSS surface, which the script-src nonce in proxy.ts
        // does — closing HttpOnly for real would mean moving login off
        // signInWithPassword() here and onto a Server Action instead.
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      },
    }
  );
}
