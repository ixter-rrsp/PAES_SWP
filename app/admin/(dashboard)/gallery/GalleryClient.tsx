"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import type { Gallery } from "@/types";
import { createGallery, deleteGallery, setGalleryStatus } from "./actions";

export default function GalleryClient({ initialGalleries }: { initialGalleries: Gallery[] }) {
  const router = useRouter();
  const [galleries, setGalleries] = useState(initialGalleries);
  const [panelOpen, setPanelOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(formData: FormData) {
    setFormError(null);
    startTransition(async () => {
      const result = await createGallery(formData);
      if (result.error) {
        setFormError(result.error);
        return;
      }
      router.push(`/admin/gallery/${result.id}`);
    });
  }

  function handleDelete(item: Gallery) {
    if (!confirm(`Delete "${item.title}"? This removes its layout and frames. This can't be undone.`))
      return;
    startTransition(async () => {
      const result = await deleteGallery(item.id);
      if (result.error) {
        alert(result.error);
        return;
      }
      setGalleries((prev) => prev.filter((g) => g.id !== item.id));
    });
  }

  function handleToggleStatus(item: Gallery) {
    const nextStatus = item.status === "published" ? "draft" : "published";
    startTransition(async () => {
      const result = await setGalleryStatus(item.id, nextStatus);
      if (result.error) {
        alert(result.error);
        return;
      }
      setGalleries((prev) =>
        prev.map((g) => (g.id === item.id ? { ...g, status: nextStatus } : g))
      );
    });
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Gallery</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Build modular image grid layouts for the site.
          </p>
        </div>
        <button
          onClick={() => {
            setFormError(null);
            setPanelOpen(true);
          }}
          className="px-4 py-2 bg-primary-container text-white rounded-DEFAULT font-label-lg text-label-lg hover:bg-primary transition-colors flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">grid_view</span>
          New Gallery
        </button>
      </div>

      {galleries.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl py-16 text-center text-on-surface-variant font-body-md text-body-md">
          No galleries yet. Create one to start building a layout.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {galleries.map((item) => (
            <Link
              key={item.id}
              href={`/admin/gallery/${item.id}`}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg flex flex-col gap-3 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow group relative"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-label-lg text-label-lg text-on-surface leading-tight truncate">
                  {item.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(item);
                  }}
                  disabled={isPending}
                  className="text-on-surface-variant hover:text-error hover:bg-error-container rounded-full p-1 transition-colors shrink-0"
                  title="Delete"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
              <span className="inline-flex w-fit items-center px-2 py-1 rounded-DEFAULT bg-surface-container-high text-on-surface font-label-md text-label-md text-[11px]">
                {item.rows} rows &times; {item.columns} columns
              </span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Updated {new Date(item.updated_at).toLocaleDateString()}
              </p>
              <div className="pt-3 border-t border-surface-variant flex items-center justify-between">
                <span className="font-label-md text-label-md text-on-surface-variant">Public Gallery</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleToggleStatus(item);
                  }}
                  disabled={isPending}
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
            </Link>
          ))}
        </div>
      )}

      {panelOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4"
          onClick={() => setPanelOpen(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">New Gallery</h3>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form action={handleCreate} className="p-6 flex flex-col gap-5">
              {formError && (
                <div className="flex items-start gap-2 px-3 py-2.5 rounded-DEFAULT bg-error/10 text-error text-body-sm font-body-sm">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-label-md text-on-surface" htmlFor="title">
                  Gallery Name
                </label>
                <input
                  className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  id="title"
                  name="title"
                  placeholder="e.g. Campus Life"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="rows">
                    Rows
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    id="rows"
                    name="rows"
                    type="number"
                    min={1}
                    max={40}
                    defaultValue={4}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5 flex-1">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="columns">
                    Columns
                  </label>
                  <input
                    className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    id="columns"
                    name="columns"
                    type="number"
                    min={1}
                    max={40}
                    defaultValue={8}
                    required
                  />
                </div>
              </div>

              <div className="mt-2 pt-4 border-t border-surface-variant flex gap-3">
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="flex-1 px-4 py-2 bg-transparent text-on-surface-variant border border-outline-variant rounded-DEFAULT font-label-lg text-label-lg hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 px-4 py-2 bg-primary-container text-white rounded-DEFAULT font-label-lg text-label-lg hover:bg-primary transition-colors disabled:opacity-60 shadow-sm"
                >
                  {isPending ? "Creating..." : "Create Gallery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
