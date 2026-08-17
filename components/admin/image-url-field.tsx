"use client";

import { useRef, useState } from "react";
import { uploadImage } from "@/lib/storage/upload-image";

/**
 * Image field for ordinary admin CRUD forms (announcements, events,
 * ...) that submit via FormData to a server action — not the
 * page-config block-editing flow (see EditPanel.tsx for that one,
 * which saves immediately instead of on form submit).
 *
 * Renders an upload button + "or paste a URL" input + preview, and
 * exposes the current value through a hidden <input name={name}> so
 * it participates in the surrounding <form action={...}> like any
 * other field.
 */
export default function ImageUrlField({
  name,
  label = "Image",
  defaultValue,
  folder,
  helpText,
}: {
  name: string;
  label?: string;
  defaultValue?: string | null;
  folder: string;
  helpText?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError(null);
    setIsUploading(true);
    uploadImage(file, folder).then((result) => {
      setIsUploading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      setValue(result.url ?? "");
    });
  }

  return (
    <div>
      <label className="block font-label-md text-label-md text-on-surface-variant mb-1">
        {label}
      </label>

      <input type="hidden" name={name} value={value} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-DEFAULT border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary-container hover:text-primary transition-colors disabled:opacity-60 text-body-sm font-body-sm"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isUploading ? "progress_activity" : "upload"}
          </span>
          {isUploading ? "Uploading..." : "Upload image"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="text-body-sm font-body-sm text-error hover:underline"
          >
            Remove
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 my-2 text-on-surface-variant">
        <div className="h-px flex-1 bg-outline-variant" />
        <span className="font-label-sm text-label-sm">or paste a URL</span>
        <div className="h-px flex-1 bg-outline-variant" />
      </div>

      <input
        type="url"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://..."
        className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright"
      />

      {value && (
        <div className="mt-2 rounded-lg overflow-hidden border border-outline-variant">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="w-full h-32 object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      )}

      {error && <p className="font-body-sm text-body-sm text-error mt-1">{error}</p>}
      {helpText && <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{helpText}</p>}
    </div>
  );
}
