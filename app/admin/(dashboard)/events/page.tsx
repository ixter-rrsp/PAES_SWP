import { getAllEvents } from "@/lib/data/events";

function formatDateTime(startsAt: string, endsAt: string | null) {
  const start = new Date(startsAt);
  const date = start.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
  const startTime = start.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  if (!endsAt) return { date, time: startTime };
  const endTime = new Date(endsAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time: `${startTime} - ${endTime}` };
}

export default async function Page() {
  const events = await getAllEvents();

  return (
    <>

<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Events Manager</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage institutional events, assemblies, and public holidays.</p>
</div>
<div className="flex items-center gap-3 w-full sm:w-auto">

<div className="flex bg-surface-container-low border border-outline-variant p-0.5 rounded-DEFAULT">
<button className="px-3 py-1.5 rounded-DEFAULT bg-white shadow-[0px_1px_2px_rgba(0,0,0,0.05)] border border-outline-variant text-primary font-label-md text-label-md flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-sm" data-icon="table_rows">table_rows</span>
                            Table
                        </button>
<button className="px-3 py-1.5 rounded-DEFAULT text-on-surface-variant hover:text-on-surface font-label-md text-label-md flex items-center gap-2 transition-all">
<span className="material-symbols-outlined text-sm" data-icon="calendar_view_month">calendar_view_month</span>
                            Calendar
                        </button>
</div>

<button className="bg-primary-container text-white font-label-lg text-label-lg px-4 py-2 rounded-DEFAULT flex items-center gap-2 hover:bg-primary transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm whitespace-nowrap">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                        Add Event
                    </button>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-DEFAULT overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.02)]">

<div className="px-gutter py-3 border-b border-outline-variant bg-surface-bright flex flex-wrap gap-4 items-center justify-between">
<div className="flex items-center gap-2">
<span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Filter by:</span>
<select className="border-outline-variant border rounded-DEFAULT py-1 pl-2 pr-8 text-body-sm font-body-sm bg-white focus:border-primary focus:ring-primary h-8">
<option>All Statuses</option>
<option>Published</option>
<option>Draft</option>
</select>
</div>
<div className="flex items-center gap-2">
<button className="text-on-surface-variant hover:text-on-surface p-1 rounded-DEFAULT hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-[20px]" data-icon="filter_list">filter_list</span>
</button>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-[#EDEEEF] border-b border-outline-variant">
<th className="py-2 px-gutter font-label-md text-label-md text-on-surface w-[40%]">Event Title &amp; Location</th>
<th className="py-2 px-gutter font-label-md text-label-md text-on-surface w-[20%]">Status</th>
<th className="py-2 px-gutter font-label-md text-label-md text-on-surface w-[25%]">Date &amp; Time</th>
<th className="py-2 px-gutter font-label-md text-label-md text-on-surface text-right w-[15%]">Actions</th>
</tr>
</thead>
<tbody className="font-body-sm text-body-sm">
{events.length === 0 && (
<tr>
<td colSpan={4} className="py-10 px-gutter text-center text-on-surface-variant">
No events yet.
</td>
</tr>
)}
{events.map((event) => {
const { date, time } = formatDateTime(event.starts_at, event.ends_at);
return (
<tr key={event.id} className="border-b border-outline-variant hover:bg-[#F3F4F5] transition-colors group">
<td className="py-density-sm px-gutter">
<div className="flex flex-col py-1">
<span className="font-label-lg text-label-lg text-on-surface">{event.title}</span>
{event.location && (
<span className="text-on-surface-variant flex items-center gap-1 mt-0.5">
<span className="material-symbols-outlined text-[14px]" data-icon="location_on">location_on</span>
{event.location}
</span>
)}
</div>
</td>
<td className="py-density-sm px-gutter">
{event.status === "published" ? (
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary-container/30 text-status-published font-label-md text-[11px] border border-secondary-container/50">
<span className="w-1.5 h-1.5 rounded-full bg-status-published"></span>
                                        Published
                                    </span>
) : (
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-surface-container-high text-status-draft font-label-md text-[11px] border border-outline-variant/50">
<span className="w-1.5 h-1.5 rounded-full bg-status-draft"></span>
                                        Draft
                                    </span>
)}
</td>
<td className="py-density-sm px-gutter">
<div className="flex flex-col py-1">
<span className="text-on-surface font-medium">{date}</span>
<span className="text-on-surface-variant">{time}</span>
</div>
</td>
<td className="py-density-sm px-gutter text-right">
<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary-fixed rounded-DEFAULT transition-colors" title="Edit">
<span className="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container rounded-DEFAULT transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]" data-icon="delete">delete</span>
</button>
</div>
</td>
</tr>
);
})}
</tbody>
</table>
</div>

<div className="px-gutter py-3 bg-surface-bright flex items-center justify-between border-t border-outline-variant">
<span className="font-body-sm text-body-sm text-on-surface-variant">Showing {events.length} event{events.length === 1 ? "" : "s"}</span>
</div>
</div>
    </>
  );
}
