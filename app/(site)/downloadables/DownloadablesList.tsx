"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Downloadable } from "@/types";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatSize(bytes: number | null) {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function iconFor(item: Downloadable) {
  if (item.source === "drive") {
    return { icon: "cloud", bg: "bg-tertiary-container", fg: "text-tertiary" };
  }
  const ext = item.file_url.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return { icon: "picture_as_pdf", bg: "bg-error-container", fg: "text-error" };
  if (["xlsx", "xls", "csv"].includes(ext))
    return { icon: "table", bg: "bg-secondary-container", fg: "text-on-secondary-container" };
  return { icon: "description", bg: "bg-tertiary-container", fg: "text-tertiary" };
}

/**
 * Shows a first-page preview for Drive-backed items (Google renders
 * an actual thumbnail for PDFs/docs/images). Falls back to the plain
 * icon tile if there's no preview, or if the preview fails to load.
 * Clicking it opens a bigger version via onOpen.
 */
function DownloadableThumbnail({
  item,
  onOpen,
}: {
  item: Downloadable;
  onOpen: (item: Downloadable) => void;
}) {
  const { icon, bg, fg } = iconFor(item);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (item.source !== "drive" || failed) {
    return (
      <div className={`${bg} ${fg} rounded p-3 flex-shrink-0`}>
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-surface-container-low border border-outline-variant cursor-zoom-in"
      title="Preview"
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-surface-container-highest" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/downloads/${item.id}/thumbnail?w=200`}
        alt=""
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
      {item.file_ext && (
        <span className="absolute bottom-0.5 right-0.5 px-1 py-px rounded-sm bg-black/70 text-white text-[9px] font-bold leading-tight tracking-wide">
          {item.file_ext.toUpperCase()}
        </span>
      )}
    </button>
  );
}

/**
 * Full-size preview overlay. Google's thumbnail endpoint can render
 * larger sizes on request, so we just ask for a bigger width here
 * rather than upscaling the small card image.
 */
function ThumbnailLightbox({
  item,
  onClose,
}: {
  item: Downloadable;
  onClose: () => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/70 backdrop-blur-sm p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
          <h3 className="font-label-lg text-label-lg text-on-surface truncate pr-4">
            {item.title}
          </h3>
          <button
            className="text-on-surface-variant hover:text-error p-1 rounded-DEFAULT hover:bg-error/10 transition-colors flex-shrink-0"
            onClick={onClose}
            type="button"
          >
            <span className="sr-only">Close</span>
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>
        <div className="bg-surface-container-low flex items-center justify-center max-h-[70vh] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/downloads/${item.id}/thumbnail?w=1000`}
            alt=""
            className="max-w-full max-h-[70vh] object-contain"
          />
        </div>
        <div className="flex justify-end px-4 py-3 border-t border-outline-variant">
          <a
            href={`/api/downloads/${item.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container text-white font-label-md text-label-md rounded-DEFAULT hover:bg-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default function DownloadablesList({ items }: { items: Downloadable[] }) {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get("highlight");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All Documents");
  const [previewItem, setPreviewItem] = useState<Downloadable | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean) as string[]);
    return ["All Documents", ...Array.from(set)];
  }, [items]);

  // A search-result deep link arrived (?highlight=<id>) — clear any
  // active filters so the target item is guaranteed to be visible,
  // regardless of what category/search it was left in previously.
  useEffect(() => {
    if (highlightId) {
      setActiveCategory("All Documents");
      setSearch("");
    }
  }, [highlightId]);

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlightId, items]);

  const visible = useMemo(() => {
    return items.filter((i) => {
      const matchesCategory =
        activeCategory === "All Documents" || i.category === activeCategory;
      const matchesSearch =
        !search.trim() || i.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, activeCategory, search]);

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sticky top-28">
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6 border-b border-outline-variant pb-2">
            Categories
          </h2>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full text-left font-label-md text-label-md rounded px-4 py-2 transition-colors ${
                    activeCategory === cat
                      ? "text-primary bg-primary-fixed font-bold"
                      : "text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex-grow">
        <div className="mb-6 flex justify-between items-center bg-surface-container-lowest p-4 border border-outline-variant rounded-lg">
          <div className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary/10 font-body-md text-body-md bg-transparent"
              placeholder="Search documents..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visible.length === 0 && (
            <p className="col-span-full text-center font-body-md text-body-md text-on-surface-variant py-12">
              No documents found.
            </p>
          )}

          {visible.map((item) => {
            const size = formatSize(item.file_size_bytes);
            const isHighlighted = item.id === highlightId;
            return (
              <div
                key={item.id}
                ref={isHighlighted ? highlightRef : undefined}
                id={`downloadable-${item.id}`}
                className={`bg-surface-container-lowest border rounded-lg p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group ${
                  isHighlighted
                    ? "border-primary ring-2 ring-primary/40"
                    : "border-outline-variant"
                }`}
              >
                <DownloadableThumbnail item={item} onOpen={setPreviewItem} />
                <div className="flex-grow min-w-0">
                  <h3 className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary transition-colors text-xl">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
                    {item.category && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">folder</span>
                        {item.category}
                      </span>
                    )}
                    {item.description && <span>{item.description}</span>}
                  </div>
                  <div className="flex gap-4 mt-3 text-on-surface-variant font-label-sm text-label-sm opacity-80">
                    <span>{item.source === "drive" ? "Google Drive" : "File"}</span>
                    {size && (
                      <>
                        <span>•</span>
                        <span>{size}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Updated: {formatDate(item.updated_at)}</span>
                  </div>
                </div>
                <a
                  href={`/api/downloads/${item.id}`}
                  className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-4 py-2 rounded shrink-0 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    download
                  </span>
                  <span className="hidden sm:inline">Download</span>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {previewItem && (
        <ThumbnailLightbox item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </div>
  );
}
