"use client";

import { createContext, useContext } from "react";
import type { PageContentBlockType, PageContentMap } from "@/types";

export type SelectedBlock = {
  id: string;
  type: PageContentBlockType;
  label: string;
  currentValue: string | null;
  defaultValue: string;
};

type PageContentContextValue = {
  /** Saved values from the DB, keyed by block_key. Empty on pages with no overrides yet. */
  content: PageContentMap;
  /** When true, Editable* components render click affordances instead of plain output. */
  editable: boolean;
  /** Admin-only: opens the side panel for a given block. */
  onSelectBlock?: (block: SelectedBlock) => void;
  /** Admin-only: block_key of whatever is currently open in the side panel, for highlighting. */
  activeBlockId?: string | null;
};

const PageContentContext = createContext<PageContentContextValue>({
  content: {},
  editable: false,
});

export function PageContentProvider({
  content,
  editable = false,
  onSelectBlock,
  activeBlockId,
  children,
}: PageContentContextValue & { children: React.ReactNode }) {
  return (
    <PageContentContext.Provider value={{ content, editable, onSelectBlock, activeBlockId }}>
      {children}
    </PageContentContext.Provider>
  );
}

export function usePageContent() {
  return useContext(PageContentContext);
}
