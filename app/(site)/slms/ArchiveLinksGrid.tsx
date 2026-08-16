"use client";

import type { ArchiveLink } from "@/types";

const FOLDER_ICONS = ["folder_open", "folder"];

export default function ArchiveLinksGrid({ items }: { items: ArchiveLink[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant font-body-lg text-body-lg">
        No modules have been published yet. Check back soon.
      </div>
    );
  }

  // Group by category, preserving the order the server already sorted
  // them in (category, then label alphabetically).
  const groups = new Map<string, ArchiveLink[]>();
  for (const item of items) {
    const key = item.category?.trim() || "Other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <div className="flex flex-col gap-10">
      {Array.from(groups.entries()).map(([category, links]) => (
        <div key={category}>
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {links.map((item, i) => (
              <a
                key={item.id}
                className="group block relative"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-container to-primary rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500" />
                <div className="relative bg-surface-container-lowest border border-outline-variant rounded-xl p-6 h-full flex flex-col hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-surface-container-low rounded-lg text-primary">
                      <span
                        className="material-symbols-outlined text-4xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {FOLDER_ICONS[i % FOLDER_ICONS.length]}
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-label-sm font-label-sm">
                      <span className="w-2 h-2 rounded-full bg-secondary" />
                      Available
                    </span>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-headline-md font-headline-md text-on-surface mb-2">
                      {item.label}
                    </h3>
                    <p className="text-body-md font-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">link</span>
                      Google Drive Link
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
