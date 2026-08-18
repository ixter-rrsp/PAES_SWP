"use server";

import { getPublishedArchiveLinksPage } from "@/lib/data/archive-links";

export async function loadMoreArchiveLinks(offset: number, limit: number) {
  return getPublishedArchiveLinksPage(offset, limit);
}
