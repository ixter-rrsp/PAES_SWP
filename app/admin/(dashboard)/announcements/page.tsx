import { getAllAnnouncementsPage, getAnnouncementStatusCounts } from "@/lib/data/announcements";
import AnnouncementsClient from "./AnnouncementsClient";

export const PAGE_SIZE = 25;

export default async function Page() {
  const [{ items, hasMore }, counts] = await Promise.all([
    getAllAnnouncementsPage(0, PAGE_SIZE),
    getAnnouncementStatusCounts(),
  ]);

  return (
    <AnnouncementsClient
      initialAnnouncements={items}
      initialHasMore={hasMore}
      initialCounts={counts}
      pageSize={PAGE_SIZE}
    />
  );
}
