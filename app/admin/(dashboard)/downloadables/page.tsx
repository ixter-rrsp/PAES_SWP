import { getAllDownloadables } from "@/lib/data/downloadables";
import DownloadablesClient from "./DownloadablesClient";

export default async function Page() {
  const downloadables = await getAllDownloadables();

  return <DownloadablesClient initialDownloadables={downloadables} />;
}
