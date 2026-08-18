"use client";

import EditableText from "@/components/site/editable-text";
import HeroImageCarousel from "@/components/site/hero-image-carousel";
import MimicLink from "@/components/site/mimic-link";
import type { Announcement, Event } from "@/types";

function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEventDay(value: string) {
  const date = new Date(value);
  return {
    day: date.toLocaleDateString("en-US", { day: "2-digit" }),
    month: date.toLocaleDateString("en-US", { month: "short" }),
  };
}

function formatEventTime(startsAt: string, endsAt: string | null) {
  const start = new Date(startsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!endsAt) return start;
  const end = new Date(endsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${start} - ${end}`;
}

export default function HomePageView({
  announcements = [],
  events = [],
}: {
  announcements?: Announcement[];
  events?: Event[];
}) {
  return (
    <main className="flex-grow">
      {/* Hero */}
      <section className="relative bg-surface-container-low py-16 md:py-24 overflow-hidden">
        {/* Decorative floating color blobs — replaces the old faint
            background photo. Same solid bg-surface-container-low base,
            just with soft blurred red/blue/white shapes drifting behind
            the content instead of a static image. Purely decorative
            (aria-hidden), clipped by the section's overflow-hidden. */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="animate-hero-blob-a absolute -top-24 -left-16 w-80 h-80 md:w-[28rem] md:h-[28rem] rounded-full bg-primary/20 blur-3xl" />
          <div className="animate-hero-blob-b absolute top-1/3 -right-20 w-72 h-72 md:w-96 md:h-96 rounded-full bg-tertiary/20 blur-3xl" />
          <div className="animate-hero-blob-a absolute bottom-[-6rem] left-1/3 w-64 h-64 md:w-80 md:h-80 rounded-full bg-white/60 blur-3xl [animation-delay:-6s]" />
        </div>
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div>
            <HeroImageCarousel />
          </div>

          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <EditableText
              id="hero_title"
              label="Hero heading"
              as="h1"
              className="font-display-lg text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] md:text-display-lg text-primary mb-4"
            >
              Welcome to our School
            </EditableText>
            <EditableText
              id="hero_body"
              label="Hero paragraph"
              type="richtext"
              as="p"
              className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-xl mx-auto md:mx-0"
            >
              Empowering students through quality education, fostering community, and building a
              brighter future for the Philippines. Explore our resources and stay updated.
            </EditableText>
            <div className="flex gap-4 flex-wrap justify-center md:justify-start">
              <button className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-bold shadow-sm">
                <EditableText id="hero_cta_primary" label="Primary button label" as="span">
                  Enroll Now
                </EditableText>
              </button>
              <button className="bg-transparent border-2 border-primary text-primary font-label-md text-label-md px-8 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors font-bold">
                <EditableText id="hero_cta_secondary" label="Secondary button label" as="span">
                  Learn More
                </EditableText>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="py-12 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-8 text-center">
            <EditableText id="quick_access_heading" label="Quick Access heading" as="span">
              Quick Access
            </EditableText>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter max-w-3xl mx-auto">
            <MimicLink
              className="group flex flex-col items-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all"
              href="/slms"
            >
              <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  laptop_mac
                </span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface font-bold">SLMS</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">
                Student Learning Management System
              </p>
            </MimicLink>
            <MimicLink
              className="group flex flex-col items-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all"
              href="/online-services"
            >
              <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span
                  className="material-symbols-outlined text-[32px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  folder_open
                </span>
              </div>
              <h3 className="font-label-md text-label-md text-on-surface font-bold">Downloadables</h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">
                Forms, modules, and public documents
              </p>
            </MimicLink>
          </div>
        </div>
      </section>

      {/* Latest Announcements */}
      <section className="py-16 bg-surface-container-low">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              <EditableText id="announcements_heading" label="Announcements section heading" as="span">
                Latest Announcements
              </EditableText>
            </h2>
            <MimicLink
              className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1"
              href="/news-events"
            >
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </MimicLink>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {announcements.length === 0 && (
              <p className="col-span-full text-center font-body-md text-body-md text-on-surface-variant py-8">
                No announcements published yet.
              </p>
            )}

            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow relative flex flex-col"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                {announcement.cover_image_url ? (
                  <div
                    className="h-40 w-full bg-surface-container-low"
                    style={{
                      backgroundImage: `url('${announcement.cover_image_url}')`,
                      backgroundSize: "contain",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                    }}
                  />
                ) : (
                  <div className="h-40 w-full bg-surface flex items-center justify-center border-b border-outline-variant">
                    <span
                      className="material-symbols-outlined text-[64px] text-primary"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      campaign
                    </span>
                  </div>
                )}
                <div className="p-4 flex-grow flex flex-col pl-6">
                  <span className="font-label-sm text-label-sm text-on-surface-variant mb-2">
                    {formatDate(announcement.published_at)}
                  </span>
                  <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-2 leading-tight">
                    {announcement.title}
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4">
                    {announcement.body}
                  </p>
                  <MimicLink
                    className="mt-auto font-label-md text-label-md text-primary hover:underline self-start"
                    href="/news-events"
                  >
                    Read More
                  </MimicLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-surface">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              <EditableText id="events_heading" label="Events section heading" as="span">
                Upcoming Events
              </EditableText>
            </h2>
            <MimicLink
              className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1"
              href="/news-events"
            >
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </MimicLink>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {events.length === 0 && (
              <p className="col-span-full text-center font-body-md text-body-md text-on-surface-variant py-8">
                No upcoming events published yet.
              </p>
            )}

            {events.map((event) => {
              const { day, month } = formatEventDay(event.starts_at);
              return (
                <div
                  key={event.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow relative flex flex-col"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary" />
                  {event.cover_image_url ? (
                    <div
                      className="h-40 w-full bg-surface-container-low"
                      style={{
                        backgroundImage: `url('${event.cover_image_url}')`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                      }}
                    />
                  ) : (
                    <div className="h-40 w-full bg-surface flex items-center justify-center border-b border-outline-variant">
                      <span
                        className="material-symbols-outlined text-[64px] text-secondary"
                        style={{ fontVariationSettings: "'FILL' 0" }}
                      >
                        event
                      </span>
                    </div>
                  )}
                  <div className="p-4 flex items-center gap-3 border-b border-outline-variant bg-surface pl-6">
                    <div className="bg-surface-container-low px-3 py-1 rounded-md text-center flex-shrink-0">
                      <span className="block font-headline-md text-headline-md text-secondary font-bold">
                        {day}
                      </span>
                      <span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">
                        {month}
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">schedule</span>
                      {formatEventTime(event.starts_at, event.ends_at)}
                    </span>
                  </div>
                  <div className="p-4 flex-grow flex flex-col pl-6">
                    <h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-2 leading-tight">
                      {event.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4">
                      {event.description}
                    </p>
                    {event.location && (
                      <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 mb-4">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        {event.location}
                      </span>
                    )}
                    <MimicLink
                      className="mt-auto font-label-md text-label-md text-primary hover:underline self-start"
                      href="/news-events"
                    >
                      View Details
                    </MimicLink>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
