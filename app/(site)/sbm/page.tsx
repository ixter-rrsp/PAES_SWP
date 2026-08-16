"use client";

import Link from "next/link";

function toggleAccordion(button: HTMLButtonElement) {
  const content = button.nextElementSibling as HTMLElement | null;
  const icon = button.querySelector(".accordion-icon");
  if (!content || !icon) return;

  if (content.classList.contains("expanded")) {
    content.classList.remove("expanded");
    icon.classList.remove("rotated");
  } else {
    document.querySelectorAll(".accordion-content.expanded").forEach((el) => {
      if (el !== content) {
        el.classList.remove("expanded");
        el.previousElementSibling?.querySelector(".accordion-icon")?.classList.remove("rotated");
      }
    });
    content.classList.add("expanded");
    icon.classList.add("rotated");
  }
}

export default function Page() {
  return (
    <>

<main className="flex-grow pt-24 pb-margin-desktop px-margin-desktop md:px-margin-desktop max-w-container-max mx-auto w-full">

<div className="mb-12">
<h1 className="font-display-lg text-display-lg text-primary mb-4">School-Based Management</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
                Transparency and accountability are the cornerstones of our School-Based Management (SBM) system. Access comprehensive reports, financial disclosures, and operational documents detailing our school's performance and governance.
            </p>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 flex flex-col gap-base">

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<button className="w-full flex items-center justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-low transition-colors" onClick={(e) => toggleAccordion(e.currentTarget)}>
<div className="flex items-center gap-4">
<div className="w-1.5 h-8 bg-primary rounded-full"></div>
<h2 className="font-headline-md text-headline-md text-on-surface">School Year 2024-2025</h2>
<span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded font-label-sm text-label-sm ml-2">Current</span>
</div>
<span className="material-symbols-outlined text-on-surface-variant accordion-icon rotated">expand_more</span>
</button>
<div className="accordion-content expanded px-6 pb-6 bg-surface-container-lowest">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">

<a className="flex items-start gap-3 p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface transition-all group" href="#">
<span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span>
<div>
<h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Annual Implementation Plan (AIP)</h3>
<p className="font-body-md text-body-md text-sm text-on-surface-variant mt-1">Detailed strategic goals and budgetary allocations for the current year.</p>
</div>
</a>

<a className="flex items-start gap-3 p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface transition-all group" href="#">
<span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span>
<div>
<h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">School Improvement Plan (SIP)</h3>
<p className="font-body-md text-body-md text-sm text-on-surface-variant mt-1">Three-year roadmap outlining developmental priorities.</p>
</div>
</a>

<a className="flex items-start gap-3 p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface transition-all group" href="#">
<span className="material-symbols-outlined text-secondary group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
<div>
<h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Q1 Transparency Board</h3>
<p className="font-body-md text-body-md text-sm text-on-surface-variant mt-1">Financial report for the first quarter.</p>
</div>
</a>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<button className="w-full flex items-center justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-low transition-colors" onClick={(e) => toggleAccordion(e.currentTarget)}>
<div className="flex items-center gap-4">
<div className="w-1.5 h-8 bg-surface-dim rounded-full"></div>
<h2 className="font-headline-md text-headline-md text-on-surface">School Year 2023-2024</h2>
</div>
<span className="material-symbols-outlined text-on-surface-variant accordion-icon">expand_more</span>
</button>
<div className="accordion-content px-6 bg-surface-container-lowest">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pb-6">

<a className="flex items-start gap-3 p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface transition-all group" href="#">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 1"}}>folder</span>
<div>
<h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Year-End Assessment Report</h3>
<p className="font-body-md text-body-md text-sm text-on-surface-variant mt-1">Comprehensive review of academic and operational targets.</p>
</div>
</a>

<a className="flex items-start gap-3 p-4 rounded-lg border border-outline-variant hover:border-primary hover:bg-surface transition-all group" href="#">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" style={{fontVariationSettings: "'FILL' 1"}}>description</span>
<div>
<h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors">Annual Financial Disclosure</h3>
<p className="font-body-md text-body-md text-sm text-on-surface-variant mt-1">Audited financial statements for the previous year.</p>
</div>
</a>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0px_4px_12px_rgba(0,0,0,0.05)] transition-shadow">
<button className="w-full flex items-center justify-between p-6 bg-surface-container-lowest hover:bg-surface-container-low transition-colors" onClick={(e) => toggleAccordion(e.currentTarget)}>
<div className="flex items-center gap-4">
<div className="w-1.5 h-8 bg-surface-dim rounded-full"></div>
<h2 className="font-headline-md text-headline-md text-on-surface">School Year 2022-2023</h2>
</div>
<span className="material-symbols-outlined text-on-surface-variant accordion-icon">expand_more</span>
</button>
<div className="accordion-content px-6 bg-surface-container-lowest">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pb-6">
<div className="col-span-1 sm:col-span-2 text-center py-8">
<p className="text-on-surface-variant font-body-md text-body-md">Archived documents are available upon formal request to the administrative office.</p>
<button className="mt-4 border border-primary text-primary px-4 py-2 rounded font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors">Request Archive Access</button>
</div>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 flex flex-col gap-base">

<div className="bg-primary-container text-on-primary-container p-6 rounded-xl border border-outline-variant">
<h3 className="font-headline-md text-headline-md font-bold mb-2">Need Clarification?</h3>
<p className="font-body-md text-body-md mb-6">If you have questions regarding any of the documents provided in the SBM portal, please reach out to the SBM Coordinator.</p>
<div className="flex items-center gap-4 bg-surface-container-lowest/20 p-4 rounded-lg">
<div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center overflow-hidden">
<img className="object-cover w-full h-full" data-alt="A professional headshot of a middle-aged Filipino educator with a warm smile, wearing a formal DepEd uniform polo. The lighting is bright and even, set against a neutral, slightly blurred office background. The style is a high-quality, realistic corporate portrait conveying approachability and authority." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMzxQK3FKLBpdFEN9ulfnM4TN5CkhDCik_mS5mlRUB7xMUADp2HZTNMoZmNjbXTTQiChNxtGxA15Gj_gfEoTeOeB4nbcRyh1DiocJDK-Hr_E3XXvjm4N-aFoaNS5lLHP6KD9ZmGZ95B1HNMPtByqFKuBtJK5alHabxWqnlTbJZDHvLUnFaZpxGc8TdOMPb1MwhyzbjpXXLT8VwTrXw25FOuetIAeFi9WmyguFBMP7Q44kGu4shHn79" />
</div>
<div>
<p className="font-label-md text-label-md font-bold">Mr. Juan Dela Cruz</p>
<p className="font-label-sm text-label-sm opacity-90">SBM Coordinator</p>
</div>
</div>
<button className="w-full mt-4 bg-surface-container-lowest text-primary px-4 py-2 rounded font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">mail</span>
                        Contact Coordinator
                    </button>
</div>

<div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant flex items-start gap-4">
<span className="material-symbols-outlined text-secondary text-3xl" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
<div>
<h4 className="font-label-md text-label-md font-bold text-on-surface mb-1">Commitment to Transparency</h4>
<p className="font-body-md text-body-md text-sm text-on-surface-variant">We adhere strictly to the DepEd mandate on public disclosure of information, ensuring all stakeholders are informed of school operations and fiscal management.</p>
</div>
</div>
</div>
</div>
</main>

    </>
  );
}
