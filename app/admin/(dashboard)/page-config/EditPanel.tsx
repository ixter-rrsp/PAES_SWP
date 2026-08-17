"use client";

import { useRef, useState, useTransition } from "react";
import type { SelectedBlock } from "@/components/site/page-content-context";
import { uploadImage } from "@/lib/storage/upload-image";
import { resetPageContentBlock, savePageContentBlock } from "./actions";

export default function EditPanel({
  pageSlug,
  block,
  onClose,
  onSaved,
}: {
  pageSlug: string;
  block: SelectedBlock;
  onClose: () => void;
  onSaved: (blockKey: string, value: string | null) => void;
}) {
  const [value, setValue] = useState(block.currentValue ?? block.defaultValue);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    setError(null);
    setIsUploading(true);
    uploadImage(file, `page-config/${pageSlug}`).then((result) => {
      setIsUploading(false);
      if (result.error) {
        setError(result.error);
        return;
      }
      setValue(result.url ?? "");
    });
  }

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const result = await savePageContentBlock(pageSlug, block.id, block.type, value);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSaved(block.id, value);
    });
  }

  function handleResetToDefault() {
    setError(null);
    startTransition(async () => {
      const result = await resetPageContentBlock(pageSlug, block.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      onSaved(block.id, null);
      setValue(block.defaultValue);
    });
  }

  const isOverridden = block.currentValue !== null;

  return (
    <div className="fixed right-0 top-0 h-full w-[380px] bg-surface-container-lowest border-l border-outline-variant shadow-lg z-50 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant">
        <div>
          <p className="font-label-md text-label-md text-on-surface-variant">Editing</p>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{block.label}</h3>
        </div>
        <button onClick={onClose} className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
        {block.type === "image" ? (
          <>
            <label className="font-label-md text-label-md text-on-surface-variant">Image</label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-outline-variant rounded-lg py-6 text-on-surface-variant hover:border-primary-container hover:text-primary transition-colors disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[20px]">
                {isUploading ? "progress_activity" : "upload"}
              </span>
              <span className="font-label-md text-label-md">
                {isUploading ? "Uploading..." : "Upload image"}
              </span>
            </button>

            <div className="flex items-center gap-2 text-on-surface-variant">
              <div className="h-px flex-1 bg-outline-variant" />
              <span className="font-label-sm text-label-sm">or paste a URL</span>
              <div className="h-px flex-1 bg-outline-variant" />
            </div>

            <input
              type="url"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://..."
              className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
            />
            {value && (
              <div className="rounded-lg overflow-hidden border border-outline-variant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value} alt="" className="w-full h-auto object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </>
        ) : block.type === "richtext" ? (
          <>
            <label className="font-label-md text-label-md text-on-surface-variant">Text</label>
            <textarea
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={8}
              className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md resize-y focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
            />
          </>
        ) : (
          <>
            <label className="font-label-md text-label-md text-on-surface-variant">Text</label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full border border-outline-variant rounded px-3 py-2 font-body-md text-body-md focus:ring-1 focus:ring-primary-container focus:border-primary-container outline-none"
            />
          </>
        )}

        {error && <p className="font-body-sm text-body-sm text-error">{error}</p>}
      </div>

      <div className="p-5 border-t border-outline-variant flex flex-col gap-2">
        <button
          onClick={handleSave}
          disabled={isPending}
          className="font-label-lg text-label-lg text-white bg-primary-container px-4 py-2.5 rounded shadow-sm hover:bg-primary transition-colors disabled:opacity-60"
        >
          {isPending ? "Saving..." : "Save & publish"}
        </button>
        {isOverridden && (
          <button
            onClick={handleResetToDefault}
            disabled={isPending}
            className="font-label-lg text-label-lg text-on-surface-variant px-4 py-2.5 rounded border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-60"
          >
            Reset to default
          </button>
        )}
      </div>
    </div>
  );
}
