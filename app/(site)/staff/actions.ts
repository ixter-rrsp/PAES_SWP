"use server";

import { getPublishedStaffPage } from "@/lib/data/staff";

export async function loadMoreStaff(offset: number, limit: number) {
  return getPublishedStaffPage(offset, limit);
}
