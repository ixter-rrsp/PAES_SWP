"use client";

import { useMemo, useState, useTransition } from "react";
import type { StaffMember } from "@/types";
import {
  createStaffMember,
  deleteStaffMember,
  setStaffStatus,
  updateStaffMember,
} from "./actions";

type StatusFilter = "all" | "published" | "draft";

const SUGGESTED_DEPARTMENTS = [
  "Administration",
  "Academic Staff",
  "Student Services",
  "Operations & Facilities",
];

function initialsFor(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function StaffClient({ initialStaff }: { initialStaff: StaffMember[] }) {
  const [items, setItems] = useState(initialStaff);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [editing, setEditing] = useState<StaffMember | null>(null);
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

  function openEditPanel(item: StaffMember) {
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
        ? await updateStaffMember(editing.id, formData)
        : await createStaffMember(formData);

      if (result.error) {
        setFormError(result.error);
        return;
      }

      window.location.reload();
    });
  }

  function handleToggleStatus(item: StaffMember) {
    const nextStatus = item.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const result = await setStaffStatus(item.id, nextStatus);
      if (result.error) {
        alert(result.error);
        return;
      }
      setItems((prev) =>
        prev.map((d) => (d.id === item.id ? { ...d, status: nextStatus } : d))
      );
    });
  }

  function handleDelete(item: StaffMember) {
    if (!confirm(`Remove "${item.full_name}" from the staff directory? This can't be undone.`)) return;
    startTransition(async () => {
      const result = await deleteStaffMember(item.id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setItems((prev) => prev.filter((d) => d.id !== item.id));
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Staff Directory</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage staff profiles, roles, and public visibility.
          </p>
        </div>
        <button
          onClick={openCreatePanel}
          className="px-4 py-2 bg-primary-container text-white rounded-DEFAULT font-label-lg text-label-lg hover:bg-primary transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Staff
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {(["all", "published", "draft"] as StatusFilter[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1.5 rounded-DEFAULT font-label-md text-label-md capitalize transition-colors ${
              filter === key
                ? "bg-primary-container text-white"
                : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {key} ({counts[key]})
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl py-16 text-center text-on-surface-variant font-body-md text-body-md">
          No staff members {filter !== "all" ? `in "${filter}"` : "yet"}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
          {visible.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg flex flex-col gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow group relative"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  {item.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={item.full_name}
                      className="w-12 h-12 rounded-full object-cover border border-surface-variant shrink-0"
                      src={item.photo_url}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-tertiary-fixed-dim flex items-center justify-center text-tertiary shrink-0 font-headline-sm">
                      {initialsFor(item.full_name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-label-lg text-label-lg text-on-surface leading-tight truncate">
                      {item.full_name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{item.role}</p>
                  </div>
                </div>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => openEditPanel(item)}
                    className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1 transition-colors"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                  </button>
                  <button
                    disabled={isPending}
                    onClick={() => handleDelete(item)}
                    className="text-on-surface-variant hover:text-error hover:bg-error-container rounded-full p-1 transition-colors"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="flex-grow">
                <span className="inline-flex items-center px-2 py-1 rounded-DEFAULT bg-surface-container-high text-on-surface font-label-md text-label-md text-[11px]">
                  {item.department || "Unassigned"}
                </span>
              </div>

              <div className="pt-3 border-t border-surface-variant flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Public Directory</span>
                <button
                  disabled={isPending}
                  onClick={() => handleToggleStatus(item)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-label-sm font-label-sm transition-colors ${
                    item.status === "published"
                      ? "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/70"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      item.status === "published" ? "bg-secondary" : "bg-on-surface-variant"
                    }`}
                  />
                  {item.status === "published" ? "Visible" : "Hidden"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {panelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4" onClick={closePanel}>
          <div
            className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                {editing ? "Edit Staff Member" : "Add New Staff Member"}
              </h3>
              <button
                onClick={closePanel}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form action={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-5">
              {formError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-DEFAULT bg-error/10 text-error text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="full_name"
                  name="full_name"
                  placeholder="e.g. Jane Doe"
                  defaultValue={editing?.full_name ?? ""}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="role">
                  Role / Title
                </label>
                <input
                  className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="role"
                  name="role"
                  placeholder="e.g. Science Teacher"
                  defaultValue={editing?.role ?? ""}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="department">
                  Department
                </label>
                <input
                  className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="department"
                  name="department"
                  list="department-suggestions"
                  placeholder="e.g. Academic Staff"
                  defaultValue={editing?.department ?? ""}
                />
                <datalist id="department-suggestions">
                  {SUGGESTED_DEPARTMENTS.map((d) => (
                    <option key={d} value={d} />
                  ))}
                </datalist>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Used to group staff on the public directory page.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="photo_url">
                  Photo URL
                </label>
                <input
                  className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="photo_url"
                  name="photo_url"
                  type="url"
                  placeholder="https://..."
                  defaultValue={editing?.photo_url ?? ""}
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Optional — leave blank to show initials instead.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="email">
                  Email
                </label>
                <input
                  className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Optional"
                  defaultValue={editing?.email ?? ""}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="display_order">
                  Sort Order
                </label>
                <input
                  className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="display_order"
                  name="display_order"
                  type="number"
                  placeholder="0"
                  defaultValue={editing?.display_order ?? 0}
                />
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Lower numbers appear first within a department.
                </p>
              </div>

              {!editing && (
                <label className="flex items-center gap-2 font-body-md text-body-md text-on-surface">
                  <input type="checkbox" name="publish_now" className="rounded border-outline-variant" />
                  Show in public directory immediately
                </label>
              )}

              <div className="mt-2 pt-4 border-t border-surface-variant flex gap-3">
                <button
                  type="button"
                  onClick={closePanel}
                  className="flex-1 px-4 py-2 bg-transparent text-on-surface-variant border border-outline-variant rounded-DEFAULT font-label-lg text-label-lg hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-primary-container text-white rounded-DEFAULT font-label-lg text-label-lg hover:bg-primary transition-colors disabled:opacity-60 shadow-sm"
                >
                  {isPending ? "Saving..." : editing ? "Save Changes" : "Save Staff Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
