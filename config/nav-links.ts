/**
 * Central navigation config.
 * Add/remove/reorder links here — both SiteHeader and AdminSidebar
 * read from this file, so nothing needs touching in two places.
 */

export type NavLink = {
  href: string;
  label: string;
};

export const SITE_NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news-events", label: "News & Events" },
  { href: "/sbm", label: "SBM" },
  { href: "/staff", label: "Faculty & Staff" },
  { href: "/online-services", label: "Online Services" },
];

export type AdminNavLink = NavLink & {
  icon: string;
  exact?: boolean;
};

export const ADMIN_NAV_LINKS: AdminNavLink[] = [
  { href: "/admin", label: "Dashboard", icon: "dashboard", exact: true },
  { href: "/admin/page-config", label: "Page Configuration", icon: "tune" },
  { href: "/admin/announcements", label: "Announcements", icon: "campaign" },
  { href: "/admin/events", label: "Events", icon: "calendar_month" },
  { href: "/admin/downloadables", label: "Downloadables", icon: "folder_zip" },
  { href: "/admin/staff", label: "Staff Directory", icon: "groups" },
  { href: "/admin/archive-links", label: "Archive Links", icon: "folder_open" },
  { href: "/admin/sbm-pages", label: "SBM Pages", icon: "menu_book" },
];
