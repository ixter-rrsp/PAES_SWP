"use client";

import ImageFrame from "@/components/ui/image-frame";
import { usePageContent } from "./page-content-context";

type EditableImageProps = {
  id: string;
  label?: string;
  ratio?: "landscape" | "portrait" | "square" | "wide";
  /** Placeholder caption shown until an admin uploads a real image. */
  placeholderLabel?: string;
  className?: string;
};

export default function EditableImage({
  id,
  label,
  ratio = "landscape",
  placeholderLabel,
  className,
}: EditableImageProps) {
  const { content, editable, onSelectBlock, activeBlockId } = usePageContent();
  const src = content[id] ?? undefined;

  if (!editable) {
    return (
      <ImageFrame src={src} alt={label ?? ""} ratio={ratio} label={placeholderLabel} className={className} />
    );
  }

  const isActive = activeBlockId === id;

  return (
    <div
      className={`relative cursor-pointer rounded-xl outline-2 outline-offset-2 outline-dashed transition-colors ${
        isActive ? "outline-primary" : "outline-transparent hover:outline-primary/50"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        onSelectBlock?.({
          id,
          type: "image",
          label: label ?? id,
          currentValue: content[id] ?? null,
          defaultValue: "",
        });
      }}
    >
      <ImageFrame src={src} alt={label ?? ""} ratio={ratio} label={placeholderLabel} className={className} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 opacity-0 hover:bg-black/30 hover:opacity-100 transition-opacity">
        <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 font-label-sm text-label-sm text-on-surface shadow">
          <span className="material-symbols-outlined text-[16px]">add_photo_alternate</span>
          Change image
        </span>
      </div>
    </div>
  );
}
