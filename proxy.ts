import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Per-request CSP nonce. Next.js auto-detects a nonce on the CSP header of
// the response and applies it to the small bootstrap/hydration scripts it
// injects itself, so script-src can drop 'unsafe-inline' entirely. Building
// the CSP here (instead of in next.config.ts) is *why* this file exists
// beyond session refresh: a static config can't mint a new random value
// per request.
//
// style-src still needs 'unsafe-inline': several components use inline
// `style={{...}}` attributes (dynamic values Tailwind classes can't
// express), and CSP's style-src also governs the style="" attribute, not
// just <style> tags. Nonces don't cover attributes. Migrating those to
// CSS custom properties / Tailwind arbitrary values would let this be
// removed too, but that's a broader refactor than a header fix.
//
// 'unsafe-eval' is scoped to development only — Next's dev-mode HMR/React
// Refresh runtime uses eval, but the production build does not.
function buildCsp(nonce: string) {
  const scriptSrc =
    process.env.NODE_ENV === "development"
      ? `'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-eval'`
      : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  return [
    "default-src 'self'",
    `script-src ${scriptSrc}`,
    // fonts.googleapis.com serves the Material Symbols Outlined
    // stylesheet (still external — see app/layout.tsx for why).
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    // Site images bucket (Supabase Storage) + Drive thumbnails, both
    // proxied/rendered as <img> elsewhere in the app.
    "img-src 'self' data: https://*.supabase.co https://drive.google.com https://*.googleusercontent.com",
    // fonts.gstatic.com serves the actual Material Symbols font file
    // that stylesheet points at.
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; ");
}

export async function proxy(request: NextRequest) {
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const csp = buildCsp(nonce);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });
  supabaseResponse.headers.set("Content-Security-Policy", csp);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
          supabaseResponse.headers.set("Content-Security-Policy", csp);
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              ...options,
              // Explicit, not left to library defaults: fixes ZAP's
              // "Cookie Without Secure Flag" / "...SameSite Attribute
              // None" / "...without SameSite Attribute" / "Loosely
              // Scoped Cookie". Secure only actually applies once served
              // over HTTPS (production) — over plain HTTP dev, browsers
              // drop the flag's effect but keep the cookie usable.
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              path: "/",
            })
          );
        },
      },
    }
  );

  // Touching getUser() is what actually refreshes the session cookie.
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
