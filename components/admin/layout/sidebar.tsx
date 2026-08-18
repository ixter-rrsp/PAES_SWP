"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_LINKS } from "@/config/nav-links";
import { useSidebar } from "./sidebar-context";

export default function AdminSidebar() {
  const pathname = usePathname();
  const { isOpen, close } = useSidebar();

  return (
    <>
      {/* Backdrop, mobile only, shown while the drawer is open */}
      <div
        onClick={close}
        aria-hidden="true"
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-200 md:hidden ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        className={`bg-sidebar-bg fixed left-0 top-0 h-full w-[260px] flex flex-col py-density-lg overflow-y-auto z-50 transition-transform duration-200 ease-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-gutter mb-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-DEFAULT bg-primary-container flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              school
            </span>
          </div>
          <div className="min-w-0">
            <h1 className="font-headline-md text-headline-md font-bold text-white tracking-tight truncate">
              PAES ADMIN
            </h1>
            <p className="font-label-md text-label-md text-white/70 truncate">Management Page</p>
          </div>
          <button
            onClick={close}
            aria-label="Close menu"
            className="ml-auto shrink-0 text-white/70 hover:text-white p-1 rounded-DEFAULT hover:bg-white/10 transition-colors duration-200 md:hidden"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex flex-col font-label-md text-label-md mt-4 flex-1">
          {ADMIN_NAV_LINKS.map((link) => {
            const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
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
        </nav>
      </aside>
    </>
  );
}
