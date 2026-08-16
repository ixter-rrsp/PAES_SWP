"use client";

import { useMemo, useState, useTransition } from "react";
import type { Downloadable } from "@/types";
import {
  createDownloadable,
  deleteDownloadable,
  setDownloadableStatus,
  updateDownloadable,
} from "./actions";

type StatusFilter = "all" | "published" | "draft";
type SourceTab = "upload" | "drive";

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

export default function DownloadablesClient({
  initialDownloadables,
}: {
  initialDownloadables: Downloadable[];
}) {
  const [items, setItems] = useState(initialDownloadables);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<Downloadable | null>(null);
  const [sourceTab, setSourceTab] = useState<SourceTab>("upload");
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const counts = useMemo(
    () => ({
      all: items.length,
      published: items.filter((d) => d.status === "published").length,
      draft: items.filter((d) => d.status === "draft").length,
    }),
    [items]
  );

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((d) => d.status === filter)),
    [items, filter]
  );

  function openCreatePanel() {
    setEditing(null);
    setSourceTab("upload");
    setFormError(null);
    setPanelOpen(true);
  }

  function openEditPanel(item: Downloadable) {
    setEditing(item);
    setSourceTab(item.source);
    setFormError(null);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setEditing(null);
    setFormError(null);
  }

  function handleSubmit(formData: FormData) {
    formData.set("source", sourceTab);
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

        <div className="bg-white rounded-DEFAULT border border-outline-variant overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant bg-surface-muted flex gap-2">
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
              Showing {visible.length} of {items.length} entries
            </div>
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

                    <div>
                      <label className="block font-label-md text-label-md text-on-surface-variant mb-2">
                        File Source
                      </label>
                      <div className="flex bg-surface-container-low border border-outline-variant p-0.5 rounded-DEFAULT mb-4 w-fit">
                        <button
                          type="button"
                          onClick={() => setSourceTab("upload")}
                          className={`px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md flex items-center gap-2 transition-all ${
                            sourceTab === "upload"
                              ? "bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-outline-variant text-primary"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">upload_file</span>
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setSourceTab("drive")}
                          className={`px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md flex items-center gap-2 transition-all ${
                            sourceTab === "drive"
                              ? "bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-outline-variant text-primary"
                              : "text-on-surface-variant hover:text-on-surface"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">cloud</span>
                          Google Drive Link
                        </button>
                      </div>

                      {sourceTab === "upload" ? (
                        <div>
                          <input
                            className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright file:mr-3 file:py-1.5 file:px-3 file:rounded-DEFAULT file:border-0 file:bg-primary-container file:text-white file:font-label-md"
                            id="file"
                            name="file"
                            type="file"
                          />
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            {editing?.source === "upload"
                              ? "Leave empty to keep the current file."
                              : "PDF, DOCX, XLSX, and similar files."}
                          </p>
                        </div>
                      ) : (
                        <div>
                          <input
                            className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                            id="drive_url"
                            name="drive_url"
                            placeholder="https://drive.google.com/file/d/..."
                            type="url"
                            defaultValue={editing?.source === "drive" ? editing.file_url : ""}
                          />
                          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                            Make sure sharing is set to &quot;Anyone with the link.&quot;
                          </p>
                        </div>
                      )}
                    </div>

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
