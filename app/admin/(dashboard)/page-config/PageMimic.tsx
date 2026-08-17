"use client";

import { useState } from "react";
import { PageContentProvider, type SelectedBlock } from "@/components/site/page-content-context";
import type { PageContentMap } from "@/types";
import EditPanel from "./EditPanel";

export default function PageMimic({
  pageSlug,
  initialContent,
  children,
}: {
  pageSlug: string;
  initialContent: PageContentMap;
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<PageContentMap>(initialContent);
  const [selected, setSelected] = useState<SelectedBlock | null>(null);

  function handleSaved(blockKey: string, value: string | null) {
    setContent((prev) => ({ ...prev, [blockKey]: value }));
    setSelected(null);
  }

  return (
    <PageContentProvider
      content={content}
      editable
      activeBlockId={selected?.id ?? null}
      onSelectBlock={(block) => setSelected(block)}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">ads_click</span>
          Click any highlighted text or image below to edit it. Changes go live immediately after saving.
        </p>
      </div>

      <div className="border border-outline-variant rounded-xl bg-surface-container-lowest overflow-hidden">
        <div className="bg-surface-container-low border-b border-outline-variant px-4 py-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
            <span className="w-2.5 h-2.5 rounded-full bg-outline-variant" />
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant ml-2">
            Public preview — /{pageSlug === "home" ? "" : pageSlug}
          </span>
        </div>
        <div className="max-h-[75vh] overflow-y-auto">
          <div className="origin-top" style={{ transform: "scale(0.85)", width: "117.6%" }}>
            {children}
          </div>
        </div>
      </div>

      {selected && (
        <EditPanel
          key={selected.id}
          pageSlug={pageSlug}
          block={selected}
          onClose={() => setSelected(null)}
          onSaved={handleSaved}
        />
      )}
    </PageContentProvider>
  );
}
