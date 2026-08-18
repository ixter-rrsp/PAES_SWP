import { getAllSbmYears } from "@/lib/data/sbm";
import SbmPagesClient from "./SbmPagesClient";

export default async function Page() {
  const years = await getAllSbmYears();

  return <SbmPagesClient initialYears={years} />;
}
