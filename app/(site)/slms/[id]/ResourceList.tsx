"use client";

import { useEffect, useState } from "react";

type DriveFileMeta = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  size: string | null;
};

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; files: DriveFileMeta[] };

function iconFor(mimeType: string): string {
  if (mimeType === "application/pdf") return "picture_as_pdf";
  if (mimeType.startsWith("video/")) return "movie";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) return "table_chart";
  if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "slideshow";
  if (mimeType.includes("document") || mimeType.includes("word")) return "description";
  return "draft";
}

function formatSize(size: string | null) {
  if (!size) return null;
  const bytes = Number(size);
  if (!Number.isFinite(bytes) || bytes === 0) return null;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResourceList({ collectionId }: { collectionId: string }) {
  const [state, setState] = useState<FetchState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/resource-collections/${collectionId}`);
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) {
          setState({ status: "error", message: data.error ?? "Couldn't load resources." });
          return;
        }
        setState({ status: "ok", files: data.files });
      } catch {
        if (!cancelled) {
          setState({ status: "error", message: "Couldn't load resources." });
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [collectionId]);

  if (state.status === "loading") {
    return (
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 rounded-xl bg-surface-container-low animate-pulse" />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="flex items-start gap-3 px-4 py-3 border border-error/30 bg-error/5 rounded-xl text-error font-body-md text-body-md">
        <span className="material-symbols-outlined text-[20px]">error</span>
        {state.message}
      </div>
    );
  }

  if (state.files.length === 0) {
    return (
      <div className="text-center py-16 text-on-surface-variant font-body-lg text-body-lg">
        No learning resources are currently available in this collection.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {state.files.map((file) => {
        const isVideo = file.mimeType.startsWith("video/");
        const size = formatSize(file.size);
        return (
          <a
            key={file.id}
            href={`/api/resource-collections/${collectionId}/files/${file.id}`}
            target={isVideo ? "_blank" : undefined}
            rel={isVideo ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 px-5 py-4 bg-surface-container-lowest border border-outline-variant rounded-xl hover:shadow-md hover:border-primary/40 transition-all duration-200"
          >
            <div className="p-2.5 bg-surface-container-low rounded-lg text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-2xl">{iconFor(file.mimeType)}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-label-lg text-label-lg text-on-surface truncate">{file.name}</p>
              {size && (
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{size}</p>
              )}
            </div>
            <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0">
              {isVideo ? "play_circle" : "download"}
            </span>
          </a>
        );
      })}
    </div>
  );
}
