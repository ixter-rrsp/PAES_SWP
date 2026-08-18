import { getAllDownloadablesPage, getDownloadableStatusCounts } from "@/lib/data/downloadables";
import DownloadablesClient from "./DownloadablesClient";

export const PAGE_SIZE = 25;

export default async function Page() {
  const [{ items, hasMore }, counts] = await Promise.all([
    getAllDownloadablesPage(0, PAGE_SIZE),
    getDownloadableStatusCounts(),
  ]);

  return (
    <DownloadablesClient
      initialDownloadables={items}
      initialHasMore={hasMore}
      initialCounts={counts}
      pageSize={PAGE_SIZE}
    />
  );
}
