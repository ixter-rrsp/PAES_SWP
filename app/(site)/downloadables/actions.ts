"use server";

import { getPublishedDownloadablesPage } from "@/lib/data/downloadables";

export async function loadMoreDownloadables(offset: number, limit: number) {
  return getPublishedDownloadablesPage(offset, limit);
}
