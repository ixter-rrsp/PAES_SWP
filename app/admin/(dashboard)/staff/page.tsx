import { getAllStaffPage, getStaffStatusCounts } from "@/lib/data/staff";
import StaffClient from "./StaffClient";

export const PAGE_SIZE = 25;

export default async function Page() {
  const [{ items, hasMore }, counts] = await Promise.all([
    getAllStaffPage(0, PAGE_SIZE),
    getStaffStatusCounts(),
  ]);

  return (
    <StaffClient
      initialStaff={items}
      initialHasMore={hasMore}
      initialCounts={counts}
      pageSize={PAGE_SIZE}
    />
  );
}
