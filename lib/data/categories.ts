/**
 * Canonical category list for announcements & events.
 *
 * This is a plain app-level enum (not a DB constraint — see the
 * news_events_category migration) so new categories can be added
 * here without a schema change. Both admin forms and the public
 * News & Events page import this so labels/colors stay in sync.
 */
export type NewsEventCategory = {
  slug: string;
  label: string;
};

export const NEWS_EVENT_CATEGORIES: NewsEventCategory[] = [
  { slug: "general", label: "General" },
  { slug: "academics", label: "Academics" },
  { slug: "extracurricular", label: "Extracurricular" },
  { slug: "sports", label: "Sports" },
  { slug: "enrollment", label: "Enrollment" },
  { slug: "meeting", label: "Meetings" },
  { slug: "holiday", label: "Holidays / No Classes" },
];

const LABEL_BY_SLUG = new Map(
  NEWS_EVENT_CATEGORIES.map((c) => [c.slug, c.label])
);

// Falls back to a title-cased version of the slug for any legacy /
// free-form values that predate this list, so old data never renders
// as a raw "undefined".
export function categoryLabel(slug: string | null | undefined): string {
  if (!slug) return "General";
  return (
    LABEL_BY_SLUG.get(slug) ??
    slug
      .split(/[-_]/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(" ")
  );
}
