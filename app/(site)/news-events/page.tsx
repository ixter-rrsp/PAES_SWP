import { Suspense } from "react";
import { getPublishedAnnouncementsPage } from "@/lib/data/announcements";
import { getPublishedEventsPage } from "@/lib/data/events";
import NewsEventsPageView from "@/components/site/news-events-page-view";
import { NEWS_EVENTS_PAGE_SIZE } from "./constants";

export default async function Page() {
  const [announcements, events] = await Promise.all([
    getPublishedAnnouncementsPage(0, NEWS_EVENTS_PAGE_SIZE),
    getPublishedEventsPage(0, NEWS_EVENTS_PAGE_SIZE),
  ]);

  return (
    <Suspense fallback={null}>
      <NewsEventsPageView
        initialAnnouncements={announcements.items}
        initialEvents={events.items}
        initialHasMore={announcements.hasMore || events.hasMore}
      />
    </Suspense>
  );
}
