import { getDashboardStats, getRecentActivityPage } from "@/lib/data/activity";
import RecentActivityTable from "./RecentActivityTable";

const ACTIVITY_PAGE_SIZE = 10;

export default async function Page() {
  const [stats, recentActivity] = await Promise.all([
    getDashboardStats(),
    getRecentActivityPage(0, ACTIVITY_PAGE_SIZE),
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

      <RecentActivityTable
        initialItems={recentActivity.items}
        initialTotal={recentActivity.total}
      />
    </>
  );
}
