"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Announcement } from "@/types";
import ImageUrlField from "@/components/admin/image-url-field";
import { NEWS_EVENT_CATEGORIES, categoryLabel } from "@/lib/data/categories";
import {
  createAnnouncement,
  deleteAnnouncement,
  fetchAnnouncementsPage,
  setAnnouncementStatus,
  updateAnnouncement,
} from "./actions";

type StatusFilter = "all" | "published" | "draft";
type CategoryFilter = "all" | string;
type StatusCounts = { all: number; published: number; draft: number };

function formatDate(value: string | null) {
  if (!value) return "--";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AnnouncementsClient({
  initialAnnouncements,
  initialHasMore,
  initialCounts,
  pageSize,
}: {
  initialAnnouncements: Announcement[];
  initialHasMore: boolean;
  initialCounts: StatusCounts;
  pageSize: number;
}) {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [counts, setCounts] = useState<StatusCounts>(initialCounts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Lazy loading: the list only ever holds pages fetched so far, not
  // the whole table. Switching status tabs re-fetches page one for
  // that status server-side instead of filtering a fully-loaded array.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setIsLoadingMore(true);
    startTransition(async () => {
      const status = filter === "all" ? undefined : filter;
      const result = await fetchAnnouncementsPage(0, pageSize, status);
      setAnnouncements(result.items);
      setHasMore(result.hasMore);
      setIsLoadingMore(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function handleLoadMore() {
    setIsLoadingMore(true);
    startTransition(async () => {
      const status = filter === "all" ? undefined : filter;
      const result = await fetchAnnouncementsPage(announcements.length, pageSize, status);
      setAnnouncements((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setIsLoadingMore(false);
    });
  }

  const categoriesInUse = useMemo(() => {
    const slugs = new Set(announcements.map((a) => a.category || "general"));
    return NEWS_EVENT_CATEGORIES.filter((c) => slugs.has(c.slug));
  }, [announcements]);

  // Status filtering already happened server-side (see effect above);
  // only the category refinement is applied to the loaded page here.
  const visible = useMemo(
    () =>
      announcements.filter(
        (a) => categoryFilter === "all" || (a.category || "general") === categoryFilter
      ),
    [announcements, categoryFilter]
  );

  function openCreatePanel() {
    setEditing(null);
    setFormError(null);
    setPanelOpen(true);
  }

  function openEditPanel(announcement: Announcement) {
    setEditing(announcement);
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
        ? await updateAnnouncement(editing.id, formData)
        : await createAnnouncement(formData);

      if (result.error) {
        setFormError(result.error);
        return;
      }

      // Re-fetching the whole list is the simplest correct thing here —
      // this table is small (school announcements, not a firehose) and
      // revalidatePath already keeps the public pages in sync.
      window.location.reload();
    });
  }

  function handleToggleStatus(announcement: Announcement) {
    const nextStatus = announcement.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const result = await setAnnouncementStatus(
        announcement.id,
        nextStatus,
        announcement.published_at
      );
      if (result.error) {
        alert(result.error);
        return;
      }
      setAnnouncements((prev) =>
        prev.map((a) =>
          a.id === announcement.id
            ? {
                ...a,
                status: nextStatus,
                published_at:
                  nextStatus === "published"
                    ? a.published_at ?? new Date().toISOString()
                    : a.published_at,
              }
            : a
        )
      );
      setCounts((prev) => ({
        ...prev,
        published: prev.published + (nextStatus === "published" ? 1 : -1),
        draft: prev.draft + (nextStatus === "draft" ? 1 : -1),
      }));
    });
  }

  function handleDelete(announcement: Announcement) {
    if (!confirm(`Delete "${announcement.title}"? This can't be undone.`)) {
      return;
    }
    startTransition(async () => {
      const result = await deleteAnnouncement(announcement.id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setAnnouncements((prev) => prev.filter((a) => a.id !== announcement.id));
      setCounts((prev) => ({
        all: prev.all - 1,
        published: prev.published - (announcement.status === "published" ? 1 : 0),
        draft: prev.draft - (announcement.status === "draft" ? 1 : 0),
      }));
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-margin-page bg-surface-bright">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Announcements
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Manage global alerts and campus updates.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container text-white font-label-lg text-label-lg rounded-DEFAULT hover:bg-primary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container whitespace-nowrap"
            onClick={openCreatePanel}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Announcement
          </button>
        </div>

        <div className="bg-white rounded-DEFAULT border border-outline-variant overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant bg-surface-muted flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
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
          </div>

          {categoriesInUse.length > 0 && (
            <div className="px-4 py-2.5 border-b border-outline-variant bg-surface flex flex-wrap gap-2 items-center">
              <span className="font-label-sm text-label-sm text-on-surface-variant mr-1">
                Category:
              </span>
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-2.5 py-1 text-[11px] font-label-md rounded-full border transition-colors ${
                  categoryFilter === "all"
                    ? "bg-secondary-container/20 text-secondary border-secondary/30"
                    : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                }`}
              >
                All
              </button>
              {categoriesInUse.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => setCategoryFilter(c.slug)}
                  className={`px-2.5 py-1 text-[11px] font-label-md rounded-full border transition-colors ${
                    categoryFilter === c.slug
                      ? "bg-secondary-container/20 text-secondary border-secondary/30"
                      : "bg-surface text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#EDEEEF] border-b border-outline-variant text-on-surface">
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px">
                    Status
                  </th>
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold min-w-[300px]">
                    Title
                  </th>
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px hidden md:table-cell">
                    Publish Date
                  </th>
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold text-right whitespace-nowrap w-px">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-white font-body-md text-body-md">
                {visible.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-10 text-center text-on-surface-variant"
                    >
                      No announcements {filter !== "all" ? `in "${filter}"` : "yet"}
                      .
                    </td>
                  </tr>
                )}
                {visible.map((announcement) => (
                  <tr
                    key={announcement.id}
                    className="hover:bg-[#F3F4F5] transition-colors group"
                  >
                    <td className="px-4 py-density-md whitespace-nowrap">
                      {announcement.status === "published" ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT bg-secondary-container/20 text-status-published font-label-md text-label-md border border-secondary-container">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-published"></span>
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT bg-surface-container-highest text-status-draft font-label-md text-label-md border border-outline-variant">
                          <span className="w-1.5 h-1.5 rounded-full bg-status-draft"></span>
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-density-md">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-on-surface">
                          {announcement.title}
                        </span>
                        <span className="text-[10px] uppercase tracking-wide font-label-sm text-secondary bg-secondary-container/10 border border-secondary/20 px-1.5 py-0.5 rounded">
                          {categoryLabel(announcement.category)}
                        </span>
                      </div>
                      <div className="text-body-sm text-on-surface-variant mt-0.5 truncate max-w-md">
                        {announcement.body}
                      </div>
                    </td>
                    <td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden md:table-cell">
                      {formatDate(announcement.published_at)}
                    </td>
                    <td className="px-4 py-density-md whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-tertiary-container hover:bg-tertiary-container/10 rounded-DEFAULT transition-colors disabled:opacity-50"
                          title="Toggle Visibility"
                          disabled={isPending}
                          onClick={() => handleToggleStatus(announcement)}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {announcement.status === "published"
                              ? "visibility"
                              : "visibility_off"}
                          </span>
                        </button>
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-DEFAULT transition-colors"
                          title="Edit"
                          onClick={() => openEditPanel(announcement)}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            edit
                          </span>
                        </button>
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-DEFAULT transition-colors disabled:opacity-50"
                          title="Delete"
                          disabled={isPending}
                          onClick={() => handleDelete(announcement)}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t border-outline-variant bg-surface-muted flex justify-between items-center text-body-sm text-on-surface-variant">
            <div>
              Showing {visible.length} of {counts[filter]} entries
            </div>
            {hasMore && (
              <button
                className="px-3 py-1.5 text-label-md font-label-md text-primary border border-primary/30 rounded-DEFAULT hover:bg-primary/5 transition-colors disabled:opacity-50"
                disabled={isLoadingMore}
                onClick={handleLoadMore}
                type="button"
              >
                {isLoadingMore ? "Loading..." : "Load more"}
              </button>
            )}
          </div>
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
                  {editing ? "Edit Announcement" : "Create Announcement"}
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
                        placeholder="e.g., Campus Closure Notice"
                        type="text"
                        defaultValue={editing?.title ?? ""}
                        required
                      />
                    </div>

                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="category"
                      >
                        Category
                      </label>
                      <select
                        className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                        id="category"
                        name="category"
                        defaultValue={editing?.category ?? "general"}
                      >
                        {NEWS_EVENT_CATEGORIES.map((c) => (
                          <option key={c.slug} value={c.slug}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                        Used for filtering on the public News &amp; Events page.
                      </p>
                    </div>

                    <ImageUrlField
                      key={editing?.id ?? "new"}
                      name="cover_image_url"
                      label="Cover Image"
                      defaultValue={editing?.cover_image_url}
                      folder="announcements"
                      helpText="Shown on the announcement card on the home page and news feed."
                    />

                    <div>
                      <label
                        className="block font-label-md text-label-md text-on-surface-variant mb-1"
                        htmlFor="body"
                      >
                        Body Content
                      </label>
                      <textarea
                        className="block w-full border border-outline-variant rounded-DEFAULT px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright resize-y"
                        id="body"
                        name="body"
                        placeholder="Write announcement details here..."
                        rows={6}
                        defaultValue={editing?.body ?? ""}
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
                    {isPending
                      ? "Saving..."
                      : editing
                      ? "Save Changes"
                      : "Save Announcement"}
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
