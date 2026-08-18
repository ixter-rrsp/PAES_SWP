import { getAllArchiveLinksPage, getArchiveLinkStatusCounts } from "@/lib/data/archive-links";
import ArchiveLinksClient from "./ArchiveLinksClient";

export const PAGE_SIZE = 25;

export default async function Page() {
  const [{ items, hasMore }, counts] = await Promise.all([
    getAllArchiveLinksPage(0, PAGE_SIZE),
    getArchiveLinkStatusCounts(),
  ]);

  return (
    <ArchiveLinksClient
      initialLinks={items}
      initialHasMore={hasMore}
      initialCounts={counts}
      pageSize={PAGE_SIZE}
    />
  );
}
