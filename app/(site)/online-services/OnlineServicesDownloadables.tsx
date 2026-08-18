"use client";

import { useEffect, useState } from "react";
import type { Downloadable } from "@/types";
import { extractDriveFileId } from "@/lib/thumbnail/drive";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatSize(bytes: number | null) {
  if (!bytes) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function iconFor(item: Downloadable) {
  if (item.source === "drive") return "cloud";
  const ext = item.file_url.split(".").pop()?.toLowerCase() ?? "";
  if (["xlsx", "xls", "csv"].includes(ext)) return "grid_on";
  if (ext === "pdf") return "description";
  return "article";
}

/**
 * Left-hand tile: a real first-page preview for Drive-backed items
 * (Google renders an actual thumbnail for PDFs/docs/images), falling
 * back to the plain cloud/file icon if there's no preview or it
 * fails to load.
 */
function DownloadableIcon({ item }: { item: Downloadable }) {
  const icon = iconFor(item);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (item.source !== "drive" || failed) {
    return (
      <span className="material-symbols-outlined text-secondary-container bg-secondary/10 p-2 rounded-DEFAULT fill shrink-0">
        {icon}
      </span>
    );
  }

  return (
    <span className="relative w-10 h-10 rounded-DEFAULT overflow-hidden shrink-0 bg-secondary/10 border border-outline-variant/50">
      {!loaded && (
        <span className="absolute inset-0 animate-pulse bg-surface-container-highest block" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/api/downloads/${item.id}/thumbnail?w=100`}
        alt=""
        className={`w-full h-full object-cover transition-opacity duration-200 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

/**
 * Full-document preview overlay shown when a card is clicked.
 *
 * For Drive-backed files this embeds Google's own document viewer
 * (the same one Drive uses for "Preview"), which renders and lets you
 * scroll through every page — not just a static first-page image.
 * Falls back to the single-page thumbnail if the file isn't a Drive
 * item or its ID can't be parsed out of the stored link.
 */
function PreviewLightbox({
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

  const fileId = item.source === "drive" ? extractDriveFileId(item.file_url) : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-inverse-surface/70 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant shrink-0">
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
        <div className="bg-surface-container-low flex-grow overflow-hidden">
          {fileId ? (
            <iframe
              src={`https://drive.google.com/file/d/${fileId}/preview`}
              className="w-full h-full border-0"
              allow="autoplay"
              title={item.title}
            />
          ) : (
            <div className="w-full h-full overflow-y-auto flex items-start justify-center py-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/downloads/${item.id}/thumbnail?w=1000`}
                alt=""
                className="max-w-full object-contain"
              />
            </div>
          )}
        </div>
        <div className="flex justify-end px-4 py-3 border-t border-outline-variant shrink-0">
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

export default function OnlineServicesDownloadables({
  items,
}: {
  items: Downloadable[];
}) {
  const [previewItem, setPreviewItem] = useState<Downloadable | null>(null);

  return (
    <>
      {items.map((item) => {
        const size = formatSize(item.file_size_bytes);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setPreviewItem(item)}
            className="w-full flex items-center justify-between p-4 bg-surface-container rounded-lg border border-outline-variant/50 hover:border-primary transition-colors cursor-pointer group text-left"
          >
            <div className="flex items-center gap-4 min-w-0">
              <DownloadableIcon item={item} />
              <div className="min-w-0">
                <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors truncate">
                  {item.title}
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface-variant">
                  {item.source === "drive" ? "Google Drive" : "File"}
                  {size ? ` • ${size}` : ""} • Updated {formatDate(item.updated_at)}
                </p>
              </div>
            </div>
            <a
              href={`/api/downloads/${item.id}`}
              onClick={(e) => e.stopPropagation()}
              title="Download"
              className="text-primary hover:bg-primary/10 p-2 rounded-full transition-colors shrink-0"
            >
              <span className="material-symbols-outlined">download</span>
            </a>
          </button>
        );
      })}

      {previewItem && (
        <PreviewLightbox item={previewItem} onClose={() => setPreviewItem(null)} />
      )}
    </>
  );
}
