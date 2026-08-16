import { getAllArchiveLinks } from "@/lib/data/archive-links";
import ArchiveLinksClient from "./ArchiveLinksClient";

export default async function Page() {
  const links = await getAllArchiveLinks();

  return <ArchiveLinksClient initialLinks={links} />;
}
