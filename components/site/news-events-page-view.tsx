"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import type { Announcement, Event } from "@/types";
import { NEWS_EVENT_CATEGORIES, categoryLabel } from "@/lib/data/categories";
import { loadMoreNewsEvents } from "@/app/(site)/news-events/actions";
import { NEWS_EVENTS_PAGE_SIZE } from "@/app/(site)/news-events/constants";
import LoadMoreIndicator from "@/components/site/load-more-indicator";

type FeedKind = "announcement" | "event";

type FeedItem = {
  id: string;
  kind: FeedKind;
  title: string;
  description: string;
  date: Date;
  endDate: Date | null;
  location: string | null;
  category: string;
  coverImageUrl: string | null;
};

const PAGE_SIZE = 6;

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function formatDayBadge(d: Date) {
  return {
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "long", year: "numeric" }),
  };
}

function formatTimeRange(start: Date, end: Date | null) {
  const startStr = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!end) return startStr;
  const endStr = end.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${startStr} - ${endStr}`;
}

// Every calendar day a (possibly multi-day) event touches, capped so a
// bad/very-long end date can't blow up the loop.
function daysTouchedByEvent(start: Date, end: Date | null): string[] {
  if (!end || dateKey(end) === dateKey(start)) return [dateKey(start)];
  const keys: string[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  let guard = 0;
  while (cursor.getTime() <= last.getTime() && guard < 31) {
    keys.push(dateKey(cursor));
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }
  return keys;
}

export default function NewsEventsPageView({
  initialAnnouncements,
  initialEvents,
  initialHasMore,
}: {
  initialAnnouncements: Announcement[];
  initialEvents: Event[];
  initialHasMore: boolean;
}) {
  // Announcements/events fetched so far. More of each load lazily in
  // parallel batches (via the sentinel below) as the visitor scrolls,
  // instead of pulling every announcement and event on first paint.
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [events, setEvents] = useState(initialEvents);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isPending, startTransition] = useTransition();
  const loadingRef = useRef(false);

  function loadMore() {
    if (loadingRef.current || !hasMore) return;
    loadingRef.current = true;
    startTransition(async () => {
      const batch = await loadMoreNewsEvents(
        announcements.length,
        events.length,
        NEWS_EVENTS_PAGE_SIZE
      );
      setAnnouncements((prev) => [...prev, ...batch.announcements]);
      setEvents((prev) => [...prev, ...batch.events]);
      setHasMore(batch.hasMore);
      loadingRef.current = false;
    });
  }

  const items: FeedItem[] = useMemo(() => {
    const fromAnnouncements: FeedItem[] = announcements.map((a) => ({
      id: a.id,
      kind: "announcement",
      title: a.title,
      description: a.body,
      date: new Date(a.published_at ?? a.created_at),
      endDate: null,
      location: null,
      category: a.category || "general",
      coverImageUrl: a.cover_image_url,
    }));
    const fromEvents: FeedItem[] = events.map((e) => ({
      id: e.id,
      kind: "event",
      title: e.title,
      description: e.description,
      date: new Date(e.starts_at),
      endDate: e.ends_at ? new Date(e.ends_at) : null,
      location: e.location,
      category: e.category || "general",
      coverImageUrl: e.cover_image_url,
    }));
    return [...fromAnnouncements, ...fromEvents].sort(
      (a, b) => b.date.getTime() - a.date.getTime()
    );
  }, [announcements, events]);

  const searchParams = useSearchParams();
  const highlightParam = searchParams.get("highlight"); // "event:<id>" | "announcement:<id>"
  const [highlightKind, highlightId] = highlightParam?.includes(":")
    ? (highlightParam.split(":") as [FeedKind, string])
    : [null, null];
  const highlightRef = useRef<HTMLElement | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | FeedKind>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [page, setPage] = useState(1);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Always show the full category list as filter chips — not just
  // categories that happen to have published content yet. An admin
  // should be able to see "Sports" is an option even before the
  // first sports announcement goes out.
  const categoriesInTypeScope = NEWS_EVENT_CATEGORIES;

  // Builds a lowercase blob of every date-ish way someone might type
  // this item's date: full/short month name, zero-padded and bare day,
  // 4-digit year, and weekday name. Lets search match "august 17",
  // "aug 17 2026", "2026", or a bare day-of-month like "17" — which
  // otherwise wouldn't appear anywhere in the title/description text.
  function dateSearchHaystack(item: FeedItem) {
    const dates = [item.date, item.endDate].filter((d): d is Date => !!d);
    return dates
      .flatMap((d) => [
        d.toLocaleDateString("en-US", { month: "long" }), // "August"
        d.toLocaleDateString("en-US", { month: "short" }), // "Aug"
        d.toLocaleDateString("en-US", { weekday: "long" }), // "Monday"
        String(d.getDate()), // "17"
        String(d.getDate()).padStart(2, "0"), // "07" for single-digit days
        String(d.getFullYear()), // "2026"
      ])
      .join(" ")
      .toLowerCase();
  }

  const filteredItems = useMemo(() => {
    const tokens = search.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => {
      if (typeFilter !== "all" && item.kind !== typeFilter) return false;
      if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
      if (tokens.length > 0) {
        const haystack = `${item.title} ${item.description} ${dateSearchHaystack(
          item
        )}`.toLowerCase();
        // Every typed word has to appear somewhere (title, description,
        // or a date component) — so "august 17" only matches items that
        // are both in August AND on the 17th, not just one or the other.
        const matchesAllTokens = tokens.every((t) => haystack.includes(t));
        if (!matchesAllTokens) return false;
      }
      return true;
    });
  }, [items, typeFilter, categoryFilter, search]);

  // Reset to page 1 / clear the day selection whenever a filter
  // changes, so a stale page number or day pick from a previous
  // filter set never hides real results. Done inline in each filter
  // setter below rather than in an effect, to avoid an extra render.
  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
    setSelectedDay(null);
  }

  function updateTypeFilter(value: "all" | FeedKind) {
    setTypeFilter(value);
    setCategoryFilter("all");
    setPage(1);
    setSelectedDay(null);
  }

  function updateCategoryFilter(value: "all" | string) {
    setCategoryFilter(value);
    setPage(1);
    setSelectedDay(null);
  }

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
  const pageItems = filteredItems.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // A search-result deep link arrived (?highlight=event:<id> or
  // announcement:<id>) — clear filters/switch to list view so the
  // target item is guaranteed to be in scope, then jump to whichever
  // page it lands on.
  useEffect(() => {
    if (highlightId) {
      setSearch("");
      setTypeFilter("all");
      setCategoryFilter("all");
      setView("list");
      setSelectedDay(null);
    }
    // Only re-run when a new highlight target arrives.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightParam]);

  useEffect(() => {
    if (!highlightId) return;
    const index = filteredItems.findIndex(
      (item) => item.kind === highlightKind && item.id === highlightId
    );
    if (index === -1) return;
    const targetPage = Math.floor(index / PAGE_SIZE) + 1;
    setPage((p) => (p === targetPage ? p : targetPage));
  }, [highlightId, highlightKind, filteredItems]);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId, pageItems]);

  // A search-result deep link can point at an item further back than
  // what's loaded yet — keep pulling batches until it shows up (or we
  // genuinely run out), instead of leaving the link looking broken.
  useEffect(() => {
    if (!highlightId) return;
    const found = items.some(
      (item) => item.kind === highlightKind && item.id === highlightId
    );
    if (!found && hasMore) loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightId, highlightKind, items, hasMore]);

  // The visitor paged to the last page of what's currently loaded —
  // fetch the next batch preemptively so "Next" keeps working instead
  // of dead-ending once they've exhausted what was fetched so far.
  useEffect(() => {
    if (!search && typeFilter === "all" && categoryFilter === "all" && page === totalPages && hasMore) {
      loadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages, hasMore]);

  const itemsByDay = useMemo(() => {
    const map = new Map<string, FeedItem[]>();
    for (const item of filteredItems) {
      const keys =
        item.kind === "event"
          ? daysTouchedByEvent(item.date, item.endDate)
          : [dateKey(item.date)];
      for (const key of keys) {
        const list = map.get(key) ?? [];
        list.push(item);
        map.set(key, list);
      }
    }
    return map;
  }, [filteredItems]);

  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(
      month.getFullYear(),
      month.getMonth() + 1,
      0
    ).getDate();
    const cells: { date: Date | null; key: string | null }[] = [];
    for (let i = 0; i < startOffset; i++) cells.push({ date: null, key: null });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(month.getFullYear(), month.getMonth(), d);
      cells.push({ date, key: dateKey(date) });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, key: null });
    return cells;
  }, [month]);

  const todayKey = dateKey(new Date());

  function goToMonth(offset: number) {
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + offset, 1));
  }

  const dayDetailItems = selectedDay ? itemsByDay.get(selectedDay) ?? [] : [];

  function renderCard(item: FeedItem) {
    const { day, month: monthLabel } = formatDayBadge(item.date);
    const isEvent = item.kind === "event";
    const isHighlighted = item.kind === highlightKind && item.id === highlightId;
    return (
      <article
        key={`${item.kind}-${item.id}`}
        id={`feed-${item.kind}-${item.id}`}
        ref={isHighlighted ? (highlightRef as React.Ref<HTMLElement>) : undefined}
        className={`bg-surface rounded-lg border overflow-hidden flex flex-col md:flex-row relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow ${
          isHighlighted ? "border-primary ring-2 ring-primary/40" : "border-outline-variant"
        }`}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 ${
            isEvent ? "bg-secondary" : "bg-primary"
          }`}
        ></div>
        <div className="md:w-1/4 bg-surface-container-lowest p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-outline-variant">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`font-label-sm text-label-sm uppercase tracking-wider ${
                isEvent ? "text-secondary" : "text-primary"
              }`}
            >
              {isEvent ? "Event" : "Announcement"}
            </span>
            <span className="text-[10px] uppercase tracking-wide font-label-sm text-on-surface-variant bg-surface-container-low border border-outline-variant px-1.5 py-0.5 rounded">
              {categoryLabel(item.category)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg text-on-background">
              {day}
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              {monthLabel}
            </span>
          </div>
        </div>
        <div className="p-6 md:w-3/4 flex flex-col justify-between">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">
              {item.description}
            </p>
          </div>
          {isEvent && (
            <div className="mt-4 flex items-center justify-between">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                    schedule
                  </span>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">
                    {formatTimeRange(item.date, item.endDate)}
                  </span>
                </div>
                {item.location && (
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      location_on
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">
                      {item.location}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">
            News &amp; Events
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Stay updated with the latest announcements and school activities.
          </p>
        </div>

        <div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
          <button
            onClick={() => setView("list")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-label-md text-label-md transition-all ${
              view === "list"
                ? "bg-surface text-primary shadow-sm border border-outline-variant"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={view === "list" ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              view_list
            </span>
            List View
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`flex items-center gap-2 px-4 py-2 rounded-md font-label-md text-label-md transition-all ${
              view === "calendar"
                ? "bg-surface text-primary shadow-sm border border-outline-variant"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={
                view === "calendar" ? { fontVariationSettings: "'FILL' 1" } : undefined
              }
            >
              calendar_view_month
            </span>
            Calendar View
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-lg border border-outline-variant p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface placeholder-on-surface-variant"
            placeholder="Search events or announcements..."
            type="text"
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {(
            [
              { key: "all", label: "All" },
              { key: "announcement", label: "Announcements" },
              { key: "event", label: "Events" },
            ] as { key: "all" | FeedKind; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => updateTypeFilter(key)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full border font-label-md text-label-md transition-colors ${
                typeFilter === key
                  ? "border-primary text-primary bg-primary/5"
                  : "border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {categoriesInTypeScope.length > 0 && (
        <div className="flex gap-2 w-full overflow-x-auto pb-2 mb-8">
          <button
            onClick={() => updateCategoryFilter("all")}
            className={`whitespace-nowrap px-3 py-1 rounded-full border font-label-sm text-label-sm transition-colors ${
              categoryFilter === "all"
                ? "border-secondary text-secondary bg-secondary/5"
                : "border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary"
            }`}
          >
            All categories
          </button>
          {categoriesInTypeScope.map((c) => (
            <button
              key={c.slug}
              onClick={() => updateCategoryFilter(c.slug)}
              className={`whitespace-nowrap px-3 py-1 rounded-full border font-label-sm text-label-sm transition-colors ${
                categoryFilter === c.slug
                  ? "border-secondary text-secondary bg-secondary/5"
                  : "border-outline-variant text-on-surface-variant hover:border-secondary hover:text-secondary"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {view === "list" && (
        <>
          <div className="flex flex-col gap-6">
            {filteredItems.length === 0 && (
              <p className="text-center font-body-md text-body-md text-on-surface-variant py-4">
                {items.length === 0
                  ? "Nothing published yet."
                  : "No announcements or events match your search/filters."}
              </p>
            )}
            {pageItems.map(renderCard)}
            {isPending && page === totalPages && <LoadMoreIndicator />}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              <button
                className="p-2 text-on-surface-variant hover:text-primary disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-8 h-8 rounded-full font-label-md text-label-md flex items-center justify-center transition-colors ${
                    n === page
                      ? "bg-primary text-on-primary"
                      : "text-on-surface-variant hover:bg-surface-container-high"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                className="p-2 text-on-surface-variant hover:text-primary disabled:opacity-50"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </>
      )}

      {view === "calendar" && (
        <div className="flex flex-col gap-6">
          <div className="bg-surface rounded-lg border border-outline-variant overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-lowest">
              <button
                onClick={() => goToMonth(-1)}
                className="p-1.5 rounded-DEFAULT text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label="Previous month"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="flex items-center gap-3">
                <h2 className="font-headline-md text-headline-md text-on-background">
                  {month.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h2>
                <button
                  onClick={() => {
                    const now = new Date();
                    setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
                    setSelectedDay(todayKey);
                  }}
                  className="font-label-sm text-label-sm text-primary border border-primary/30 rounded-full px-2.5 py-0.5 hover:bg-primary/5 transition-colors"
                >
                  Today
                </button>
              </div>
              <button
                onClick={() => goToMonth(1)}
                className="p-1.5 rounded-DEFAULT text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors"
                aria-label="Next month"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-lowest">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div
                  key={d}
                  className="py-2 text-center font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarCells.map((cell, idx) => {
                if (!cell.date || !cell.key) {
                  return (
                    <div
                      key={idx}
                      className="min-h-[92px] border-b border-r border-outline-variant/60 bg-surface-container-lowest/40"
                    ></div>
                  );
                }
                const dayItems = itemsByDay.get(cell.key) ?? [];
                const hasAnnouncement = dayItems.some((i) => i.kind === "announcement");
                const hasEvent = dayItems.some((i) => i.kind === "event");
                const isToday = cell.key === todayKey;
                const isSelected = cell.key === selectedDay;
                return (
                  <button
                    key={idx}
                    onClick={() =>
                      setSelectedDay((prev) => (prev === cell.key ? null : cell.key))
                    }
                    className={`min-h-[92px] border-b border-r border-outline-variant/60 p-2 flex flex-col items-start text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10"
                        : dayItems.length > 0
                        ? "bg-surface hover:bg-surface-container-low"
                        : "bg-surface hover:bg-surface-container-low/60"
                    }`}
                  >
                    <span
                      className={`font-label-md text-label-md w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday
                          ? "bg-primary text-on-primary"
                          : "text-on-surface-variant"
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>
                    {dayItems.length > 0 && (
                      <div className="mt-1.5 flex flex-col gap-1 w-full">
                        <div className="flex items-center gap-1">
                          {hasAnnouncement && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          )}
                          {hasEvent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                          )}
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            {dayItems.length} item{dayItems.length === 1 ? "" : "s"}
                          </span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-headline-sm text-headline-md text-on-background mb-4">
              {selectedDay
                ? `Items on ${new Date(selectedDay + "T00:00:00").toLocaleDateString(
                    "en-US",
                    { month: "long", day: "numeric", year: "numeric" }
                  )}`
                : "Select a day to see what's happening"}
            </h3>
            {selectedDay && dayDetailItems.length === 0 && (
              <p className="font-body-md text-body-md text-on-surface-variant">
                Nothing published for this day.
              </p>
            )}
            <div className="flex flex-col gap-6">
              {dayDetailItems.map(renderCard)}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
