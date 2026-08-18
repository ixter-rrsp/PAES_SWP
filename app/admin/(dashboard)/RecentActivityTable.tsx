"use client";

import { useState, useTransition } from "react";
import { fetchRecentActivityPage } from "./actions";
import type { ActivityAction, ActivityLogEntry } from "@/types";

const PAGE_SIZE = 10;

const ACTION_ICON: Record<ActivityAction, string> = {
  created: "note_add",
  updated: "edit",
  deleted: "delete",
  published: "campaign",
  unpublished: "visibility_off",
  archived: "archive",
};

const ACTION_LABEL: Record<ActivityAction, string> = {
  created: "Created",
  updated: "Updated",
  deleted: "Deleted",
  published: "Published",
  unpublished: "Draft",
  archived: "Archived",
};

const ACTION_BADGE_CLASS: Record<ActivityAction, string> = {
  created: "bg-secondary-fixed text-status-published",
  updated: "bg-surface-container-high text-on-surface-variant",
  deleted: "bg-surface-container-high text-on-surface-variant",
  published: "bg-secondary-fixed text-status-published",
  unpublished: "bg-surface-variant text-status-draft border border-outline-variant/50",
  archived: "bg-surface-container-high text-on-surface-variant",
};

const ENTITY_LABEL: Record<string, string> = {
  announcement: "Announcements",
  event: "Events",
  staff: "Staff Directory",
  downloadable: "Downloadables",
  archive_link: "Archive Links",
  sbm_year: "SBM Pages",
  sbm_folder: "SBM Pages",
};

function describeActivity(entry: ActivityLogEntry): string {
  const verb =
    entry.action === "created"
      ? "Created"
      : entry.action === "updated"
      ? "Updated"
      : entry.action === "deleted"
      ? "Deleted"
      : entry.action === "published"
      ? "Published"
      : entry.action === "unpublished"
      ? "Unpublished"
      : "Archived";

  const section = ENTITY_LABEL[entry.entity_type] ?? entry.entity_type;
  return `${verb} "${entry.entity_label}" in ${section}`;
}

function formatActor(entry: ActivityLogEntry): string {
  return entry.actor_name || entry.actor_email || "Unknown user";
}

function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.round(diffMs / 60000);

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isToday = date.toDateString() === now.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
  if (isToday) return `Today, ${time}`;
  if (isYesterday) return `Yesterday, ${time}`;

  return (
    date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + `, ${time}`
  );
}

// Windows the page-number buttons around the current page instead of
// rendering one button per page, since the activity log can grow
// into the hundreds/thousands of rows. maxButtons is lowered on
// narrow screens (see usage) so the bar doesn't wrap.
function getPageNumbers(currentPage: number, totalPages: number, maxButtons = 5): number[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  let start = Math.max(0, currentPage - Math.floor(maxButtons / 2));
  const end = Math.min(totalPages, start + maxButtons);
  start = Math.max(0, end - maxButtons);

  return Array.from({ length: end - start }, (_, i) => start + i);
}

export default function RecentActivityTable({
  initialItems,
  initialTotal,
}: {
  initialItems: ActivityLogEntry[];
  initialTotal: number;
}) {
  const [items, setItems] = useState(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(0);
  const [isPending, startTransition] = useTransition();

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function goToPage(nextPage: number) {
    if (nextPage === page || nextPage < 0 || nextPage >= totalPages) return;

    startTransition(async () => {
      const result = await fetchRecentActivityPage(nextPage, PAGE_SIZE);
      if (result.error) return;
      setItems(result.items);
      setTotal(result.total);
      setPage(nextPage);
    });
  }

  const rangeStart = total === 0 ? 0 : page * PAGE_SIZE + 1;
  const rangeEnd = Math.min(total, page * PAGE_SIZE + items.length);

  return (
    <div className="bg-surface-container-lowest border border-outline-variant flex flex-col">
      <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h3>
      </div>
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="font-label-md text-label-md text-on-surface-variant px-6 py-3 font-semibold uppercase tracking-wider w-1/5">
                Date &amp; Time
              </th>
              <th className="font-label-md text-label-md text-on-surface-variant px-6 py-3 font-semibold uppercase tracking-wider w-2/5">
                Activity Description
              </th>
              <th className="font-label-md text-label-md text-on-surface-variant px-6 py-3 font-semibold uppercase tracking-wider w-1/5">
                By
              </th>
              <th className="font-label-md text-label-md text-on-surface-variant px-6 py-3 font-semibold uppercase tracking-wider w-1/5 text-right">
                Action
              </th>
            </tr>
          </thead>
          <tbody
            className={`font-body-md text-body-md text-on-surface transition-opacity ${
              isPending ? "opacity-50" : "opacity-100"
            }`}
          >
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-10 text-center text-on-surface-variant font-body-md text-body-md"
                >
                  No activity yet. Changes you make across the admin will show up here.
                </td>
              </tr>
            )}
            {items.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-lowest/50 transition-colors"
              >
                <td className="px-6 py-density-sm h-12 whitespace-nowrap text-on-surface-variant">
                  {formatRelativeTime(entry.created_at)}
                </td>
                <td className="px-6 py-density-sm h-12">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-outlined text-on-surface-variant"
                      style={{ fontSize: "18px" }}
                    >
                      {ACTION_ICON[entry.action]}
                    </span>
                    {describeActivity(entry)}
                  </div>
                </td>
                <td className="px-6 py-density-sm h-12 text-on-surface-variant">
                  {formatActor(entry)}
                </td>
                <td className="px-6 py-density-sm h-12 text-right">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-DEFAULT font-label-md text-label-md ${ACTION_BADGE_CLASS[entry.action]}`}
                  >
                    {ACTION_LABEL[entry.action]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card list below md: a 4-column table doesn't fit narrow
          screens, so each row becomes a stacked card instead of
          forcing horizontal scroll. */}
      <div
        className={`md:hidden divide-y divide-outline-variant transition-opacity ${
          isPending ? "opacity-50" : "opacity-100"
        }`}
      >
        {items.length === 0 && (
          <p className="px-4 py-10 text-center text-on-surface-variant font-body-md text-body-md">
            No activity yet. Changes you make across the admin will show up here.
          </p>
        )}
        {items.map((entry) => (
          <div key={entry.id} className="px-4 py-3 flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="material-symbols-outlined text-on-surface-variant flex-shrink-0"
                  style={{ fontSize: "18px" }}
                >
                  {ACTION_ICON[entry.action]}
                </span>
                <span className="font-body-md text-body-md text-on-surface break-words">
                  {describeActivity(entry)}
                </span>
              </div>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-DEFAULT font-label-md text-label-md flex-shrink-0 ${ACTION_BADGE_CLASS[entry.action]}`}
              >
                {ACTION_LABEL[entry.action]}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <span>{formatActor(entry)}</span>
              <span className="whitespace-nowrap">{formatRelativeTime(entry.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="px-4 md:px-6 py-3 border-t border-outline-variant flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center sm:text-left">
            Showing {rangeStart}–{rangeEnd} of {total}
          </p>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => goToPage(page - 1)}
                disabled={page === 0 || isPending}
                aria-label="Previous page"
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>

              {/* Fewer page-number buttons on narrow screens so the
                  bar doesn't overflow or wrap. */}
              {getPageNumbers(page, totalPages, 3)[0] > 0 && (
                <span className="text-on-surface-variant px-1 hidden sm:inline">…</span>
              )}

              {getPageNumbers(page, totalPages, 3).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => goToPage(pageNum)}
                  disabled={isPending}
                  aria-current={pageNum === page ? "page" : undefined}
                  className={
                    pageNum === page
                      ? "w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md flex-shrink-0"
                      : "w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container-low font-label-md transition-colors flex-shrink-0"
                  }
                >
                  {pageNum + 1}
                </button>
              ))}

              {getPageNumbers(page, totalPages, 3).slice(-1)[0] < totalPages - 1 && (
                <span className="text-on-surface-variant px-1 hidden sm:inline">…</span>
              )}

              <button
                type="button"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages - 1 || isPending}
                aria-label="Next page"
                className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
