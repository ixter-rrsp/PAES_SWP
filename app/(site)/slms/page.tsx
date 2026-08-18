import { getPublishedArchiveLinksPage } from "@/lib/data/archive-links";
import ArchiveLinksGrid from "./ArchiveLinksGrid";
import { ARCHIVE_LINKS_PAGE_SIZE } from "./constants";

export default async function Page() {
  const { items, hasMore } = await getPublishedArchiveLinksPage(
    0,
    ARCHIVE_LINKS_PAGE_SIZE
  );

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      <div className="mb-10 max-w-3xl">
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-background mb-4">
          Self-Learning Modules (SLMS)
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Access official Department of Education Self-Learning Modules. These
          folders link directly to official Google Drive repositories,
          ensuring you have the latest educational materials for all grade
          levels.
        </p>
      </div>

      <ArchiveLinksGrid initialItems={items} initialHasMore={hasMore} />
    </main>
  );
}
