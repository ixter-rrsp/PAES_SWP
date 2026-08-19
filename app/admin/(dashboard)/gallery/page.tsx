import { getAllGalleries } from "@/lib/data/gallery";
import GalleryClient from "./GalleryClient";

export default async function Page() {
  const galleries = await getAllGalleries();

  return <GalleryClient initialGalleries={galleries} />;
}
