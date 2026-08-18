import { Suspense } from "react";
import { getPublishedAnnouncements } from "@/lib/data/announcements";
import { getPublishedEvents } from "@/lib/data/events";
import NewsEventsPageView from "@/components/site/news-events-page-view";

export default async function Page() {
  const [announcements, events] = await Promise.all([
    getPublishedAnnouncements(),
    getPublishedEvents(),
  ]);

  return (
    <Suspense fallback={null}>
      <NewsEventsPageView announcements={announcements} events={events} />
    </Suspense>
  );
}
