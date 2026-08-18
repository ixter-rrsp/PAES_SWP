import Link from "next/link";

export default function Page() {
  return (
    <>
<div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Dashboard Overview</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">A summary of your latest administrative metrics and activity.</p>
</div>
<button className="bg-primary-container text-white px-4 py-2 rounded-DEFAULT font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary transition-colors self-start sm:self-auto">
<span className="material-symbols-outlined" style={{fontSize: "18px"}}>add</span>
                    Create New
                </button>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

<div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
<div className="flex justify-between items-start relative z-10">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container-low flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">campaign</span>
</div>
<span className="font-label-md text-label-md text-status-published bg-secondary-fixed px-2 py-0.5 rounded-DEFAULT">+12% this week</span>
</div>
<div className="relative z-10">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Total Announcements</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface">1,248</h3>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
<div className="flex justify-between items-start relative z-10">
<div className="w-10 h-10 rounded-DEFAULT bg-surface-container-low flex items-center justify-center">
<span className="material-symbols-outlined text-on-surface-variant">calendar_month</span>
</div>
<span className="font-label-md text-label-md text-status-draft bg-surface-variant px-2 py-0.5 rounded-DEFAULT">Next 7 days</span>
</div>
<div className="relative z-10">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Upcoming Events</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface">34</h3>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-6 flex flex-col gap-4 relative overflow-hidden group">
<div className="absolute top-0 right-0 w-24 h-24 bg-surface-container-high rounded-bl-full -mr-4 -mt-4 opacity-50 transition-transform group-hover:scale-110"></div>
<div className="flex justify-between items-start relative z-10">
<div className="w-10 h-10 rounded-DEFAULT bg-primary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-primary">edit_document</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-DEFAULT">Needs Review</span>
</div>
<div className="relative z-10">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-1">Pending Drafts</p>
<h3 className="font-headline-lg text-headline-lg text-on-surface">12</h3>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant flex flex-col">
<div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Activity</h3>
<button className="font-label-md text-label-md text-primary hover:underline">View All History</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="font-label-md text-label-md text-on-surface-variant px-6 py-3 font-semibold uppercase tracking-wider w-1/4">Date &amp; Time</th>
<th className="font-label-md text-label-md text-on-surface-variant px-6 py-3 font-semibold uppercase tracking-wider w-1/2">Activity Description</th>
<th className="font-label-md text-label-md text-on-surface-variant px-6 py-3 font-semibold uppercase tracking-wider w-1/4 text-right">Status</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">
<tr className="border-b border-outline-variant hover:bg-surface-container-lowest/50 transition-colors">
<td className="px-6 py-density-sm h-12 whitespace-nowrap text-on-surface-variant">Today, 10:42 AM</td>
<td className="px-6 py-density-sm h-12">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant" style={{fontSize: "18px"}}>edit</span>
                                        Updated "Fall Semester Guidelines" in SBM Pages
                                    </div>
</td>
<td className="px-6 py-density-sm h-12 text-right">
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT font-label-md text-label-md bg-secondary-fixed text-status-published">Published</span>
</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-lowest/50 transition-colors">
<td className="px-6 py-density-sm h-12 whitespace-nowrap text-on-surface-variant">Today, 09:15 AM</td>
<td className="px-6 py-density-sm h-12">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant" style={{fontSize: "18px"}}>person_add</span>
                                        Added new faculty member to Staff Directory
                                    </div>
</td>
<td className="px-6 py-density-sm h-12 text-right">
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT font-label-md text-label-md bg-secondary-fixed text-status-published">Published</span>
</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-lowest/50 transition-colors">
<td className="px-6 py-density-sm h-12 whitespace-nowrap text-on-surface-variant">Yesterday, 16:30 PM</td>
<td className="px-6 py-density-sm h-12">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant" style={{fontSize: "18px"}}>note_add</span>
                                        Created draft for "Weekly Newsletter Vol. 42"
                                    </div>
</td>
<td className="px-6 py-density-sm h-12 text-right">
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT font-label-md text-label-md bg-surface-variant text-status-draft border border-outline-variant/50">Draft</span>
</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-lowest/50 transition-colors">
<td className="px-6 py-density-sm h-12 whitespace-nowrap text-on-surface-variant">Yesterday, 11:20 AM</td>
<td className="px-6 py-density-sm h-12">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant" style={{fontSize: "18px"}}>delete</span>
                                        Archived obsolete event "Summer Prep Course"
                                    </div>
</td>
<td className="px-6 py-density-sm h-12 text-right">
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT font-label-md text-label-md bg-surface-container-high text-on-surface-variant">Archived</span>
</td>
</tr>
<tr className="hover:bg-surface-container-lowest/50 transition-colors">
<td className="px-6 py-density-sm h-12 whitespace-nowrap text-on-surface-variant">Oct 24, 08:00 AM</td>
<td className="px-6 py-density-sm h-12">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-on-surface-variant" style={{fontSize: "18px"}}>campaign</span>
                                        Scheduled announcement "Emergency Drill Reminder"
                                    </div>
</td>
<td className="px-6 py-density-sm h-12 text-right">
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT font-label-md text-label-md bg-tertiary-fixed text-on-tertiary-fixed">Scheduled</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
    </>
  );
}
