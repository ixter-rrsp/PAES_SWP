"use client";

import { useMemo, useState, useTransition } from "react";
import type { ArchiveLink } from "@/types";
import {
  createArchiveLink,
  deleteArchiveLink,
  setArchiveLinkStatus,
  updateArchiveLink,
} from "./actions";

type StatusFilter = "all" | "published" | "draft";

const SUGGESTED_CATEGORIES = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ArchiveLinksClient({
  initialLinks,
}: {
  initialLinks: ArchiveLink[];
}) {
  const [items, setItems] = useState(initialLinks);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<ArchiveLink | null>(null);
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
    setFormError(null);
    setPanelOpen(true);
  }

  function openEditPanel(item: ArchiveLink) {
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
        ? await updateArchiveLink(editing.id, formData)
        : await createArchiveLink(formData);

      if (result.error) {
        setFormError(result.error);
        return;
      }

      window.location.reload();
    });
  }

  function handleToggleStatus(item: ArchiveLink) {
    const nextStatus = item.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const result = await setArchiveLinkStatus(item.id, nextStatus);
      if (result.error) {
        alert(result.error);
        return;
      }
      setItems((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, status: nextStatus } : d))
      );
    });
  }

  function handleDelete(item: ArchiveLink) {
    if (!confirm(`Delete "${item.label}"? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteArchiveLink(item.id);
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
              Archive Links
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Manage the Google Drive folders that power the public SLMs page.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container text-white font-label-lg text-label-lg rounded-DEFAULT hover:bg-primary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container whitespace-nowrap"
            onClick={openCreatePanel}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            New Link
          </button>
        </div>

        <div className="bg-white rounded-DEFAULT border border-outline-variant overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-outline-variant bg-surface-muted flex gap-2">
            {(["all", "published", "draft"] as StatusFilter[]).map((key) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md capitalize transition-colors ${
                  filter === key
                    ? "bg-primary-container text-white"
                    : "bg-transparent text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {key} ({counts[key]})
              </button>
            ))}
          </div>

          <div className="overflow-auto flex-1 no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-high sticky top-0 z-10 border-b border-outline-variant">
                <tr>
                  <th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold w-1/3">
                    Label
                  </th>
                  <th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold">
                    Category
                  </th>
                  <th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold">
                    Updated
                  </th>
                  <th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold text-center">
                    Status
                  </th>
                  <th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/50">
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-on-surface-variant font-body-md text-body-md">
                      No archive links yet.
                    </td>
                  </tr>
                )}
                {visible.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                    onClick={() => openEditPanel(item)}
                  >
                    <td className="py-density-md px-4 font-body-md text-body-md text-on-surface">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary text-[20px]">folder</span>
                        {item.label}
                      </div>
                    </td>
                    <td className="py-density-md px-4 font-body-md text-body-md text-on-surface-variant">
                      {item.category || "—"}
                    </td>
                    <td className="py-density-md px-4 font-body-md text-body-md text-on-surface-variant">
                      {formatDate(item.updated_at)}
                    </td>
                    <td className="py-density-md px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        disabled={isPending}
                        onClick={() => handleToggleStatus(item)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-label-sm transition-colors ${
                          item.status === "published"
                            ? "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/70"
                            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.status === "published" ? "bg-secondary" : "bg-on-surface-variant"}`} />
                        {item.status === "published" ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="py-density-md px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                          title="Open in Drive"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        </a>
                        <button
                          onClick={() => openEditPanel(item)}
                          className="p-1.5 rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-DEFAULT text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-inverse-surface/40" onClick={closePanel}>
          <div
            className="w-full max-w-md h-full bg-white shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {editing ? "Edit Link" : "New Archive Link"}
              </h3>
              <button
                onClick={closePanel}
                className="p-1.5 rounded-DEFAULT text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            <form action={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
              {formError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-DEFAULT bg-error/10 text-error text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {formError}
                </div>
              )}

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="label">
                  Label
                </label>
                <input
                  className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                  id="label"
                  name="label"
                  placeholder="Grade 3"
                  defaultValue={editing?.label ?? ""}
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
                  list="category-suggestions"
                  placeholder="Grade 3"
                  defaultValue={editing?.category ?? ""}
                />
                <datalist id="category-suggestions">
                  {SUGGESTED_CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Used to group cards on the public SLMs page.
                </p>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="url">
                  Google Drive Link
                </label>
                <input
                  className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
                  id="url"
                  name="url"
                  type="url"
                  placeholder="https://drive.google.com/drive/folders/..."
                  defaultValue={editing?.url ?? ""}
                  required
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Folder or file — make sure sharing is set to &quot;Anyone with
                  the link.&quot; This opens directly in a new tab on the public
                  site (folders can&apos;t be proxied as a single download).
                </p>
              </div>

              {!editing && (
                <label className="flex items-center gap-2 font-body-md text-body-md text-on-surface">
                  <input type="checkbox" name="publish_now" className="rounded border-outline-variant" />
                  Publish immediately
                </label>
              )}

              <div className="mt-auto pt-4 border-t border-outline-variant flex gap-3">
                <button
                  type="button"
                  onClick={closePanel}
                  className="flex-1 px-4 py-2 rounded-DEFAULT border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 rounded-DEFAULT bg-primary-container text-white font-label-md text-label-md hover:bg-primary transition-colors disabled:opacity-60"
                >
                  {isPending ? "Saving..." : editing ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
