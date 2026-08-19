"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { GalleryWithFrames } from "@/types";
import { uploadImage } from "@/lib/storage/upload-image";
import { saveGalleryFrames, updateGalleryMeta, type FrameInput } from "../actions";

type EditableFrame = FrameInput & { tempId: string };

function cellKey(row: number, col: number) {
  return `${row}-${col}`;
}

function frameCells(f: { row_start: number; column_start: number; row_span: number; column_span: number }) {
  const cells: string[] = [];
  for (let r = f.row_start; r < f.row_start + f.row_span; r++) {
    for (let c = f.column_start; c < f.column_start + f.column_span; c++) {
      cells.push(cellKey(r, c));
    }
  }
  return cells;
}

export default function GalleryEditorClient({ gallery }: { gallery: GalleryWithFrames }) {
  const [title, setTitle] = useState(gallery.title);
  const [rows, setRows] = useState(gallery.rows);
  const [columns, setColumns] = useState(gallery.columns);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [metaSaving, startMetaTransition] = useTransition();

  const [frames, setFrames] = useState<EditableFrame[]>(() =>
    gallery.frames.map((f, i) => ({
      tempId: f.id,
      row_start: f.row_start,
      column_start: f.column_start,
      row_span: f.row_span,
      column_span: f.column_span,
      image_url: f.image_url,
      sort_order: f.sort_order ?? i,
    }))
  );

  const [activeFrameId, setActiveFrameId] = useState<string | null>(null);
  const [anchor, setAnchor] = useState<{ row: number; col: number } | null>(null);
  const [cursor, setCursor] = useState<{ row: number; col: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isSaving, startSaveTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const occupied = useMemo(() => {
    const set = new Set<string>();
    for (const f of frames) {
      if (f.tempId === activeFrameId) continue; // let the active frame's own cells stay selectable-looking
      for (const key of frameCells(f)) set.add(key);
    }
    return set;
  }, [frames, activeFrameId]);

  const selectionRect = useMemo(() => {
    if (!anchor || !cursor) return null;
    const row_start = Math.min(anchor.row, cursor.row);
    const column_start = Math.min(anchor.col, cursor.col);
    const row_span = Math.abs(anchor.row - cursor.row) + 1;
    const column_span = Math.abs(anchor.col - cursor.col) + 1;
    return { row_start, column_start, row_span, column_span };
  }, [anchor, cursor]);

  const selectionCells = useMemo(() => {
    if (!selectionRect) return new Set<string>();
    return new Set(frameCells(selectionRect));
  }, [selectionRect]);

  const selectionValid = useMemo(() => {
    if (!selectionRect) return false;
    for (const key of selectionCells) {
      if (occupied.has(key)) return false;
    }
    return true;
  }, [selectionRect, selectionCells, occupied]);

  function frameAt(row: number, col: number): EditableFrame | null {
    const key = cellKey(row, col);
    return frames.find((f) => frameCells(f).includes(key)) ?? null;
  }

  function handleCellMouseDown(row: number, col: number) {
    const existing = frameAt(row, col);
    if (existing) {
      setActiveFrameId(existing.tempId);
      setAnchor(null);
      setCursor(null);
      return;
    }
    setActiveFrameId(null);
    setAnchor({ row, col });
    setCursor({ row, col });
    setIsDragging(true);
  }

  function handleCellMouseEnter(row: number, col: number) {
    if (!isDragging) return;
    setCursor({ row, col });
  }

  function handleMouseUp() {
    setIsDragging(false);
  }

  function clearSelection() {
    setAnchor(null);
    setCursor(null);
  }

  function handleMergeSelection() {
    if (!selectionRect || !selectionValid) return;
    const newFrame: EditableFrame = {
      tempId: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      row_start: selectionRect.row_start,
      column_start: selectionRect.column_start,
      row_span: selectionRect.row_span,
      column_span: selectionRect.column_span,
      image_url: null,
      sort_order: frames.length,
    };
    setFrames((prev) => [...prev, newFrame]);
    setActiveFrameId(newFrame.tempId);
    clearSelection();
  }

  // Let Enter merge the current selection, so the mouse never has to
  // leave the grid to reach for the toolbar button. Ignored while
  // focus is in a text field (e.g. the grid-size form) so Enter there
  // keeps its normal behavior instead of merging unrelated cells.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Enter") return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (!selectionRect || !selectionValid) return;
      e.preventDefault();
      handleMergeSelection();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectionRect, selectionValid]);

  function handleUnmergeActive() {
    if (!activeFrameId) return;
    setFrames((prev) => prev.filter((f) => f.tempId !== activeFrameId));
    setActiveFrameId(null);
  }

  function handleRemoveImage() {
    if (!activeFrameId) return;
    setFrames((prev) =>
      prev.map((f) => (f.tempId === activeFrameId ? { ...f, image_url: null } : f))
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !activeFrameId) return;

    setIsUploading(true);
    setSaveError(null);
    uploadImage(file, `gallery/${gallery.id}`).then((result) => {
      setIsUploading(false);
      if (result.error) {
        setSaveError(result.error);
        return;
      }
      setFrames((prev) =>
        prev.map((f) => (f.tempId === activeFrameId ? { ...f, image_url: result.url } : f))
      );
    });
  }

  function handleSaveMeta(formData: FormData) {
    setMetaError(null);
    startMetaTransition(async () => {
      const result = await updateGalleryMeta(gallery.id, formData);
      if (result.error) {
        setMetaError(result.error);
        return;
      }
      setTitle(String(formData.get("title") ?? title));
      setRows(Math.max(1, Number(formData.get("rows") ?? rows) || rows));
      setColumns(Math.max(1, Number(formData.get("columns") ?? columns) || columns));
    });
  }

  function handleSaveGallery() {
    setSaveError(null);
    setSaveMessage(null);
    startSaveTransition(async () => {
      const payload: FrameInput[] = frames.map((f, i) => ({
        row_start: f.row_start,
        column_start: f.column_start,
        row_span: f.row_span,
        column_span: f.column_span,
        image_url: f.image_url,
        sort_order: i,
      }));
      const result = await saveGalleryFrames(gallery.id, payload);
      if (result.error) {
        setSaveError(result.error);
        return;
      }
      setSaveMessage("Layout saved.");
      window.location.reload();
    });
  }

  const activeFrame = frames.find((f) => f.tempId === activeFrameId) ?? null;
  const gridCells = useMemo(() => {
    const cells: { row: number; col: number }[] = [];
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= columns; c++) {
        cells.push({ row: r, col: c });
      }
    }
    return cells;
  }, [rows, columns]);

  return (
    <div className="flex flex-col gap-6" onMouseUp={handleMouseUp} onMouseLeave={() => setIsDragging(false)}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/admin/gallery"
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors shrink-0"
            title="Back to Gallery"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <div className="min-w-0">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1 truncate">{title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Select adjacent cells and merge them into an image frame.
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveGallery}
          disabled={isSaving}
          className="px-4 py-2 bg-primary-container text-white rounded-DEFAULT font-label-lg text-label-lg hover:bg-primary transition-colors disabled:opacity-60 shadow-sm flex items-center gap-2 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          {isSaving ? "Saving..." : "Save Gallery"}
        </button>
      </div>

      {saveError && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-DEFAULT bg-error/10 text-error text-body-sm font-body-sm">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {saveError}
        </div>
      )}
      {saveMessage && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-DEFAULT bg-secondary-container text-on-secondary-container text-body-sm font-body-sm">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          {saveMessage}
        </div>
      )}

      {/* Grid size / name form */}
      <form
        action={handleSaveMeta}
        className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg flex flex-col sm:flex-row sm:items-end gap-4"
      >
        <div className="flex flex-col gap-1.5 flex-1 min-w-[160px]">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="title">
            Gallery Name
          </label>
          <input
            className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            id="title"
            name="title"
            defaultValue={title}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="rows">
            Rows
          </label>
          <input
            className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            id="rows"
            name="rows"
            type="number"
            min={1}
            max={40}
            defaultValue={rows}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5 w-24">
          <label className="font-label-md text-label-md text-on-surface" htmlFor="columns">
            Columns
          </label>
          <input
            className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            id="columns"
            name="columns"
            type="number"
            min={1}
            max={40}
            defaultValue={columns}
            required
          />
        </div>
        <button
          type="submit"
          disabled={metaSaving}
          className="px-4 py-2 bg-surface-container-high text-on-surface rounded-DEFAULT font-label-lg text-label-lg hover:bg-surface-container-highest transition-colors disabled:opacity-60"
        >
          {metaSaving ? "Applying..." : "Apply Grid Size"}
        </button>
      </form>
      {metaError && (
        <div className="flex items-start gap-2 px-3 py-2.5 rounded-DEFAULT bg-error/10 text-error text-body-sm font-body-sm -mt-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {metaError}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg">
        <button
          type="button"
          onClick={handleMergeSelection}
          disabled={!selectionRect || !selectionValid}
          className="px-3 py-2 bg-primary-container text-white rounded-DEFAULT font-label-md text-label-md hover:bg-primary transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">merge</span>
          Merge Selection
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!activeFrame || isUploading}
          className="px-3 py-2 bg-surface-container-high text-on-surface rounded-DEFAULT font-label-md text-label-md hover:bg-surface-container-highest transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isUploading ? "progress_activity" : "upload"}
          </span>
          {isUploading ? "Uploading..." : "Upload Image"}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <button
          type="button"
          onClick={handleRemoveImage}
          disabled={!activeFrame?.image_url}
          className="px-3 py-2 bg-surface-container-high text-on-surface rounded-DEFAULT font-label-md text-label-md hover:bg-surface-container-highest transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">image_not_supported</span>
          Remove Image
        </button>
        <button
          type="button"
          onClick={handleUnmergeActive}
          disabled={!activeFrame}
          className="px-3 py-2 bg-transparent text-error border border-error/30 rounded-DEFAULT font-label-md text-label-md hover:bg-error/10 transition-colors disabled:opacity-40 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
          Remove Frame
        </button>
        {(selectionRect || activeFrame) && (
          <button
            type="button"
            onClick={() => {
              clearSelection();
              setActiveFrameId(null);
            }}
            className="ml-auto text-on-surface-variant hover:text-on-surface font-label-md text-label-md"
          >
            Clear selection
          </button>
        )}
      </div>

      {/* Grid editor */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg overflow-x-auto select-none">
        <div
          className="relative grid gap-1 min-w-fit"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(48px, 1fr))`,
            gridTemplateRows: `repeat(${rows}, 48px)`,
          }}
        >
          {gridCells.map(({ row, col }) => {
            const key = cellKey(row, col);
            const isOccupied = occupied.has(key);
            const isInSelection = selectionCells.has(key);
            return (
              <div
                key={key}
                onMouseDown={() => handleCellMouseDown(row, col)}
                onMouseEnter={() => handleCellMouseEnter(row, col)}
                style={{ gridColumn: col, gridRow: row }}
                className={`border rounded-[4px] transition-colors ${
                  isOccupied
                    ? "border-transparent"
                    : isInSelection
                      ? selectionValid
                        ? "bg-primary/25 border-primary cursor-pointer"
                        : "bg-error/20 border-error cursor-not-allowed"
                      : "border-outline-variant bg-surface-bright hover:bg-surface-container-high cursor-pointer"
                }`}
              />
            );
          })}

          {frames.map((f) => {
            const isActive = f.tempId === activeFrameId;
            return (
              <div
                key={f.tempId}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActiveFrameId(f.tempId);
                  clearSelection();
                }}
                style={{
                  gridColumn: `${f.column_start} / span ${f.column_span}`,
                  gridRow: `${f.row_start} / span ${f.row_span}`,
                }}
                className={`relative rounded-[6px] overflow-hidden cursor-pointer border-2 transition-colors ${
                  isActive ? "border-primary ring-2 ring-primary/40" : "border-transparent hover:border-primary/50"
                }`}
              >
                {f.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={f.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-[20px]">image</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Click and drag across empty cells to select a rectangular area, then choose{" "}
        <span className="font-label-sm text-label-sm">Merge Selection</span> (or press{" "}
        <kbd className="px-1.5 py-0.5 rounded border border-outline-variant bg-surface-container-high font-label-sm text-label-sm">
          Enter
        </kbd>
        ). Click an existing frame to select it, then upload, replace, or remove it.
      </p>
    </div>
  );
}
