import { getDashboardStats, getRecentActivity } from "@/lib/data/activity";
import type { ActivityAction, ActivityLogEntry } from "@/types";

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

export default async function Page() {
  const [stats, recentActivity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(10),
  ]);

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Dashboard Overview</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            A summary of your latest administrative metrics and activity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">campaign</span>
            </div>
            <span className="font-label-md text-label-md text-status-published bg-secondary-fixed px-2 py-0.5 rounded-DEFAULT">
              +{stats.announcementsPublishedLast7Days} this week
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
              Total Announcements
            </p>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">
              {stats.totalAnnouncements.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 rounded-DEFAULT bg-surface-container-low flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
            </div>
            <span className="font-label-md text-label-md text-status-draft bg-surface-variant px-2 py-0.5 rounded-DEFAULT">
              Next 7 days
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
              Upcoming Events
            </p>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">
              {stats.upcomingEventsNext7Days.toLocaleString()}
            </h3>
          </div>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
          <div className="flex justify-between items-start relative z-10">
            <div className="w-10 h-10 rounded-DEFAULT bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">edit_document</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-DEFAULT">
              Needs Review
            </span>
          </div>
          <div className="relative z-10">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
              Pending Drafts
            </p>
            <h3 className="font-headline-lg text-headline-lg text-on-surface">
              {stats.pendingDrafts.toLocaleString()}
            </h3>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant flex flex-col">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
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
            <tbody className="font-body-md text-body-md text-on-surface">
              {recentActivity.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-on-surface-variant font-body-md text-body-md"
                  >
                    No activity yet. Changes you make across the admin will show up here.
                  </td>
                </tr>
              )}
              {recentActivity.map((entry) => (
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
      </div>
    </>
  );
}
