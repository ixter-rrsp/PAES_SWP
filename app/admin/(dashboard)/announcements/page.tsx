"use client";

import Link from "next/link";

export default function Page() {
  return (
    <>
<div className="flex-1 overflow-y-auto p-4 md:p-margin-page bg-surface-bright">

<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface">Announcements</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage global alerts and campus updates.</p>
</div>
<button className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container text-white font-label-lg text-label-lg rounded-DEFAULT hover:bg-primary transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container whitespace-nowrap" onClick={() => { document.getElementById('slideOverPanel')?.classList.add('active') }}>
<span className="material-symbols-outlined text-[20px]" data-icon="add">add</span>
                        New Announcement
                    </button>
</div>

<div className="bg-white rounded-DEFAULT border border-outline-variant overflow-hidden flex flex-col">

<div className="px-4 py-3 border-b border-outline-variant bg-surface-muted flex justify-between items-center">
<div className="flex gap-2">

<button className="px-3 py-1 text-label-md font-label-md rounded-full bg-primary-container/10 text-primary border border-primary/20">All (24)</button>
<button className="px-3 py-1 text-label-md font-label-md rounded-full bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container-low transition-colors hidden sm:block">Published (18)</button>
<button className="px-3 py-1 text-label-md font-label-md rounded-full bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container-low transition-colors hidden sm:block">Drafts (6)</button>
</div>
<div className="flex gap-2">
<button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-DEFAULT transition-colors" data-icon="filter_list" title="Filter">
<span className="material-symbols-outlined text-[20px]">filter_list</span>
</button>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-[#EDEEEF] border-b border-outline-variant text-on-surface">
<th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px">
<div className="flex items-center gap-2 cursor-pointer group">
                                            Status
                                            <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:text-primary transition-colors">arrow_downward</span>
</div>
</th>
<th className="px-4 py-2 font-label-md text-label-md font-semibold min-w-[300px]">Title</th>
<th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px hidden md:table-cell">Publish Date</th>
<th className="px-4 py-2 font-label-md text-label-md font-semibold whitespace-nowrap w-px hidden lg:table-cell">Author</th>
<th className="px-4 py-2 font-label-md text-label-md font-semibold text-right whitespace-nowrap w-px">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant bg-white font-body-md text-body-md">

<tr className="hover:bg-[#F3F4F5] transition-colors group">
<td className="px-4 py-density-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT bg-secondary-container/20 text-status-published font-label-md text-label-md border border-secondary-container">
<span className="w-1.5 h-1.5 rounded-full bg-status-published"></span>
                                            Published
                                        </span>
</td>
<td className="px-4 py-density-md">
<div className="font-semibold text-on-surface">Spring Semester Registration Open</div>
<div className="text-body-sm text-on-surface-variant mt-0.5 truncate max-w-md">Priority registration begins next week for seniors and graduate students. Please ensure all holds are cleared.</div>
</td>
<td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden md:table-cell">
                                        Oct 12, 2023
                                    </td>
<td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden lg:table-cell">
                                        Registrar Office
                                    </td>
<td className="px-4 py-density-md whitespace-nowrap text-right">
<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">

<button className="p-1.5 text-on-surface-variant hover:text-tertiary-container hover:bg-tertiary-container/10 rounded-DEFAULT transition-colors" data-icon="visibility" title="Toggle Visibility">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-DEFAULT transition-colors" data-icon="edit" title="Edit">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-DEFAULT transition-colors" data-icon="delete" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-[#F3F4F5] transition-colors group">
<td className="px-4 py-density-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT bg-surface-container-highest text-status-draft font-label-md text-label-md border border-outline-variant">
<span className="w-1.5 h-1.5 rounded-full bg-status-draft"></span>
                                            Draft
                                        </span>
</td>
<td className="px-4 py-density-md">
<div className="font-semibold text-on-surface">Campus Network Maintenance Notice</div>
<div className="text-body-sm text-on-surface-variant mt-0.5 truncate max-w-md">IT Services will be performing critical infrastructure upgrades this weekend affecting dorm connectivity.</div>
</td>
<td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden md:table-cell">
                                        --
                                    </td>
<td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden lg:table-cell">
                                        IT Department
                                    </td>
<td className="px-4 py-density-md whitespace-nowrap text-right">
<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
<button className="p-1.5 text-on-surface-variant hover:text-tertiary-container hover:bg-tertiary-container/10 rounded-DEFAULT transition-colors" data-icon="visibility_off" title="Toggle Visibility">
<span className="material-symbols-outlined text-[20px]">visibility_off</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-DEFAULT transition-colors" data-icon="edit" title="Edit">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-DEFAULT transition-colors" data-icon="delete" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>

<tr className="hover:bg-[#F3F4F5] transition-colors group">
<td className="px-4 py-density-md whitespace-nowrap">
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT bg-secondary-container/20 text-status-published font-label-md text-label-md border border-secondary-container">
<span className="w-1.5 h-1.5 rounded-full bg-status-published"></span>
                                            Published
                                        </span>
</td>
<td className="px-4 py-density-md">
<div className="font-semibold text-on-surface">New Library Operating Hours</div>
<div className="text-body-sm text-on-surface-variant mt-0.5 truncate max-w-md">Starting next month, the main library will extend its hours to 2 AM during midterms.</div>
</td>
<td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden md:table-cell">
                                        Sep 28, 2023
                                    </td>
<td className="px-4 py-density-md whitespace-nowrap text-on-surface-variant hidden lg:table-cell">
                                        Library Services
                                    </td>
<td className="px-4 py-density-md whitespace-nowrap text-right">
<div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
<button className="p-1.5 text-on-surface-variant hover:text-tertiary-container hover:bg-tertiary-container/10 rounded-DEFAULT transition-colors" data-icon="visibility" title="Toggle Visibility">
<span className="material-symbols-outlined text-[20px]">visibility</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-DEFAULT transition-colors" data-icon="edit" title="Edit">
<span className="material-symbols-outlined text-[20px]">edit</span>
</button>
<button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-DEFAULT transition-colors" data-icon="delete" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="px-4 py-3 border-t border-outline-variant bg-surface-muted flex justify-between items-center text-body-sm text-on-surface-variant">
<div>Showing 1 to 3 of 24 entries</div>
<div className="flex gap-1">
<button className="px-2 py-1 border border-outline-variant rounded-DEFAULT bg-white hover:bg-surface-container-low disabled:opacity-50" disabled>&lt;</button>
<button className="px-2 py-1 border border-primary bg-primary-fixed text-primary rounded-DEFAULT">1</button>
<button className="px-2 py-1 border border-outline-variant rounded-DEFAULT bg-white hover:bg-surface-container-low">2</button>
<button className="px-2 py-1 border border-outline-variant rounded-DEFAULT bg-white hover:bg-surface-container-low">3</button>
<button className="px-2 py-1 border border-outline-variant rounded-DEFAULT bg-white hover:bg-surface-container-low">&gt;</button>
</div>
</div>
</div>
</div>

<div aria-labelledby="slide-over-title" aria-modal="true" className="modal-overlay fixed inset-0 z-50 overflow-hidden" id="slideOverPanel" role="dialog">

<div className="absolute inset-0 bg-inverse-surface/50 backdrop-blur-sm transition-opacity cursor-pointer" onClick={() => { document.getElementById('slideOverPanel')?.classList.remove('active') }}></div>
<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">

<div className="modal-panel pointer-events-auto w-screen max-w-md">
<div className="flex h-full flex-col overflow-y-scroll bg-white shadow-[0px_4px_24px_rgba(0,0,0,0.15)] border-l border-outline-variant">

<div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant bg-surface-muted">
<h2 className="font-headline-sm text-headline-sm text-on-surface" id="slide-over-title">Create Announcement</h2>
<button className="rounded-DEFAULT text-on-surface-variant hover:text-error hover:bg-error/10 p-1 transition-colors" onClick={() => { document.getElementById('slideOverPanel')?.classList.remove('active') }} type="button">
<span className="sr-only">Close panel</span>
<span className="material-symbols-outlined text-[24px]">close</span>
</button>
</div>

<div className="relative flex-1 px-6 py-6 sm:px-6">
<form className="space-y-6">

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="title">Title</label>
<input className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright" id="title" name="title" placeholder="e.g., Campus Closure Notice" type="text" />
</div>
<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="publish_date">Publish Date</label>
<input className="block w-full rounded-DEFAULT border border-outline-variant px-3 py-2 text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors bg-surface-bright" id="publish_date" name="publish_date" type="date" />
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-1" htmlFor="body">Body Content</label>
<div className="border border-outline-variant rounded-DEFAULT overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-colors">
<div className="bg-surface-muted border-b border-outline-variant px-2 py-1 flex gap-1 items-center">
<button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded" title="Bold" type="button"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
<button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded" title="Italic" type="button"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
<button className="p-1 text-on-surface-variant hover:bg-surface-container-high rounded" title="Link" type="button"><span className="material-symbols-outlined text-[18px]">link</span></button>
</div>
<textarea className="block w-full border-0 px-3 py-2 text-body-md text-on-surface focus:ring-0 bg-surface-bright resize-y" id="body" name="body" placeholder="Write announcement details here..." rows={6}></textarea>
</div>
</div>

<div className="flex items-center justify-between p-4 border border-outline-variant rounded-DEFAULT bg-surface-bright">
<div>
<h3 className="font-label-md text-label-md text-on-surface">Immediate Visibility</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Make active upon saving</p>
</div>

<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked className="sr-only peer" type="checkbox" value="" />
<div className="w-11 h-6 bg-surface-variant rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-defaultChecked:after:translate-x-full peer-defaultChecked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-defaultChecked:bg-primary-container border border-outline-variant peer-defaultChecked:border-primary-container"></div>
</label>
</div>
</form>
</div>

<div className="flex flex-shrink-0 justify-end gap-3 px-6 py-4 border-t border-outline-variant bg-surface-muted">
<button className="px-4 py-2 bg-transparent text-on-surface-variant border border-outline-variant font-label-md text-label-md rounded-DEFAULT hover:bg-surface-container-low hover:text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary" onClick={() => { document.getElementById('slideOverPanel')?.classList.remove('active') }} type="button">
                            Cancel
                        </button>
<button className="px-4 py-2 bg-primary-container text-white font-label-md text-label-md rounded-DEFAULT hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container shadow-sm" type="submit">
                            Save Announcement
                        </button>
</div>
</div>
</div>
</div>
</div>
    </>
  );
}
