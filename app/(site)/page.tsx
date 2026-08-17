import { getPublishedAnnouncements } from "@/lib/data/announcements";
import { getPublishedEvents } from "@/lib/data/events";
import { getPageContentMap } from "@/lib/content/page-content";
import { PageContentProvider } from "@/components/site/page-content-context";
import HomePageView from "@/components/site/home-page-view";

export default async function Page() {
  const [announcements, events, content] = await Promise.all([
    getPublishedAnnouncements(4),
    getPublishedEvents(4),
    getPageContentMap("home"),
  ]);

  return (
    <PageContentProvider content={content} editable={false}>
      <HomePageView announcements={announcements} events={events} />
    </PageContentProvider>
  );
}
