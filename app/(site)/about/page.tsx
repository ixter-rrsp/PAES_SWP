import { getPageContentMap } from "@/lib/content/page-content";
import { PageContentProvider } from "@/components/site/page-content-context";
import AboutPageView from "@/components/site/about-page-view";

export default async function Page() {
  const content = await getPageContentMap("about");

  return (
    <PageContentProvider content={content} editable={false}>
      <AboutPageView />
    </PageContentProvider>
  );
}
