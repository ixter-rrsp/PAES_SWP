import { getAllEvents } from "@/lib/data/events";
import EventsClient from "./EventsClient";

export default async function Page() {
  const events = await getAllEvents();

  return <EventsClient initialEvents={events} />;
}