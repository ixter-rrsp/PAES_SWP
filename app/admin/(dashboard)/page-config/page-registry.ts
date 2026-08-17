import AboutPageView from "@/components/site/about-page-view";

export type ConfigurablePage = {
  slug: string;
  label: string;
  component: React.ComponentType;
};

// Every page that has been wired up for the Page Configuration CMS.
// To add another page: build a *-page-view.tsx presentational component
// (like about-page-view.tsx) using EditableText/EditableImage, point the
// public route at it via getPageContentMap(slug), then add it here.
export const CONFIGURABLE_PAGES: ConfigurablePage[] = [
  { slug: "about", label: "About", component: AboutPageView },
];

export function getConfigurablePage(slug: string) {
  return CONFIGURABLE_PAGES.find((p) => p.slug === slug) ?? CONFIGURABLE_PAGES[0];
}
