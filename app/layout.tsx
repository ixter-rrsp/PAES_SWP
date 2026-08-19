import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Self-hosted via next/font: Next downloads Inter at build time and serves
// it from this origin instead of fonts.googleapis.com. Fixes ZAP's "Sub
// Resource Integrity Attribute Missing" for this font (no external
// <link rel="stylesheet"> left to flag) and drops an external request.
//
// Material Symbols Outlined (below) stays on Google Fonts: it's a
// variable, ligature-based icon font that next/font's Google catalog
// doesn't include, and Google's font CSS is generated per-user-agent, so
// there's no fixed file to attach an integrity hash to (Google's own docs
// say not to try). Genuinely third-party-only, not an oversight —
// swapping the site's icons over to the already-installed lucide-react
// package would remove this one too, but that's a separate, larger pass
// through every icon usage rather than a header/config fix.
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PAES School Website",
  description: "Official school portal — announcements, SBM, SLMS, LRMDS, and online services.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`light ${inter.variable}`}>
      <head>
        {/* Explicit charset as the very first head element, matching the
            server's Content-Type: text/html; charset=utf-8. Fixes ZAP's
            "Charset Mismatch (Header Versus Meta Content-Type Charset)". */}
        <meta charSet="utf-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body-md text-body-md">{children}</body>
    </html>
  );
}
