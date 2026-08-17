import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedArchiveLinkById } from "@/lib/data/archive-links";
import ResourceList from "./ResourceList";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collection = await getPublishedArchiveLinkById(id);

  if (!collection) notFound();

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      <Link
        href="/slms"
        className="inline-flex items-center gap-1.5 text-primary font-label-md text-label-md mb-6 hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to Self-Learning Modules
      </Link>

      <div className="mb-8 max-w-3xl">
        {collection.category && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm mb-3">
            {collection.category}
          </span>
        )}
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-background mb-3">
          {collection.label}
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant">
          Learning Resources
        </p>
      </div>

      <ResourceList collectionId={collection.id} collectionLabel={collection.label} />
    </main>
  );
}
