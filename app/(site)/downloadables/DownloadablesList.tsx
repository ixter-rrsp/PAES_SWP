"use client";

import { useMemo, useState } from "react";
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

export default function DownloadablesList({ items }: { items: Downloadable[] }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All Documents");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category).filter(Boolean) as string[]);
    return ["All Documents", ...Array.from(set)];
  }, [items]);

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
            const { icon, bg, fg } = iconFor(item);
            const size = formatSize(item.file_size_bytes);
            return (
              <div
                key={item.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className={`${bg} ${fg} rounded p-3 flex-shrink-0`}>
                  <span className="material-symbols-outlined text-[32px]">{icon}</span>
                </div>
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
                  href={item.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-4 py-2 rounded shrink-0 transition-colors flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {item.source === "drive" ? "open_in_new" : "download"}
                  </span>
                  <span className="hidden sm:inline">
                    {item.source === "drive" ? "Open" : "Download"}
                  </span>
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
