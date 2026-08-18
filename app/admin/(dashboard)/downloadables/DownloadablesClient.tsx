"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { Downloadable } from "@/types";
import {
  createDownloadable,
  deleteDownloadable,
  fetchDownloadablesPage,
  setDownloadableStatus,
  updateDownloadable,
} from "./actions";

type StatusFilter = "all" | "published" | "draft";
type StatusCounts = { all: number; published: number; draft: number };

type PreviewState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ok"; sizeBytes: number | null; ext: string | null }
  | { status: "error"; message: string };

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Google Drive link field with a debounced live check: as the admin
 * pastes/edits the URL, we ask /api/admin/drive-preview whether the
 * file is actually reachable and show a thumbnail + size before they
 * ever hit Save. This is a UX nicety only — the server action
 * re-validates independently on submit, so a stale/skipped check here
 * can never let a bad link through.
 */
function DriveUrlField({
  defaultValue,
  wasLegacyUpload,
}: {
  defaultValue: string;
  wasLegacyUpload: boolean | undefined;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [preview, setPreview] = useState<PreviewState>({ status: "idle" });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = url.trim();
    if (!trimmed || !/drive\.google\.com/.test(trimmed)) {
      setPreview({ status: "idle" });
      return;
    }

    setPreview({ status: "checking" });
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/admin/drive-preview?url=${encodeURIComponent(trimmed)}`
        );
        const data = await res.json();
        if (!data.accessible) {
          setPreview({
            status: "error",
            message: data.error ?? "This file isn't publicly accessible.",
          });
          return;
        }
        setPreview({ status: "ok", sizeBytes: data.sizeBytes, ext: data.ext });
      } catch {
        setPreview({ status: "error", message: "Couldn't check that link." });
      }
    }, 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [url]);

  return (
    <div>
      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="drive_url">
        Google Drive Link
      </label>
      <input
        className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
        id="drive_url"
        name="drive_url"
        placeholder="https://drive.google.com/file/d/..."
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
        Make sure sharing is set to &quot;Anyone with the link.&quot; Visitors
        never see this link directly — the site downloads it on their behalf.
      </p>
      {wasLegacyUpload && (
        <p className="font-body-sm text-body-sm text-tertiary mt-1">
          This item currently points at an old uploaded file. Paste a Drive
          link to switch it over.
        </p>
      )}

      {preview.status === "checking" && (
        <div className="mt-3 flex items-center gap-2 text-body-sm text-on-surface-variant">
          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
          Checking link...
        </div>
      )}

      {preview.status === "error" && (
        <div className="mt-3 flex items-start gap-2 text-body-sm text-error">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {preview.message}
        </div>
      )}

      {preview.status === "ok" && (
        <div className="mt-3 flex items-center gap-3 p-2.5 border border-outline-variant rounded-DEFAULT bg-surface-bright">
          <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-surface-container-low border border-outline-variant">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/admin/drive-preview/thumbnail?url=${encodeURIComponent(url.trim())}`}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5 text-secondary font-label-md">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Link works
            </div>
            <div className="mt-0.5">
              {preview.ext ? preview.ext.toUpperCase() : "File"}
              {preview.sizeBytes ? ` • ${formatSize(preview.sizeBytes)}` : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DownloadablesClient({
  initialDownloadables,
  initialHasMore,
  initialCounts,
  pageSize,
}: {
  initialDownloadables: Downloadable[];
  initialHasMore: boolean;
  initialCounts: StatusCounts;
  pageSize: number;
}) {
  const [items, setItems] = useState(initialDownloadables);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [counts, setCounts] = useState<StatusCounts>(initialCounts);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Downloadable | null>(null);
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
      const result = await fetchDownloadablesPage(0, pageSize, status);
      setItems(result.items);
      setHasMore(result.hasMore);
      setIsLoadingMore(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  function handleLoadMore() {
    setIsLoadingMore(true);
    startTransition(async () => {
      const status = filter === "all" ? undefined : filter;
      const result = await fetchDownloadablesPage(items.length, pageSize, status);
      setItems((prev) => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setIsLoadingMore(false);
    });
  }

  const legacyItems = useMemo(
    () => items.filter((d) => d.source === "upload"),
    [items]
  );

  // Status filtering already happened server-side (see effect above).
  const visible = items;

  function openCreatePanel() {
    setEditing(null);
    setFormError(null);
    setPanelOpen(true);
  }

  function openEditPanel(item: Downloadable) {
    setEditing(item);
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
        ? await updateDownloadable(editing.id, formData)
        : await createDownloadable(formData);

      if (result.error) {
        setFormError(result.error);
        return;
      }

      window.location.reload();
    });
  }

  function handleToggleStatus(item: Downloadable) {
    const nextStatus = item.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const result = await setDownloadableStatus(item.id, nextStatus);
      if (result.error) {
        alert(result.error);
        return;
      }
      setItems((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, status: nextStatus } : d))
      );
      setCounts((prev) => ({
        ...prev,
        published: prev.published + (nextStatus === "published" ? 1 : -1),
        draft: prev.draft + (nextStatus === "draft" ? 1 : -1),
      }));
    });
  }

  function handleDelete(item: Downloadable) {
    if (!confirm(`Delete "${item.title}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteDownloadable(item.id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setItems((prev) => prev.filter((d) => d.id !== item.id));
      setCounts((prev) => ({
        all: prev.all - 1,
        published: prev.published - (item.status === "published" ? 1 : 0),
        draft: prev.draft - (item.status === "draft" ? 1 : 0),
      }));
    });
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 md:p-margin-page bg-surface-bright">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Downloadables
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Manage forms, templates, and public documents.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container text-white font-label-lg text-label-lg rounded-DEFAULT hover:bg-primary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container whitespace-nowrap"
            onClick={openCreatePanel}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Downloadable
          </button>
        </div>

        {legacyItems.length > 0 && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 border border-tertiary/30 bg-tertiary-container/10 rounded-DEFAULT">
            <span className="material-symbols-outlined text-tertiary text-[20px] mt-0.5">upload_file</span>
            <div className="flex-1">
              <p className="font-label-md text-label-md text-on-surface">
                {legacyItems.length} downloadable{legacyItems.length > 1 ? "s" : ""} still{" "}
                {legacyItems.length > 1 ? "point" : "points"} at an old uploaded file.
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Edit each one and paste a Google Drive link to move it off Supabase storage:{" "}
                {legacyItems.map((item, i) => (
                  <span key={item.id}>
                    <button
                      type="button"
                      className="underline hover:text-primary"
                      onClick={() => openEditPanel(item)}
                    >
                      {item.title}
                    </button>
                    {i < legacyItems.length - 1 ? ", " : ""}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-DEFAULT border border-outline-variant overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant bg-surface-muted flex flex-wrap gap-2">
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
                <tr className="bg-[#EDEEEF] border-b border-outline-variant text-on-surface">
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px">
                    Status
                  </th>
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold min-w-[300px]">
                    Title
                  </th>
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px hidden md:table-cell">
                    Source
                  </th>
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px hidden md:table-cell">
                    Added
                  </th>
                  <th className="px-4 py-2 font-label-md text-label-md font-semibold text-right whitespace-nowrap w-px">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant bg-white font-body-md text-body-md">
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-on-surface-variant">
                      No downloadables {filter !== "all" ? `in "${filter}"` : "yet"}.
                    </td>
                  </tr>
                )}
                {visible.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F3F4F5] transition-colors group">
                    <td className="px-4 py-density-md whitespace-nowrap">
                      {item.status === "published" ? (
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
                      <div className="font-semibold text-on-surface">{item.title}</div>
                      <div className="text-body-sm text-on-surface-variant mt-0.5 truncate max-w-md">
                        {item.category ?? "Uncategorized"}
                        {item.file_size_bytes ? ` • ${formatSize(item.file_size_bytes)}` : ""}
                      </div>
                    </td>
                    <td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden md:table-cell">
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">
                          {item.source === "drive" ? "cloud" : "upload_file"}
                        </span>
                        {item.source === "drive" ? "Drive" : "Uploaded"}
                      </span>
                    </td>
                    <td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden md:table-cell">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-4 py-density-md whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-tertiary-container hover:bg-tertiary-container/10 rounded-DEFAULT transition-colors disabled:opacity-50"
                          title="Toggle Visibility"
                          disabled={isPending}
                          onClick={() => handleToggleStatus(item)}
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {item.status === "published" ? "visibility" : "visibility_off"}
                          </span>
                        </button>
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-DEFAULT transition-colors"
                          title="Edit"
                          onClick={() => openEditPanel(item)}
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-DEFAULT transition-colors disabled:opacity-50"
                          title="Delete"
                          disabled={isPending}
                          onClick={() => handleDelete(item)}
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
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
        className={`modal-overlay fixed inset-0 z-50 overflow-hidden ${panelOpen ? "active" : ""}`}
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
                <h2 className="font-headline-sm text-headline-sm text-on-surface" id="slide-over-title">
                  {editing ? "Edit Downloadable" : "Create Downloadable"}
                </h2>
                <button
                  className="rounded-DEFAULT text-on-surface-variant hover:text-error hover:bg-error/10 p-1 transition-colors"
                  onClick={closePanel}
                  type="button"
                >
                  <span className="sr-only">Close panel</span>
                  <span className="material-symbols-outlined text-[24px]">close</span>
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
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="title">
                        Title
                      </label>
                      <input
                        className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                        id="title"
                        name="title"
                        placeholder="e.g., Personal Data Sheet (PDS)"
                        type="text"
                        defaultValue={editing?.title ?? ""}
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="category">
                        Category
                      </label>
                      <input
                        className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                        id="category"
                        name="category"
                        placeholder="e.g., Enrollment Forms"
                        type="text"
                        defaultValue={editing?.category ?? ""}
                      />
                    </div>

                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="description">
                        Description
                      </label>
                      <textarea
                        className="block w-full border border-outline-variant rounded-DEFAULT px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright resize-y"
                        id="description"
                        name="description"
                        placeholder="Short note about this document..."
                        rows={3}
                        defaultValue={editing?.description ?? ""}
                      ></textarea>
                    </div>

                    <DriveUrlField
                      defaultValue={editing?.source === "drive" ? editing.file_url : ""}
                      wasLegacyUpload={editing?.source === "upload"}
                      key={editing?.id ?? "new"}
                    />

                    {!editing && (
                      <div className="flex items-center justify-between p-4 border border-outline-variant rounded-DEFAULT bg-surface-bright">
                        <div>
                          <h3 className="font-label-md text-label-md text-on-surface">Immediate Visibility</h3>
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                            Make active upon saving
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input className="sr-only peer" type="checkbox" name="publish_now" />
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
                    {isPending ? "Saving..." : editing ? "Save Changes" : "Save Downloadable"}
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
