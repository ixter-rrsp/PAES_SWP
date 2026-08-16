"use client";

import { useMemo, useState, useTransition } from "react";
import type { Event } from "@/types";
import {
  createEvent,
  deleteEvent,
  setEventStatus,
  updateEvent,
} from "./actions";

type StatusFilter = "all" | "published" | "draft";

function formatDateTime(startsAt: string, endsAt: string | null) {
  const start = new Date(startsAt);
  const date = start.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!endsAt) return { date, time: startTime };
  const endTime = new Date(endsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time: `${startTime} - ${endTime}` };
}

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm" in local time.
function toLocalInputValue(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function EventsClient({
  initialEvents,
}: {
  initialEvents: Event[];
}) {
  const [events, setEvents] = useState(initialEvents);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Event | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: events.length,
      published: events.filter((e) => e.status === "published").length,
      draft: events.filter((e) => e.status === "draft").length,
    }),
    [events]
  );

  const visible = useMemo(
    () =>
      filter === "all" ? events : events.filter((e) => e.status === filter),
    [events, filter]
  );

  function openCreatePanel() {
    setEditing(null);
    setFormError(null);
    setPanelOpen(true);
  }

  function openEditPanel(event: Event) {
    setEditing(event);
    setFormError(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditing(null);
    setFormError(null);
  }

  function handleSubmit(formData: FormData) {
    setFormError(null);
    startTransition(async () => {
      const result = editing
        ? await updateEvent(editing.id, formData)
        : await createEvent(formData);

      if (result.error) {
        setFormError(result.error);
        return;
      }

      // Same approach as Announcements: reload picks up the fresh
      // list, and revalidatePath already keeps public pages in sync.
      window.location.reload();
    });
  }

  function handleToggleStatus(event: Event) {
    const nextStatus = event.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const result = await setEventStatus(event.id, nextStatus);
      if (result.error) {
        alert(result.error);
        return;
      }
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, status: nextStatus } : e))
      );
    });
  }

  function handleDelete(event: Event) {
    if (!confirm(`Delete "${event.title}"? This can't be undone.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteEvent(event.id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Events Manager
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            Manage institutional events, assemblies, and public holidays.
          </p>
        </div>
        <button
          className="bg-primary-container text-white font-label-lg text-label-lg px-4 py-2 rounded-DEFAULT flex items-center gap-2 hover:bg-primary transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm whitespace-nowrap"
          onClick={openCreatePanel}
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Event
        </button>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.02)]">
        <div className="px-gutter py-3 border-b border-outline-variant bg-surface-bright flex flex-wrap gap-2 items-center">
          {(["all", "published", "draft"] as StatusFilter[]).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 text-label-md font-label-md rounded-full border transition-colors ${
                filter === key
                  ? "bg-primary-container/10 text-primary border-primary/20"
                  : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
              }`}
            >
              {key === "all" ? "All" : key === "published" ? "Published" : "Drafts"} (
              {counts[key]})
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EDEEEF] border-b border-outline-variant">
                <th className="py-2 px-gutter font-label-md text-label-md text-on-surface w-[40%]">
                  Event Title &amp; Location
                </th>
                <th className="py-2 px-gutter font-label-md text-label-md text-on-surface w-[20%]">
                  Status
                </th>
                <th className="py-2 px-gutter font-label-md text-label-md text-on-surface w-[25%]">
                  Date &amp; Time
                </th>
                <th className="py-2 px-gutter font-label-md text-label-md text-on-surface text-right w-[15%]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm">
              {visible.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="py-10 px-gutter text-center text-on-surface-variant"
                  >
                    No events {filter !== "all" ? `in "${filter}"` : "yet"}.
                  </td>
                </tr>
              )}
              {visible.map((event) => {
                const { date, time } = formatDateTime(
                  event.starts_at,
                  event.ends_at
                );
                return (
                  <tr
                    key={event.id}
                    className="border-b border-outline-variant hover:bg-[#F3F4F5] transition-colors group"
                  >
                    <td className="py-density-sm px-gutter">
                      <div className="flex flex-col py-1">
                        <span className="font-label-lg text-label-lg text-on-surface">
                          {event.title}
                        </span>
                        {event.location && (
                          <span className="text-on-surface-variant flex items-center gap-1 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">
                              location_on
                            </span>
                            {event.location}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-density-sm px-gutter">
                      {event.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container/30 text-status-published font-label-md text-[11px] border border-secondary-container/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-published"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high text-status-draft font-label-md text-[11px] border border-outline-variant/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-draft"></span>
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="py-density-sm px-gutter">
                      <div className="flex flex-col py-1">
                        <span className="text-on-surface font-medium">{date}</span>
                        <span className="text-on-surface-variant">{time}</span>
                      </div>
                    </td>
                    <td className="py-density-sm px-gutter text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-tertiary-container hover:bg-tertiary-container/10 rounded-DEFAULT transition-colors disabled:opacity-50"
                          title="Toggle Visibility"
                          disabled={isPending}
                          onClick={() => handleToggleStatus(event)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {event.status === "published"
                              ? "visibility"
                              : "visibility_off"}
                          </span>
                        </button>
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded-DEFAULT transition-colors"
                          title="Edit"
                          onClick={() => openEditPanel(event)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            edit
                          </span>
                        </button>
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-DEFAULT transition-colors disabled:opacity-50"
                          title="Delete"
                          disabled={isPending}
                          onClick={() => handleDelete(event)}
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="px-gutter py-3 bg-surface-bright flex items-center justify-between border-t border-outline-variant">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing {visible.length} of {events.length} event
            {events.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      <div
        aria-labelledby="slide-over-title"
        aria-modal="true"
        className={`modal-overlay fixed inset-0 z-50 overflow-hidden ${
          panelOpen ? "active" : ""
        }`}
        role="dialog"
      >
        <div
          className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm transition-opacity cursor-pointer"
          onClick={closePanel}
        ></div>
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="modal-panel pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-[0px_4px_24px_rgba(0,0,0,0.15)] border-l border-outline-variant">
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-muted">
                <h2
                  className="font-headline-sm text-headline-sm text-on-surface"
                  id="slide-over-title"
                >
                  {editing ? "Edit Event" : "Create Event"}
                </h2>
                <button
                  className="rounded-DEFAULT text-on-surface-variant hover:text-error hover:bg-error/10 p-1 transition-colors"
                  onClick={closePanel}
                  type="button"
                >
                  <span className="sr-only">Close panel</span>
                  <span className="material-symbols-outlined text-[24px]">
                    close
                  </span>
                </button>
              </div>

              <form action={handleSubmit} className="contents">
                <div className="relative flex-1 px-6 py-6 sm:px-6">
                  <div className="space-y-6">
                    {formError && (
                      <div className="bg-error-container text-on-error-container text-body-sm font-body-sm px-4 py-2.5 rounded-lg">
                        {formError}
                      </div>
                    )}

                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="title"
                      >
                        Title
                      </label>
                      <input
                        className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                        id="title"
                        name="title"
                        placeholder="e.g., Brigada Eskwela Kick-off"
                        type="text"
                        defaultValue={editing?.title ?? ""}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="location"
                      >
                        Location
                      </label>
                      <input
                        className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                        id="location"
                        name="location"
                        placeholder="e.g., Main Gymnasium"
                        type="text"
                        defaultValue={editing?.location ?? ""}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          className="block font-label-md text-label-md text-on-surface-variant mb-1"
                          htmlFor="starts_at"
                        >
                          Starts At
                        </label>
                        <input
                          className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                          id="starts_at"
                          name="starts_at"
                          type="datetime-local"
                          defaultValue={toLocalInputValue(
                            editing?.starts_at ?? null
                          )}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="block font-label-md text-label-md text-on-surface-variant mb-1"
                          htmlFor="ends_at"
                        >
                          Ends At
                        </label>
                        <input
                          className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                          id="ends_at"
                          name="ends_at"
                          type="datetime-local"
                          defaultValue={toLocalInputValue(
                            editing?.ends_at ?? null
                          )}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="description"
                      >
                        Description
                      </label>
                      <textarea
                        className="block w-full border border-outline-variant rounded-DEFAULT px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright resize-y"
                        id="description"
                        name="description"
                        placeholder="Write event details here..."
                        rows={6}
                        defaultValue={editing?.description ?? ""}
                      ></textarea>
                    </div>

                    {!editing && (
                      <div className="flex items-center justify-between p-4 border border-outline-variant rounded-DEFAULT bg-surface-bright">
                        <div>
                          <h3 className="font-label-md text-label-md text-on-surface">
                            Immediate Visibility
                          </h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Make active upon saving
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            className="sr-only peer"
                            type="checkbox"
                            name="publish_now"
                          />
                          <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container border border-outline-variant peer-checked:border-primary-container"></div>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-shrink-0 justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-muted">
                  <button
                    className="px-4 py-2 bg-transparent text-on-surface-variant border border-outline-variant font-label-md text-label-md rounded-DEFAULT hover:bg-surface-container-low hover:text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={closePanel}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-primary-container text-white font-label-md text-label-md rounded-DEFAULT hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm disabled:opacity-60"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Saving..." : editing ? "Save Changes" : "Save Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}