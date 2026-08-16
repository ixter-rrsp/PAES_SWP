"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAV_LINKS } from "@/config/nav-links";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-surface border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-16 max-w-container-max mx-auto">
        <Link href="/" className="flex items-center gap-base">
          <span
            className="material-symbols-outlined text-primary text-[32px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
          <span className="font-headline-md text-headline-md font-bold text-primary">
            DepEd School Portal
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-gutter">
          {SITE_NAV_LINKS.map((link) => {
            const active =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  active
                    ? "text-primary border-b-2 border-primary pb-1 font-bold font-label-md text-label-md"
                    : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors px-2 py-1 rounded font-label-md text-label-md"
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-base">
          <div className="hidden md:flex items-center bg-surface-container-low rounded-full px-4 py-2 border border-outline-variant focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
            <input
              className="bg-transparent border-none outline-none text-on-surface font-body-md text-body-md w-32 focus:w-48 transition-all"
              placeholder="Search..."
              type="text"
            />
          </div>
          <Link
            className="bg-primary text-on-primary font-label-md text-label-md px-6 py-2 rounded-full hover:opacity-90 transition-opacity font-bold flex items-center justify-center"
            href="/admin/login"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
