import { getPublishedGalleries } from "@/lib/data/gallery";
import GalleryGrid from "@/components/site/gallery-grid";

export default async function Page() {
  const galleries = await getPublishedGalleries();

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <div className="mb-12 border-l-4 border-primary pl-4">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Gallery</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          A look at life at Pag-Asa Elementary School.
        </p>
      </div>

      {galleries.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl py-16 text-center text-on-surface-variant font-body-md text-body-md">
          No galleries have been published yet.
        </div>
      ) : (
        galleries.map((gallery) => <GalleryGrid key={gallery.id} gallery={gallery} />)
      )}
    </main>
  );
}
