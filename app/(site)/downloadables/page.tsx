import { Suspense } from "react";
import { getPublishedDownloadables } from "@/lib/data/downloadables";
import DownloadablesList from "./DownloadablesList";

export default async function Page() {
  const downloadables = await getPublishedDownloadables();

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
          <DownloadablesList items={downloadables} />
        </Suspense>
      </main>
    </>
  );
}
