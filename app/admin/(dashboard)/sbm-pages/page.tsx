"use client";

import Link from "next/link";

export default function Page() {
  return (
    <>

<div className="flex justify-between items-end mb-8">
<div>
<h1 className="font-headline-md text-headline-md text-on-surface mb-2">SBM Pages Manager</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Manage content and visibility for School Based Management yearly reports.</p>
</div>
<button className="bg-primary-container text-white font-label-lg text-label-lg px-4 py-2 rounded shadow-sm hover:bg-primary transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">add</span>
                    Create New Year
                </button>
</div>

<div className="space-y-4 max-w-5xl">

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden transition-all duration-200 shadow-sm">

<div className="px-density-lg py-4 flex items-center justify-between cursor-pointer border-b border-outline-variant bg-surface-muted/50 hover:bg-surface-container-low">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-primary-container transition-transform duration-200 rotate-90">chevron_right</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">SY 2024-2025</h3>
<span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-status-published font-label-md text-label-md border border-[#C8E6C9]">Published</span>
</div>
<div className="flex items-center gap-6" onClick={(event) => { event.stopPropagation(); }}>
<div className="flex items-center gap-2">
<span className="font-label-md text-label-md text-on-surface-variant">Visibility</span>
<div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer z-10 transition-all duration-200 defaultChecked:border-transparent defaultChecked:right-0 right-5 top-0" id="toggle_2024" name="toggle_2024" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-variant cursor-pointer transition-colors duration-200" htmlFor="toggle_2024"></label>
</div>
</div>
<button className="text-on-surface-variant hover:text-error transition-colors p-1" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</div>

<div className="p-density-lg bg-surface-container-lowest">
<div className="border border-outline-variant rounded flex flex-col focus-within:border-primary-container focus-within:ring-1 focus-within:ring-primary-container transition-all">

<div className="bg-surface-container-low border-b border-outline-variant p-2 flex items-center gap-1 rounded-t flex-wrap">
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">format_h1</span></button>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">format_h2</span></button>
<div className="w-px h-4 bg-outline-variant mx-1"></div>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors bg-surface-variant"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">format_underlined</span></button>
<div className="w-px h-4 bg-outline-variant mx-1"></div>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">format_list_numbered</span></button>
<div className="w-px h-4 bg-outline-variant mx-1"></div>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">link</span></button>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors"><span className="material-symbols-outlined text-[18px]">image</span></button>
<button className="p-1.5 rounded hover:bg-surface-variant text-on-surface-variant transition-colors ml-auto"><span className="material-symbols-outlined text-[18px]">code</span></button>
</div>

<textarea className="w-full h-64 p-4 font-body-md text-body-md text-on-surface bg-surface-container-lowest border-none focus:ring-0 resize-y rounded-b outline-none" placeholder="Enter content for this academic year..." defaultValue={`Welcome to the School Based Management (SBM) hub for the 2024-2025 academic year. 

**Key Initiatives this year:**
1. Implementation of new digital curriculum standards.
2. Community outreach expansion.
3. Facility upgrades in the Science block.

Please review the attached compliance documents below.`} />
</div>

<div className="flex justify-end items-center mt-4 gap-3">
<button className="font-label-lg text-label-lg text-on-surface-variant px-4 py-2 rounded border border-outline-variant hover:bg-surface-container-low transition-colors">
                                Discard Changes
                            </button>
<button className="font-label-lg text-label-lg text-white bg-primary-container px-6 py-2 rounded shadow-sm hover:bg-primary transition-colors">
                                Save Content
                            </button>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden transition-all duration-200">
<div className="px-density-lg py-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200">chevron_right</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">SY 2023-2024</h3>
<span className="px-2 py-0.5 rounded-full bg-[#E8F5E9] text-status-published font-label-md text-label-md border border-[#C8E6C9]">Published</span>
</div>
<div className="flex items-center gap-6" onClick={(event) => { event.stopPropagation(); }}>
<div className="flex items-center gap-2">
<span className="font-label-md text-label-md text-on-surface-variant">Visibility</span>
<div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer z-10 transition-all duration-200 defaultChecked:border-transparent defaultChecked:right-0 right-5 top-0" id="toggle_2023" name="toggle_2023" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-variant cursor-pointer transition-colors duration-200" htmlFor="toggle_2023"></label>
</div>
</div>
<button className="text-on-surface-variant hover:text-error transition-colors p-1" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden transition-all duration-200 opacity-75">
<div className="px-density-lg py-4 flex items-center justify-between cursor-pointer hover:bg-surface-container-low">
<div className="flex items-center gap-4">
<span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200">chevron_right</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface-variant">SY 2022-2023</h3>
<span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-status-draft font-label-md text-label-md border border-outline-variant">Archived</span>
</div>
<div className="flex items-center gap-6" onClick={(event) => { event.stopPropagation(); }}>
<div className="flex items-center gap-2">
<span className="font-label-md text-label-md text-outline">Visibility</span>
<div className="relative inline-block w-10 h-5 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer z-10 transition-all duration-200 defaultChecked:border-transparent defaultChecked:right-0 right-5 top-0" id="toggle_2022" name="toggle_2022" type="checkbox" />
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-variant cursor-pointer transition-colors duration-200" htmlFor="toggle_2022"></label>
</div>
</div>
<button className="text-on-surface-variant hover:text-error transition-colors p-1" title="Delete">
<span className="material-symbols-outlined text-[20px]">delete</span>
</button>
</div>
</div>
</div>
</div>
<div className="h-20"></div>
    </>
  );
}
