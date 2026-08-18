"use client";

import { useState, useTransition } from "react";
import type { PublicSbmFolder, PublicSbmYear } from "@/types";
import { unlockSbmFolder } from "./actions";

function toggleAccordion(button: HTMLButtonElement) {
  const content = button.nextElementSibling as HTMLElement | null;
  const icon = button.querySelector(".accordion-icon");
  if (!content || !icon) return;

  if (content.classList.contains("expanded")) {
    content.classList.remove("expanded");
    icon.classList.remove("rotated");
  } else {
    document.querySelectorAll(".accordion-content.expanded").forEach((el) => {
      if (el !== content) {
        el.classList.remove("expanded");
        el.previousElementSibling?.querySelector(".accordion-icon")?.classList.remove("rotated");
      }
    });
    content.classList.add("expanded");
    icon.classList.add("rotated");
  }
}

/**
 * Gate for a code-protected folder. We never send onedrive_url to the
 * browser for these — unlockSbmFolder resolves it server-side only
 * after the code checks out, then we navigate to it ourselves.
 */
function FolderAccessGate({ folder, onClose }: { folder: PublicSbmFolder; onClose: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    startTransition(async () => {
      const result = await unlockSbmFolder(folder.id, code);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-primary">lock</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface">{folder.label}</h3>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant mb-4">
          This folder requires an access code. Enter the code you were given to continue to
          OneDrive.
        </p>
        <input
          autoFocus
          type="password"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") submit();
          }}
          placeholder="Access code"
          className="w-full border border-outline-variant rounded px-3 py-2 text-body-md mb-2 outline-none focus:border-primary"
        />
        {error && <p className="text-error text-sm mb-2">{error}</p>}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border border-outline-variant text-label-md hover:bg-surface-container-low"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isPending || !code.trim()}
            className="px-4 py-2 rounded bg-primary-container text-white text-label-md hover:bg-primary disabled:opacity-50"
          >
            {isPending ? "Checking..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FolderCard({ folder, onOpenGate }: { folder: PublicSbmFolder; onOpenGate: () => void }) {
  const body = (
    <>
      <span
        className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors"
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {folder.requires_code ? "lock" : "folder_open"}
      </span>
      <div>
        <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">
          {folder.label}
        </h3>
        {folder.description && (
          <p className="font-body-md text-body-md text-sm text-on-surface-variant mt-1">
            {folder.description}
          </p>
        )}
        <p className="text-xs text-outline mt-1">
          {folder.requires_code ? "Access code required" : "Opens in OneDrive"}
        </p>
      </div>
    </>
  );

  const className =
    "flex items-start gap-3 p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface transition-all group text-left w-full";

  if (folder.requires_code) {
    return (
      <button className={className} onClick={onOpenGate}>
        {body}
      </button>
    );
  }

  return (
    <a className={className} href={folder.onedrive_url ?? "#"} target="_blank" rel="noreferrer">
      {body}
    </a>
  );
}

export default function SbmAccordion({ years }: { years: PublicSbmYear[] }) {
  const [gatedFolder, setGatedFolder] = useState<PublicSbmFolder | null>(null);

  if (years.length === 0) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center">
        <p className="text-on-surface-variant font-body-md text-body-md">
          SBM documents haven&rsquo;t been published yet. Please check back soon.
        </p>
      </div>
    );
  }

  return (
    <>
      {years.map((year, idx) => (
        <div
          key={year.id}
          className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow"
        >
          <button
            className="w-full flex items-center justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-low transition-colors"
            onClick={(e) => toggleAccordion(e.currentTarget)}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-1.5 h-8 rounded-full ${idx === 0 ? "bg-primary" : "bg-surface-dim"}`}
              ></div>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                School Year {year.school_year}
              </h2>
              {idx === 0 && (
                <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-sm text-label-sm ml-2">
                  Current
                </span>
              )}
            </div>
            <span
              className={`material-symbols-outlined text-on-surface-variant accordion-icon ${idx === 0 ? "rotated" : ""}`}
            >
              expand_more
            </span>
          </button>
          <div
            className={`accordion-content px-6 pb-6 bg-surface-container-lowest ${idx === 0 ? "expanded" : ""}`}
          >
            {year.content && (
              <p className="font-body-md text-body-md text-on-surface-variant mt-4 whitespace-pre-line">
                {year.content}
              </p>
            )}

            {year.folders.length === 0 ? (
              <p className="font-body-md text-body-md text-on-surface-variant mt-4">
                No documents have been posted for this school year yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {year.folders.map((folder) => (
                  <FolderCard
                    key={folder.id}
                    folder={folder}
                    onOpenGate={() => setGatedFolder(folder)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {gatedFolder && (
        <FolderAccessGate folder={gatedFolder} onClose={() => setGatedFolder(null)} />
      )}
    </>
  );
}
