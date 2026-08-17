"use client";

import { usePageContent } from "./page-content-context";

type EditableTextProps = {
  /** Unique key within the page, e.g. "hero_title". */
  id: string;
  /** Human label shown in the admin edit panel, e.g. "Hero heading". */
  label?: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  type?: "text" | "richtext";
  /** The hardcoded copy — used as the fallback until an admin sets a value. */
  children: string;
};

export default function EditableText({
  id,
  label,
  as: Tag = "span",
  className,
  type = "text",
  children,
}: EditableTextProps) {
  const { content, editable, onSelectBlock, activeBlockId } = usePageContent();
  const value = content[id] ?? children;

  if (!editable) {
    return <Tag className={className}>{value}</Tag>;
  }

  const isActive = activeBlockId === id;

  return (
    <Tag
      className={`${className ?? ""} group relative cursor-pointer rounded-sm outline-2 outline-offset-2 outline-dashed transition-colors ${
        isActive ? "outline-primary bg-primary-container/10" : "outline-transparent hover:outline-primary/50"
      }`}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelectBlock?.({
          id,
          type,
          label: label ?? id,
          currentValue: content[id] ?? null,
          defaultValue: children,
        });
      }}
    >
      {value}
      <span className="pointer-events-none absolute -top-2 -right-2 hidden h-5 w-5 items-center justify-center rounded-full bg-primary text-white group-hover:flex">
        <span className="material-symbols-outlined text-[13px]">edit</span>
      </span>
    </Tag>
  );
}
