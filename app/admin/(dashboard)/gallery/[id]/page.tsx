import { notFound } from "next/navigation";
import { getGalleryWithFrames } from "@/lib/data/gallery";
import GalleryEditorClient from "./GalleryEditorClient";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gallery = await getGalleryWithFrames(id);

  if (!gallery) notFound();

  return <GalleryEditorClient gallery={gallery} />;
}
