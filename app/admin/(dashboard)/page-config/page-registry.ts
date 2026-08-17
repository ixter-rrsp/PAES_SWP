import AboutPageView from "@/components/site/about-page-view";
import HomePageView from "@/components/site/home-page-view";
import { getPublishedAnnouncements } from "@/lib/data/announcements";
import { getPublishedEvents } from "@/lib/data/events";

export type ConfigurablePage = {
  slug: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  /**
   * Optional loader for props the page view needs beyond its saved
   * text/image blocks — e.g. Home needs real announcements/events so
   * the admin preview looks like the live site instead of an empty
   * "nothing published yet" state.
   */
  getProps?: () => Promise<Record<string, unknown>>;
};

// Every page that has been wired up for the Page Configuration CMS.
// To add another page: build a *-page-view.tsx presentational component
// (like about-page-view.tsx) using EditableText/EditableImage, point the
// public route at it via getPageContentMap(slug), then add it here.
export const CONFIGURABLE_PAGES: ConfigurablePage[] = [
  {
    slug: "home",
    label: "Home",
    component: HomePageView,
    getProps: async () => ({
      announcements: await getPublishedAnnouncements(4),
      events: await getPublishedEvents(4),
    }),
  },
  { slug: "about", label: "About", component: AboutPageView },
];

export function getConfigurablePage(slug: string) {
  return CONFIGURABLE_PAGES.find((p) => p.slug === slug) ?? CONFIGURABLE_PAGES[0];
}
