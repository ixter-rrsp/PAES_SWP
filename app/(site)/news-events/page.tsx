import Link from "next/link";

export default function Page() {
  return (
    <>

<main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-gutter">

<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-2">News &amp; Events</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Stay updated with the latest announcements and school activities.</p>
</div>

<div className="flex bg-surface-container-low p-1 rounded-lg border border-outline-variant">
<button className="flex items-center gap-2 px-4 py-2 bg-surface text-primary rounded-md shadow-sm border border-outline-variant font-label-md text-label-md transition-all" id="listViewBtn">
<span className="material-symbols-outlined text-[20px]" style={{fontVariationSettings: "'FILL' 1"}}>view_list</span>
                    List View
                </button>
<button className="flex items-center gap-2 px-4 py-2 text-on-surface-variant hover:text-primary rounded-md font-label-md text-label-md transition-all" id="gridViewBtn">
<span className="material-symbols-outlined text-[20px]">calendar_view_month</span>
                    Calendar Grid
                </button>
</div>
</div>

<div className="bg-surface rounded-lg border border-outline-variant p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
<div className="relative w-full md:w-96">
<span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-on-surface placeholder-on-surface-variant" placeholder="Search events or announcements..." type="text" />
</div>
<div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
<button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-primary text-primary bg-primary/5 font-label-md text-label-md hover:bg-primary/10 transition-colors">All</button>
<button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:border-primary hover:text-primary transition-colors">Announcements</button>
<button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:border-primary hover:text-primary transition-colors">Academics</button>
<button className="whitespace-nowrap px-4 py-1.5 rounded-full border border-outline-variant text-on-surface-variant font-label-md text-label-md hover:border-primary hover:text-primary transition-colors">Extracurricular</button>
</div>
</div>

<div className="flex flex-col gap-6" id="listViewContainer">

<article className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col md:flex-row relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
<div className="md:w-1/4 bg-surface-container-lowest p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-outline-variant">
<span className="font-label-sm text-label-sm text-primary mb-1 uppercase tracking-wider">Announcement</span>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg text-on-background">15</span>
<span className="font-body-md text-body-md text-on-surface-variant">August 2024</span>
</div>
</div>
<div className="p-6 md:w-3/4 flex flex-col justify-between">
<div>
<h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:text-primary transition-colors">Enrollment Period for SY 2024-2025</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">The official enrollment period for the upcoming school year will begin on August 15 and run until August 30. Parents are advised to prepare the necessary documentation.</p>
</div>
<div className="mt-4 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">location_on</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">Main Campus / Online Portal</span>
</div>
<button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">Read More <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
</div>
</div>
</article>

<article className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col md:flex-row relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
<div className="md:w-1/4 bg-surface-container-lowest p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-outline-variant">
<span className="font-label-sm text-label-sm text-secondary mb-1 uppercase tracking-wider">Event</span>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg text-on-background">22</span>
<span className="font-body-md text-body-md text-on-surface-variant">August 2024</span>
</div>
</div>
<div className="p-6 md:w-3/4 flex flex-col justify-between">
<div>
<h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:text-primary transition-colors">Brigada Eskwela Kick-off Ceremony</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">Join us as we prepare our school facilities for the safe return of our students. Volunteers are welcome to participate in painting, cleaning, and minor repairs.</p>
</div>
<div className="mt-4 flex items-center justify-between">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">7:00 AM - 12:00 PM</span>
</div>
<button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">Read More <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
</div>
</div>
</article>

<article className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col md:flex-row relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
<div className="md:w-1/4 bg-surface-container-lowest p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-outline-variant">
<span className="font-label-sm text-label-sm text-primary mb-1 uppercase tracking-wider">Meeting</span>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg text-on-background">05</span>
<span className="font-body-md text-body-md text-on-surface-variant">September 2024</span>
</div>
</div>
<div className="p-6 md:w-3/4 flex flex-col justify-between">
<div>
<h3 className="font-headline-md text-headline-md text-on-background mb-2 group-hover:text-primary transition-colors">General PTA Assembly</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">First general assembly for the Parents-Teachers Association to discuss school policies, grading systems, and upcoming projects for the academic year.</p>
</div>
<div className="mt-4 flex items-center justify-between">
<div className="flex flex-wrap gap-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">1:00 PM</span>
</div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[16px] text-on-surface-variant">location_on</span>
<span className="font-label-sm text-label-sm text-on-surface-variant">School Gymnasium</span>
</div>
</div>
<button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">Read More <span className="material-symbols-outlined text-[16px]">arrow_forward</span></button>
</div>
</div>
</article>
</div>

<div className="hidden" id="gridViewContainer">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<article className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<div className="h-2 w-full bg-primary"></div>
<div className="p-6 flex flex-col flex-grow">
<div className="flex justify-between items-start mb-4">
<div className="bg-surface-container-low px-3 py-1 rounded-md text-center">
<span className="block font-headline-md text-headline-md text-primary font-bold">15</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Aug</span>
</div>
<span className="font-label-sm text-label-sm text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded">Announcement</span>
</div>
<h3 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-background mb-2 group-hover:text-primary transition-colors">Enrollment Period for SY 2024-2025</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">The official enrollment period for the upcoming school year will begin on August 15 and run until August 30. Parents are advised to prepare the necessary documentation.</p>
<div className="mt-auto border-t border-outline-variant pt-4 flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Main Campus</span>
<button className="text-primary hover:text-primary-container transition-colors p-1 rounded-full hover:bg-primary/5">
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</article>

<article className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<div className="h-2 w-full bg-secondary"></div>
<div className="p-6 flex flex-col flex-grow">
<div className="flex justify-between items-start mb-4">
<div className="bg-surface-container-low px-3 py-1 rounded-md text-center">
<span className="block font-headline-md text-headline-md text-secondary font-bold">22</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Aug</span>
</div>
<span className="font-label-sm text-label-sm text-secondary border border-secondary/20 bg-secondary/5 px-2 py-1 rounded">Event</span>
</div>
<h3 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-background mb-2 group-hover:text-secondary transition-colors">Brigada Eskwela Kick-off Ceremony</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">Join us as we prepare our school facilities for the safe return of our students. Volunteers are welcome to participate in painting, cleaning, and minor repairs.</p>
<div className="mt-auto border-t border-outline-variant pt-4 flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> 7:00 AM</span>
<button className="text-secondary hover:text-secondary-container transition-colors p-1 rounded-full hover:bg-secondary/5">
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</article>

<article className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<div className="h-2 w-full bg-primary"></div>
<div className="p-6 flex flex-col flex-grow">
<div className="flex justify-between items-start mb-4">
<div className="bg-surface-container-low px-3 py-1 rounded-md text-center">
<span className="block font-headline-md text-headline-md text-primary font-bold">05</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Sep</span>
</div>
<span className="font-label-sm text-label-sm text-primary border border-primary/20 bg-primary/5 px-2 py-1 rounded">Meeting</span>
</div>
<h3 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-background mb-2 group-hover:text-primary transition-colors">General PTA Assembly</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">First general assembly for the Parents-Teachers Association to discuss school policies, grading systems, and upcoming projects for the academic year.</p>
<div className="mt-auto border-t border-outline-variant pt-4 flex items-center justify-between">
<span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> Gymnasium</span>
<button className="text-primary hover:text-primary-container transition-colors p-1 rounded-full hover:bg-primary/5">
<span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</div>
</article>

<article className="bg-surface rounded-lg border border-outline-variant overflow-hidden flex flex-col relative group hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow opacity-60">
<div className="h-2 w-full bg-on-surface-variant"></div>
<div className="p-6 flex flex-col flex-grow">
<div className="flex justify-between items-start mb-4">
<div className="bg-surface-container-highest px-3 py-1 rounded-md text-center">
<span className="block font-headline-md text-headline-md text-on-surface-variant font-bold">10</span>
<span className="block font-label-sm text-label-sm text-on-surface-variant uppercase">Jul</span>
</div>
<span className="font-label-sm text-label-sm text-on-surface-variant border border-on-surface-variant/20 bg-surface-container-high px-2 py-1 rounded">Past Event</span>
</div>
<h3 className="font-headline-md text-[20px] leading-[28px] font-semibold text-on-background mb-2 line-through">Early Registration Cutoff</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4 flex-grow">Deadline for early registration for transferring students from other divisions.</p>
</div>
</article>
</div>
</div>

<div className="mt-12 flex justify-center items-center gap-2">
<button className="p-2 text-on-surface-variant hover:text-primary disabled:opacity-50" disabled><span className="material-symbols-outlined">chevron_left</span></button>
<button className="w-8 h-8 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center justify-center">1</button>
<button className="w-8 h-8 rounded-full text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center transition-colors">2</button>
<button className="w-8 h-8 rounded-full text-on-surface-variant hover:bg-surface-container-high font-label-md text-label-md flex items-center justify-center transition-colors">3</button>
<span className="text-on-surface-variant">...</span>
<button className="p-2 text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined">chevron_right</span></button>
</div>
</main>

    </>
  );
}
