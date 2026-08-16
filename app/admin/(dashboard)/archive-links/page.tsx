"use client";

import Link from "next/link";

// Placeholder handlers from the original Stitch design (not yet wired to real state/backend)
function activateEditMode(itemLabel: string) {
  console.log("Edit mode activated for:", itemLabel);
}
function resetForm() {
  console.log("Form reset");
}

export default function Page() {
  return (
    <>

<div className="flex justify-between items-end mb-6">
<div>
<h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface">Archive Links Manager</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Manage external drive links, downloadables, and repository resources.</p>
</div>
</div>

<div className="flex gap-gutter items-start h-[calc(100%-80px)]">

<div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-DEFAULT flex flex-col h-full overflow-hidden shadow-sm">

<div className="flex items-center justify-between p-4 border-b border-outline-variant bg-surface-muted">
<div className="flex gap-2">
<select className="font-label-md text-label-md border border-outline-variant rounded-DEFAULT bg-surface-container-lowest py-1.5 px-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none">
<option>All Sections</option>
<option>SLMS</option>
<option>LRMDS</option>
<option>Downloadables</option>
</select>
<select className="font-label-md text-label-md border border-outline-variant rounded-DEFAULT bg-surface-container-lowest py-1.5 px-3 focus:ring-1 focus:ring-primary focus:border-primary outline-none">
<option>All School Years</option>
<option>2023-2024</option>
<option>2022-2023</option>
</select>
</div>
<span className="font-body-sm text-body-sm text-on-surface-variant">Showing 241 records</span>
</div>

<div className="overflow-auto flex-1 no-scrollbar">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-high sticky top-0 z-10 border-b border-outline-variant">
<tr>
<th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold w-1/4">Title</th>
<th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold">Section</th>
<th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold">Grade Level</th>
<th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold">School Year</th>
<th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold">Category</th>
<th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold text-center">Visibility</th>
<th className="py-density-md px-4 font-label-md text-label-md text-on-surface font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/50">

<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => { activateEditMode('Q1 Science Modules') }}>
<td className="py-density-md px-4 font-label-md text-label-md text-on-surface">Q1 Science Modules (Core)</td>
<td className="py-density-md px-4">
<span className="inline-block px-2 py-0.5 bg-tertiary-fixed text-on-tertiary-fixed-variant rounded-DEFAULT font-label-md text-[10px] tracking-wider uppercase">SLMS</span>
</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">Grade 7</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">2023-2024</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">Modules</td>
<td className="py-density-md px-4 text-center">
<div className="inline-flex items-center justify-center">
<div className="w-2 h-2 rounded-full bg-status-published shadow-[0_0_4px_rgba(0,110,12,0.4)]"></div>
</div>
</td>
<td className="py-density-md px-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100 ml-1">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => { activateEditMode('Math 8 Curriculum Guide') }}>
<td className="py-density-md px-4 font-label-md text-label-md text-on-surface">Math 8 Curriculum Guide</td>
<td className="py-density-md px-4">
<span className="inline-block px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed-variant rounded-DEFAULT font-label-md text-[10px] tracking-wider uppercase">LRMDS</span>
</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">Grade 8</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">2023-2024</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">Curriculum</td>
<td className="py-density-md px-4 text-center">
<div className="inline-flex items-center justify-center">
<div className="w-2 h-2 rounded-full bg-status-published shadow-[0_0_4px_rgba(0,110,12,0.4)]"></div>
</div>
</td>
<td className="py-density-md px-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100 ml-1">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer bg-surface-container-low/30" onClick={() => { activateEditMode('Historical Event Photos') }}>
<td className="py-density-md px-4 font-label-md text-label-md text-on-surface-variant">Historical Event Photos</td>
<td className="py-density-md px-4">
<span className="inline-block px-2 py-0.5 bg-surface-variant text-on-surface-variant rounded-DEFAULT font-label-md text-[10px] tracking-wider uppercase border border-outline-variant/50">Downloadables</span>
</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">All Levels</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">2022-2023</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">Media</td>
<td className="py-density-md px-4 text-center">
<div className="inline-flex items-center justify-center">
<div className="w-2 h-2 rounded-full bg-surface-variant"></div>
</div>
</td>
<td className="py-density-md px-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100 ml-1">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group cursor-pointer" onClick={() => { activateEditMode('Faculty Manual V2') }}>
<td className="py-density-md px-4 font-label-md text-label-md text-on-surface">Faculty Manual V2</td>
<td className="py-density-md px-4">
<span className="inline-block px-2 py-0.5 bg-surface-variant text-on-surface-variant rounded-DEFAULT font-label-md text-[10px] tracking-wider uppercase border border-outline-variant/50">Downloadables</span>
</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">N/A</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">2023-2024</td>
<td className="py-density-md px-4 font-body-sm text-body-sm text-on-surface-variant">Policies</td>
<td className="py-density-md px-4 text-center">
<div className="inline-flex items-center justify-center">
<div className="w-2 h-2 rounded-full bg-status-published shadow-[0_0_4px_rgba(0,110,12,0.4)]"></div>
</div>
</td>
<td className="py-density-md px-4 text-right">
<button className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error transition-colors focus:outline-none p-1 opacity-0 group-hover:opacity-100 ml-1">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="w-80 flex-shrink-0 bg-surface-container-lowest border border-outline-variant rounded-DEFAULT flex flex-col h-full shadow-sm">
<div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-muted">
<h3 className="font-headline-sm text-headline-sm font-semibold text-on-surface text-[16px]" id="form-title">Add New Link</h3>
<button className="text-on-surface-variant hover:text-on-surface focus:outline-none" onClick={() => { resetForm() }} title="Clear Form">
<span className="material-symbols-outlined text-[18px]">add_circle</span>
</button>
</div>
<div className="p-5 flex-1 overflow-y-auto space-y-4 no-scrollbar">

<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">Title</label>
<input className="w-full border border-outline-variant rounded-DEFAULT px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-surface-container-lowest" id="input-title" placeholder="e.g. Q1 Science Modules" type="text" />
</div>

<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">Section</label>
<div className="relative">
<select className="w-full border border-outline-variant rounded-DEFAULT px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-surface-container-lowest appearance-none">
<option value="slms">SLMS</option>
<option value="lrmds">LRMDS</option>
<option value="downloadables">Downloadables</option>
</select>
<span className="material-symbols-outlined absolute right-2 top-2.5 text-on-surface-variant pointer-events-none text-[18px]">expand_more</span>
</div>
</div>

<div className="grid grid-cols-2 gap-3">
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">Grade Level</label>
<input className="w-full border border-outline-variant rounded-DEFAULT px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-surface-container-lowest" placeholder="e.g. Grade 7" type="text" />
</div>
<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">School Year</label>
<input className="w-full border border-outline-variant rounded-DEFAULT px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-surface-container-lowest" placeholder="2023-2024" type="text" />
</div>
</div>

<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant">Category</label>
<input className="w-full border border-outline-variant rounded-DEFAULT px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-surface-container-lowest" placeholder="e.g. Modules, Media" type="text" />
</div>

<div className="flex flex-col gap-1">
<label className="font-label-md text-label-md text-on-surface-variant flex justify-between">
                                Drive URL
                                <span className="material-symbols-outlined text-[14px] text-on-surface-variant cursor-pointer hover:text-primary">link</span>
</label>
<textarea className="w-full border border-outline-variant rounded-DEFAULT px-3 py-2 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-colors bg-surface-container-lowest resize-none" placeholder="https://drive.google.com/..." rows={2}></textarea>
</div>

<div className="flex items-center justify-between pt-2 border-t border-outline-variant/50">
<div className="flex flex-col">
<span className="font-label-md text-label-md text-on-surface">Visibility Status</span>
<span className="font-body-sm text-[11px] text-on-surface-variant">Visible to front-end users</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input defaultChecked className="sr-only peer" type="checkbox" value="" />

<div className="w-9 h-5 bg-surface-variant rounded-full peer peer-defaultChecked:after:translate-x-full peer-defaultChecked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-outline-variant after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-defaultChecked:bg-primary-container"></div>
</label>
</div>
</div>

<div className="p-4 border-t border-outline-variant bg-surface-muted flex gap-2">
<button className="flex-1 bg-primary-container text-white font-label-md text-label-md py-2 rounded-DEFAULT hover:bg-primary transition-colors focus:ring-2 focus:ring-offset-1 focus:ring-primary focus:outline-none">Save Record</button>
</div>
</div>
</div>
    </>
  );
}
