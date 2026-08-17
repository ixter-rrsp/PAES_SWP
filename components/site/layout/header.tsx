"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAV_LINKS } from "@/config/nav-links";

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="bg-surface border-b border-outline-variant w-full sticky top-0 z-50">
      <div className="flex justify-between items-center w-full gap-6 px-4 sm:px-6 lg:px-10 h-16 max-w-[1440px] mx-auto">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/PAES.svg" alt="Pag-Asa Elementary School logo" width={32} height={32} className="shrink-0" />
          <span className="font-headline-sm text-headline-sm lg:font-headline-md lg:text-headline-md font-bold text-primary whitespace-nowrap">
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

        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center bg-surface-container-low rounded-full px-3 py-2 border border-outline-variant focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
            <span className="material-symbols-outlined text-on-surface-variant mr-2 text-[20px]">search</span>
            <input
              className="bg-transparent border-none outline-none text-on-surface font-body-md text-body-md w-24 focus:w-40 transition-all"
              placeholder="Search..."
              type="text"
            />
          </div>
          <Link
            className="bg-primary text-on-primary font-label-md text-label-md px-5 py-2 rounded-full hover:opacity-90 transition-opacity font-bold flex items-center justify-center whitespace-nowrap"
            href="/admin/login"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
