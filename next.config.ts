import type { NextConfig } from "next";

// Security headers applied to every response. Fixes several
// findings a ZAP scan flags by default on any Next.js app that
// hasn't set these explicitly:
//   - X-Powered-By: Next sends this by default: disabled below.
//   - Clickjacking: no X-Frame-Options meant the site could be
//     iframed by any origin and clickjacked.
//   - MIME sniffing: no X-Content-Type-Options let older browsers
//     guess/execute a content-type other than the one served.
//   - CSP: none set, so browsers enforced no restriction at all on
//     which origins scripts/styles/images/frames can load from.
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js injects small inline bootstrap scripts and needs eval
      // in dev (HMR); 'unsafe-inline'/'unsafe-eval' are the standard
      // trade-off documented for Next.js CSP setups without a
      // per-request nonce. Tighten to a nonce-based policy later if
      // this needs to get stricter.
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      // Site images bucket (Supabase Storage) + Drive thumbnails, both
      // proxied/rendered as <img> elsewhere in the app.
      "img-src 'self' data: https://*.supabase.co https://drive.google.com https://*.googleusercontent.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
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
    ];
  },
};

export default nextConfig;
