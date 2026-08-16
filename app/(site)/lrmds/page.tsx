import Link from "next/link";

export default function Page() {
  return (
    <>

<div className="flex-1 max-w-container-max mx-auto w-full flex flex-col md:flex-row py-gutter px-margin-mobile md:px-margin-desktop gap-gutter">

<aside className="w-full md:w-[280px] flex flex-col gap-gutter shrink-0">
<div className="bg-surface-container-low p-gutter rounded border border-outline-variant">
<h3 className="font-headline-md text-headline-md mb-base text-primary">Filters</h3>
<div className="mb-gutter">
<h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-base">Grade Level</h4>
<div className="flex flex-col gap-2">
<label className="flex items-center gap-2 cursor-pointer group">
<input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">Kindergarten</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">Grades 1-3</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input defaultChecked className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors text-primary font-medium">Grades 4-6</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">Junior High</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">Senior High</span>
</label>
</div>
</div>
<div>
<h4 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-base">Subject Area</h4>
<div className="flex flex-col gap-2">
<label className="flex items-center gap-2 cursor-pointer group">
<input defaultChecked className="border-outline-variant text-primary focus:ring-primary" name="subject" type="radio" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors text-primary font-medium">Science</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="border-outline-variant text-primary focus:ring-primary" name="subject" type="radio" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">Mathematics</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="border-outline-variant text-primary focus:ring-primary" name="subject" type="radio" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">English</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="border-outline-variant text-primary focus:ring-primary" name="subject" type="radio" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">Filipino</span>
</label>
<label className="flex items-center gap-2 cursor-pointer group">
<input className="border-outline-variant text-primary focus:ring-primary" name="subject" type="radio" />
<span className="font-body-md text-body-md group-hover:text-primary transition-colors">Araling Panlipunan</span>
</label>
</div>
</div>
</div>

<div className="bg-primary-container p-gutter rounded text-on-primary-container flex flex-col items-center text-center">
<span className="material-symbols-outlined text-[48px] mb-base" data-icon="cloud_upload" style={{fontVariationSettings: "'FILL' 1"}}>cloud_upload</span>
<h4 className="font-headline-md text-[20px] font-bold mb-2">Contribute</h4>
<p className="font-body-md text-sm mb-4">Faculty members can upload new modules here.</p>
<button className="bg-surface text-primary px-4 py-2 rounded font-label-md w-full hover:bg-surface-container-high transition-colors">Upload Resource</button>
</div>
</aside>

<main className="flex-1 flex flex-col gap-gutter">
<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-base border-b border-outline-variant pb-base">
<div>
<h1 className="font-display-lg text-[32px] md:text-display-lg text-primary">Learning Resources</h1>
<p className="font-body-md text-on-surface-variant">Showing 24 modules for Grades 4-6 &gt; Science</p>
</div>
<div className="flex items-center gap-2 text-sm">
<span className="text-on-surface-variant">View:</span>
<button className="p-1 bg-surface-container-high rounded text-primary"><span className="material-symbols-outlined" data-icon="grid_view" style={{fontVariationSettings: "'FILL' 1"}}>grid_view</span></button>
<button className="p-1 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined" data-icon="view_list">view_list</span></button>
</div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-base md:gap-gutter">

<div className="bg-surface-container-lowest border border-outline-variant rounded p-base flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-primary transition-all group cursor-pointer h-[180px]">
<div className="flex justify-between items-start mb-auto">
<div className="bg-surface-container-low p-2 rounded-full">
<span className="material-symbols-outlined text-secondary text-[24px]" data-icon="folder_open" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span>
</div>
<span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-sm text-[10px] uppercase">Module</span>
</div>
<div>
<h3 className="font-headline-md text-[16px] leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">Q1: Matter and its Properties</h3>
<p className="font-body-md text-[12px] text-on-surface-variant">Grade 4 • 12 Files</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded p-base flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-primary transition-all group cursor-pointer h-[180px]">
<div className="flex justify-between items-start mb-auto">
<div className="bg-surface-container-low p-2 rounded-full">
<span className="material-symbols-outlined text-secondary text-[24px]" data-icon="folder_open" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span>
</div>
<span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-sm text-[10px] uppercase">Module</span>
</div>
<div>
<h3 className="font-headline-md text-[16px] leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">Q2: Living Things and Their Environment</h3>
<p className="font-body-md text-[12px] text-on-surface-variant">Grade 4 • 8 Files</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded p-base flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-primary transition-all group cursor-pointer h-[180px]">
<div className="flex justify-between items-start mb-auto">
<div className="bg-surface-container-low p-2 rounded-full">
<span className="material-symbols-outlined text-secondary text-[24px]" data-icon="folder_open" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span>
</div>
<span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-1 rounded font-label-sm text-[10px] uppercase">Activity</span>
</div>
<div>
<h3 className="font-headline-md text-[16px] leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">Plant Reproduction Experiment Guides</h3>
<p className="font-body-md text-[12px] text-on-surface-variant">Grade 5 • 3 Files</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded p-base flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-primary transition-all group cursor-pointer h-[180px]">
<div className="flex justify-between items-start mb-auto">
<div className="bg-surface-container-low p-2 rounded-full">
<span className="material-symbols-outlined text-secondary text-[24px]" data-icon="folder_open" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span>
</div>
<span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-sm text-[10px] uppercase">Module</span>
</div>
<div>
<h3 className="font-headline-md text-[16px] leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">Q3: Force, Motion, and Energy</h3>
<p className="font-body-md text-[12px] text-on-surface-variant">Grade 6 • 15 Files</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded p-base flex flex-col hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] hover:border-primary transition-all group cursor-pointer h-[180px]">
<div className="flex justify-between items-start mb-auto">
<div className="bg-surface-container-low p-2 rounded-full">
<span className="material-symbols-outlined text-secondary text-[24px]" data-icon="folder_open" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span>
</div>
<span className="bg-surface-container-highest text-on-surface px-2 py-1 rounded font-label-sm text-[10px] uppercase">Assessment</span>
</div>
<div>
<h3 className="font-headline-md text-[16px] leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-2">Quarterly Science Summative Tests</h3>
<p className="font-body-md text-[12px] text-on-surface-variant">Grades 4-6 • 9 Files</p>
</div>
</div>
</div>

<div className="flex justify-center items-center gap-2 mt-gutter">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"><span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span></button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary font-label-md">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container-low font-label-md">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface hover:bg-surface-container-low font-label-md">3</button>
<span className="text-on-surface-variant">...</span>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"><span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span></button>
</div>
</main>
</div>

    </>
  );
}
