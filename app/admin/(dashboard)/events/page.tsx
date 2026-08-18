import { getAllEventsPage, getEventStatusCounts } from "@/lib/data/events";
import EventsClient from "./EventsClient";

export const PAGE_SIZE = 25;

export default async function Page() {
  const [{ items, hasMore }, counts] = await Promise.all([
    getAllEventsPage(0, PAGE_SIZE),
    getEventStatusCounts(),
  ]);

  return (
    <EventsClient
      initialEvents={items}
      initialHasMore={hasMore}
      initialCounts={counts}
      pageSize={PAGE_SIZE}
    />
  );
}
