import Link from "next/link";
import { getPageContentMap } from "@/lib/content/page-content";
import PageMimic from "./PageMimic";
import { CONFIGURABLE_PAGES, getConfigurablePage } from "./page-registry";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const activePage = getConfigurablePage(pageParam ?? "home");
  const content = await getPageContentMap(activePage.slug);
  const extraProps = activePage.getProps ? await activePage.getProps() : {};
  const PageView = activePage.component;

  return (
    <>
      <div className="mb-8">
        <h1 className="font-headline-md text-headline-md text-on-surface mb-2">Page Configuration</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Edit the text and images shown on the public site, page by page.
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {CONFIGURABLE_PAGES.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/page-config?page=${p.slug}`}
            className={
              p.slug === activePage.slug
                ? "px-4 py-2 rounded-full bg-primary-container text-white font-label-md text-label-md"
                : "px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low"
            }
          >
            {p.label}
          </Link>
        ))} 
      </div>

      <PageMimic pageSlug={activePage.slug} initialContent={content}>
        <PageView {...extraProps} />
      </PageMimic>
    </>
  );
}
