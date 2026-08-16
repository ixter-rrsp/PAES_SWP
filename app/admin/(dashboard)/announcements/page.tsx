import { getAllAnnouncements } from "@/lib/data/announcements";
import AnnouncementsClient from "./AnnouncementsClient";

export default async function Page() {
  const announcements = await getAllAnnouncements();

  return <AnnouncementsClient initialAnnouncements={announcements} />;
}
