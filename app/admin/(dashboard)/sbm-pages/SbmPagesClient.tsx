"use client";

import { useState, useTransition } from "react";
import type { SbmFolder, SbmYearStatus, SbmYearWithFolders } from "@/types";
import {
  clearSbmFolderAccessCode,
  createSbmFolder,
  createSbmYear,
  deleteSbmFolder,
  deleteSbmYear,
  setSbmYearStatus,
  updateSbmFolder,
  updateSbmYearContent,
} from "./actions";

const STATUS_STYLES: Record<SbmYearStatus, string> = {
  published: "bg-[#E8F5E9] text-status-published border-[#C8E6C9]",
  draft: "bg-surface-container-highest text-status-draft border-outline-variant",
  archived: "bg-surface-container-highest text-outline border-outline-variant",
};

function StatusBadge({ status }: { status: SbmYearStatus }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-full font-label-md text-label-md border whitespace-nowrap capitalize ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function FolderRow({
  folder,
  onSaved,
}: {
  folder: SbmFolder;
  onSaved: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (editing) {
    return (
      <form
        className="border border-primary-container rounded-lg p-3 flex flex-col gap-2 bg-surface"
        action={(formData) => {
          startTransition(async () => {
            const result = await updateSbmFolder(folder.id, formData);
            if (result.error) {
              setError(result.error);
              return;
            }
            setError(null);
            setEditing(false);
            onSaved();
          });
        }}
      >
        <input
          name="label"
          defaultValue={folder.label}
          placeholder="Folder name, e.g. Leadership and Governance"
          className="border border-outline-variant rounded px-3 py-1.5 text-body-md"
        />
        <input
          name="description"
          defaultValue={folder.description ?? ""}
          placeholder="Short description (optional)"
          className="border border-outline-variant rounded px-3 py-1.5 text-body-md"
        />
        <input
          name="onedrive_url"
          defaultValue={folder.onedrive_url}
          placeholder="https://onedrive.live.com/... or https://1drv.ms/..."
          className="border border-outline-variant rounded px-3 py-1.5 text-body-md font-mono text-sm"
        />
        <input
          name="access_code"
          type="text"
          placeholder={
            folder.access_code_hash
              ? "Leave blank to keep the current code"
              : "Access code (leave blank for no gate)"
          }
          className="border border-outline-variant rounded px-3 py-1.5 text-body-md"
        />
        <p className="text-xs text-on-surface-variant">
          Visitors enter this on our site before we hand them the OneDrive link &mdash; we no
          longer rely on OneDrive&rsquo;s own sign-in prompt, since it doesn&rsquo;t fire for
          accounts already trusted via SSO.
        </p>
        {error && <p className="text-error text-sm">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="px-3 py-1.5 rounded border border-outline-variant text-label-md hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-3 py-1.5 rounded bg-primary-container text-white text-label-md hover:bg-primary disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    );
  }

  const hasCode = !!folder.access_code_hash;

  return (
    <div className="flex items-start justify-between gap-3 border border-outline-variant rounded-lg p-3">
      <a
        href={folder.onedrive_url}
        target="_blank"
        rel="noreferrer"
        title={folder.onedrive_url}
        className="flex items-start gap-3 min-w-0 group"
      >
        <span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors">
          {hasCode ? "lock" : "folder_open"}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-label-md text-label-md text-on-surface group-hover:text-primary truncate">
              {folder.label}
            </p>
            {hasCode && (
              <span className="px-1.5 py-0.5 rounded-full bg-surface-container-highest text-xs text-on-surface-variant border border-outline-variant whitespace-nowrap">
                Code required
              </span>
            )}
          </div>
          {folder.description && (
            <p className="text-sm text-on-surface-variant truncate">{folder.description}</p>
          )}
        </div>
      </a>
      <div className="flex items-center gap-1 shrink-0">
        {hasCode && (
          <button
            onClick={() => {
              if (!confirm(`Remove the access code from "${folder.label}"? It will open directly.`))
                return;
              startTransition(async () => {
                await clearSbmFolderAccessCode(folder.id);
                onSaved();
              });
            }}
            className="p-1.5 text-on-surface-variant hover:text-primary"
            title="Remove access code"
          >
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
          </button>
        )}
        <button
          onClick={() => setEditing(true)}
          className="p-1.5 text-on-surface-variant hover:text-primary"
          title="Edit"
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
        </button>
        <button
          onClick={() => {
            if (!confirm(`Remove "${folder.label}"?`)) return;
            startTransition(async () => {
              await deleteSbmFolder(folder.id);
              onSaved();
            });
          }}
          className="p-1.5 text-on-surface-variant hover:text-error"
          title="Delete"
        >
          <span className="material-symbols-outlined text-[18px]">delete</span>
        </button>
      </div>
    </div>
  );
}

function AddFolderForm({ yearId, onSaved }: { yearId: string; onSaved: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-primary font-label-md text-label-md hover:underline"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Add OneDrive folder
      </button>
    );
  }

  return (
    <form
      className="border border-primary-container rounded-lg p-3 flex flex-col gap-2 bg-surface"
      action={(formData) => {
        startTransition(async () => {
          const result = await createSbmFolder(yearId, formData);
          if (result.error) {
            setError(result.error);
            return;
          }
          setError(null);
          setOpen(false);
          onSaved();
        });
      }}
    >
      <input
        name="label"
        placeholder="Folder name, e.g. Leadership and Governance"
        className="border border-outline-variant rounded px-3 py-1.5 text-body-md"
      />
      <input
        name="description"
        placeholder="Short description (optional)"
        className="border border-outline-variant rounded px-3 py-1.5 text-body-md"
      />
      <input
        name="onedrive_url"
        placeholder="https://onedrive.live.com/... or https://1drv.ms/..."
        className="border border-outline-variant rounded px-3 py-1.5 text-body-md font-mono text-sm"
      />
      <input
        name="access_code"
        type="text"
        placeholder="Access code (leave blank for no gate)"
        className="border border-outline-variant rounded px-3 py-1.5 text-body-md"
      />
      <p className="text-xs text-on-surface-variant">
        Paste the OneDrive folder&rsquo;s share link. If you set an access code, visitors enter
        it on our site first and only get the link once it&rsquo;s correct &mdash; OneDrive&rsquo;s
        own sign-in prompt doesn&rsquo;t reliably show up (it&rsquo;s silent for anyone already
        signed in via SSO), so this is the gate that actually works. Leave it blank for a folder
        anyone with the OneDrive link can already open.
      </p>
      {error && <p className="text-error text-sm">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-1.5 rounded border border-outline-variant text-label-md hover:bg-surface-container-low"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-3 py-1.5 rounded bg-primary-container text-white text-label-md hover:bg-primary disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add folder"}
        </button>
      </div>
    </form>
  );
}

function YearCard({
  year,
  defaultOpen,
  onSaved,
}: {
  year: SbmYearWithFolders;
  defaultOpen: boolean;
  onSaved: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [content, setContent] = useState(year.content);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function saveContent() {
    startTransition(async () => {
      const result = await updateSbmYearContent(year.id, content);
      if (result.error) {
        setError(result.error);
        return;
      }
      setError(null);
      setDirty(false);
      onSaved();
    });
  }

  function changeStatus(status: SbmYearStatus) {
    startTransition(async () => {
      await setSbmYearStatus(year.id, status);
      onSaved();
    });
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden shadow-sm">
      <div
        className="px-density-lg py-4 flex flex-wrap items-center justify-between gap-3 cursor-pointer border-b border-outline-variant bg-surface-muted/50 hover:bg-surface-container-low"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center gap-4 flex-wrap min-w-0">
          <span
            className={`material-symbols-outlined text-primary-container transition-transform duration-200 shrink-0 ${open ? "rotate-90" : ""}`}
          >
            chevron_right
          </span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
            SY {year.school_year}
          </h3>
          <StatusBadge status={year.status} />
          <span className="text-xs text-on-surface-variant">
            {year.folders.length} folder{year.folders.length === 1 ? "" : "s"}
          </span>
        </div>
        <div
          className="flex items-center gap-3"
          onClick={(event) => event.stopPropagation()}
        >
          <select
            value={year.status}
            onChange={(e) => changeStatus(e.target.value as SbmYearStatus)}
            className="border border-outline-variant rounded px-2 py-1 text-label-md bg-surface-container-lowest"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <button
            className="text-on-surface-variant hover:text-error transition-colors p-1"
            title="Delete year"
            onClick={() => {
              if (!confirm(`Delete SY ${year.school_year} and all its folders?`)) return;
              startTransition(async () => {
                await deleteSbmYear(year.id);
                onSaved();
              });
            }}
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="p-density-lg bg-surface-container-lowest flex flex-col gap-6">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-2">
              Page summary
            </p>
            <textarea
              className="w-full h-32 p-4 font-body-md text-body-md text-on-surface bg-surface border border-outline-variant rounded resize-y outline-none focus:border-primary-container"
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setDirty(true);
              }}
              placeholder="Enter content for this academic year..."
            />
            {error && <p className="text-error text-sm mt-1">{error}</p>}
            <div className="flex justify-end items-center mt-3 gap-3">
              <button
                disabled={!dirty}
                onClick={() => {
                  setContent(year.content);
                  setDirty(false);
                }}
                className="font-label-lg text-label-lg text-on-surface-variant px-4 py-2 rounded border border-outline-variant hover:bg-surface-container-low transition-colors disabled:opacity-40"
              >
                Discard Changes
              </button>
              <button
                disabled={!dirty || isPending}
                onClick={saveContent}
                className="font-label-lg text-label-lg text-white bg-primary-container px-6 py-2 rounded shadow-sm hover:bg-primary transition-colors disabled:opacity-40"
              >
                {isPending ? "Saving..." : "Save Content"}
              </button>
            </div>
          </div>

          <div>
            <p className="font-label-md text-label-md text-on-surface-variant mb-2">
              OneDrive folders
            </p>
            <div className="flex flex-col gap-2">
              {year.folders.map((folder) => (
                <FolderRow key={folder.id} folder={folder} onSaved={onSaved} />
              ))}
              <AddFolderForm yearId={year.id} onSaved={onSaved} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SbmPagesClient({
  initialYears,
}: {
  initialYears: SbmYearWithFolders[];
}) {
  const [creating, setCreating] = useState(false);
  const [newYear, setNewYear] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [refreshKey, setRefreshKey] = useState(0);
  const years = initialYears;

  function onSaved() {
    setRefreshKey((k) => k + 1);
    // Server actions already revalidatePath the admin route; the
    // parent Server Component re-renders with fresh data. Bumping a
    // local key just makes intent explicit for anyone reading this.
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="font-headline-md text-headline-md text-on-surface mb-2">
            SBM Pages Manager
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage content and OneDrive document folders for School Based Management yearly
            reports.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="bg-primary-container text-white font-label-lg text-label-lg px-4 py-2 rounded shadow-sm hover:bg-primary transition-colors flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Create New Year
        </button>
      </div>

      {creating && (
        <form
          className="max-w-md mb-6 border border-primary-container rounded-lg p-4 flex flex-col gap-2 bg-surface-container-lowest"
          action={() => {
            if (!newYear.trim()) {
              setError("Enter a school year, e.g. 2025-2026.");
              return;
            }
            const formData = new FormData();
            formData.set("school_year", newYear.trim());
            startTransition(async () => {
              const result = await createSbmYear(formData);
              if (result.error) {
                setError(result.error);
                return;
              }
              setError(null);
              setNewYear("");
              setCreating(false);
              onSaved();
            });
          }}
        >
          <label className="font-label-md text-label-md text-on-surface-variant">
            School year
          </label>
          <input
            value={newYear}
            onChange={(e) => setNewYear(e.target.value)}
            placeholder="2025-2026"
            className="border border-outline-variant rounded px-3 py-1.5 text-body-md"
          />
          {error && <p className="text-error text-sm">{error}</p>}
          <div className="flex gap-2 justify-end mt-1">
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setError(null);
              }}
              className="px-3 py-1.5 rounded border border-outline-variant text-label-md hover:bg-surface-container-low"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-3 py-1.5 rounded bg-primary-container text-white text-label-md hover:bg-primary disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4 max-w-5xl" key={refreshKey}>
        {years.length === 0 && (
          <p className="text-on-surface-variant text-body-md">
            No school years yet. Create one to start adding OneDrive document folders.
          </p>
        )}
        {years.map((year, idx) => (
          <YearCard key={year.id} year={year} defaultOpen={idx === 0} onSaved={onSaved} />
        ))}
      </div>
      <div className="h-20"></div>
    </>
  );
}
