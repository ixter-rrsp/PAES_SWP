import Link from "next/link";
import { getPublishedDownloadables } from "@/lib/data/downloadables";
import OnlineServicesDownloadables from "./OnlineServicesDownloadables";

export default async function Page() {
  const downloadables = await getPublishedDownloadables(3);

  return (
    <>
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        <header className="mb-12">
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
            Online Services
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Access official portals, and downloadable documents for faculty,
            students, and administration.
          </p>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl">
                  folder_zip
                </span>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Downloadables
                </h2>
              </div>
            </div>
            <div className="p-6 flex-grow flex flex-col gap-4">
              {downloadables.length === 0 && (
                <p className="font-body-md text-body-md text-on-surface-variant text-center py-6">
                  No documents published yet.
                </p>
              )}

              <OnlineServicesDownloadables items={downloadables} />
            </div>
            <div className="p-4 border-t border-outline-variant bg-surface text-center">
              <Link
                className="font-label-md text-label-md text-primary hover:underline flex items-center justify-center gap-1"
                href="/downloadables"
              >
                View All Documents{" "}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </section>

          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow group relative">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary"></div>
            <div className="p-8 pl-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center border border-outline-variant">
                    <span className="material-symbols-outlined text-3xl text-on-surface">
                      database
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-2xl group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    open_in_new
                  </span>
                </div>
                <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-4">
                  EBEIS Portal
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Enhanced Basic Education Information System. Access the central database
                  for school profiles, enrollment data, and resource inventories.
                </p>
                <div className="bg-surface-container-low p-4 rounded-DEFAULT border border-outline-variant flex gap-3 items-start">
                  <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    Note: This link directs to the official external DepEd national portal.
                    Ensure you have your authorized credentials ready for login.
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <a
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-6 py-3 rounded-DEFAULT transition-colors w-full sm:w-auto"
                  href="https://ebeis.deped.gov.ph/beis/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Proceed to EBEIS
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
