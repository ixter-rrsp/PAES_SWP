import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PAES School Website",
  description: "Official school portal — announcements, SBM, SLMS, LRMDS, and online services.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-body-md text-body-md">{children}</body>
    </html>
  );
}
