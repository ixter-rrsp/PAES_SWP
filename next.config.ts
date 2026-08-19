import type { NextConfig } from "next";

// Static security headers applied to every response. The
// Content-Security-Policy header is intentionally NOT set here — it needs a
// fresh per-request nonce, so it's generated and attached in proxy.ts
// instead (see proxy.ts for why and how).
//
// Fixes several findings a ZAP scan flags by default on any Next.js app
// that hasn't set these explicitly:
//   - X-Powered-By: Next sends this by default; disabled below.
//   - Clickjacking: no X-Frame-Options meant the site could be iframed by
//     any origin and clickjacked.
//   - MIME sniffing: no X-Content-Type-Options let older browsers guess /
//     execute a content-type other than the one served.
//   - HSTS: tells browsers to only ever talk to this host over HTTPS once
//     they've seen it once. Only takes effect when actually served over
//     HTTPS (production/behind your host's TLS termination) — harmless
//     over plain HTTP dev.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Removes the "X-Powered-By: Next.js" response header (ZAP:
  // "Server Leaks Information via X-Powered-By").
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Admin pages render per-user, permission-gated data (via the
        // proxy session check) — never let a shared/browser cache keep a
        // copy after logout. Fixes ZAP's "Re-examine Cache-control
        // Directives" / "Retrieved from Cache" on /admin/*.
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
