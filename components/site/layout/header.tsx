"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { SITE_NAV_LINKS } from "@/config/nav-links";
import SiteSearch from "@/components/site/layout/site-search";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-surface border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full gap-4 px-4 sm:px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
        <Link href="/" className="flex items-center gap-2 shrink-0 min-w-0" onClick={() => setMenuOpen(false)}>
          <Image src="/PAES.svg" alt="Pag-Asa Elementary School logo" width={32} height={32} className="shrink-0" />
          <span className="font-headline-sm text-headline-sm lg:font-headline-md lg:text-headline-md font-bold text-primary truncate">
            Pag-Asa Elementary School
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5 xl:gap-7 whitespace-nowrap">
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

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="hidden xl:block">
            <SiteSearch variant="desktop" />
          </div>
          <Link
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2 rounded-full hover:opacity-90 transition-opacity font-bold flex items-center justify-center whitespace-nowrap"
            href="/admin/login"
          >
            Login
          </Link>
        </div>

        {/* Burger — only shown below the breakpoint where the nav collapses */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="lg:hidden shrink-0 p-2 -mr-2 rounded-DEFAULT text-on-surface hover:bg-surface-container-low transition-colors"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile nav card */}
      {menuOpen && (
        <div className="lg:hidden border-t border-outline-variant bg-surface shadow-lg">
          <div className="px-4 sm:px-6 py-4 flex flex-col gap-1 max-w-[1440px] mx-auto">
            <div className="mb-3">
              <SiteSearch variant="mobile" onNavigate={() => setMenuOpen(false)} />
            </div>

            {SITE_NAV_LINKS.map((link) => {
              const active =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={
                    active
                      ? "px-3 py-2.5 rounded-DEFAULT bg-primary-container/10 text-primary font-bold font-label-md text-label-md"
                      : "px-3 py-2.5 rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors font-label-md text-label-md"
                  }
                >
                  {link.label}
                </Link>
              );
            })}

            <Link
              href="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="mt-3 bg-primary text-on-primary font-label-md text-label-md px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity font-bold flex items-center justify-center"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
