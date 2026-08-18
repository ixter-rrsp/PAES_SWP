"use server";

import { getPublishedAnnouncementsPage } from "@/lib/data/announcements";
import { getPublishedEventsPage } from "@/lib/data/events";

/**
 * Fetches one more batch of each source (announcements + events) so
 * the combined News & Events feed can grow without ever having
 * pulled every row from either table. Each source paginates
 * independently; the client merges and re-sorts everything it has
 * loaded so far by date.
 */
export async function loadMoreNewsEvents(
  announcementsOffset: number,
  eventsOffset: number,
  limit: number
) {
  const [announcements, events] = await Promise.all([
    getPublishedAnnouncementsPage(announcementsOffset, limit),
    getPublishedEventsPage(eventsOffset, limit),
  ]);

  return {
    announcements: announcements.items,
    events: events.items,
    hasMore: announcements.hasMore || events.hasMore,
  };
}
