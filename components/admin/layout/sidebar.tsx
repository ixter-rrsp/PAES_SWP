"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_LINKS } from "@/config/nav-links";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-sidebar-bg fixed left-0 top-0 h-full w-[260px] flex-col py-density-lg overflow-y-auto z-40 hidden md:flex">
      <div className="px-gutter mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-DEFAULT bg-primary-container flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-white"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            school
          </span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-white tracking-tight">
            EduAdmin CMS
          </h1>
          <p className="font-label-md text-label-md text-white/70">Management Portal</p>
        </div>
      </div>

      <nav className="flex flex-col font-label-md text-label-md mt-4 flex-1">
        {ADMIN_NAV_LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={
                active
                  ? "flex items-center gap-3 px-gutter py-3 text-white border-l-[3px] border-primary bg-white/5 transition-colors duration-200"
                  : "flex items-center gap-3 px-gutter py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
              }
            >
              <span
                className="material-symbols-outlined"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
              >
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
        <div className="mt-auto pt-8">
          <a
            className="flex items-center gap-3 px-gutter py-3 text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
            href="#"
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </a>
        </div>
      </nav>
    </aside>
  );
}
