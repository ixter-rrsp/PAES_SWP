import { Suspense } from "react";
import { getPublishedDownloadablesPage } from "@/lib/data/downloadables";
import DownloadablesList from "./DownloadablesList";
import { DOWNLOADABLES_PAGE_SIZE } from "./constants";

export default async function Page() {
  const { items, hasMore } = await getPublishedDownloadablesPage(
    0,
    DOWNLOADABLES_PAGE_SIZE
  );

  return (
    <>
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <header className="mb-12 border-l-4 border-primary pl-6">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-4">
            Downloadable Resources
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Access official school forms, templates, and administrative documents. Ensure
            you have the latest versions before submission.
          </p>
        </header>

        <Suspense fallback={null}>
          <DownloadablesList initialItems={items} initialHasMore={hasMore} />
        </Suspense>
      </main>
    </>
  );
}
