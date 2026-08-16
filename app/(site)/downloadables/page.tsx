import Link from "next/link";

export default function Page() {
  return (
    <>

<main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">

<header className="mb-12 border-l-4 border-primary pl-6">
<h1 className="font-display-lg text-display-lg text-on-surface mb-4">Downloadable Resources</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                Access official school forms, templates, and administrative documents. Ensure you have the latest versions before submission.
            </p>
</header>
<div className="flex flex-col md:flex-row gap-8">

<aside className="w-full md:w-64 shrink-0">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 sticky top-28">
<h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-6 border-b border-outline-variant pb-2">Categories</h2>
<ul className="space-y-2">
<li>
<button className="w-full text-left font-label-md text-label-md text-primary bg-primary-fixed rounded px-4 py-2 font-bold transition-colors">
                                All Documents
                            </button>
</li>
<li>
<button className="w-full text-left font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low rounded px-4 py-2 transition-colors">
                                Enrollment Forms
                            </button>
</li>
<li>
<button className="w-full text-left font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low rounded px-4 py-2 transition-colors">
                                Faculty Templates
                            </button>
</li>
<li>
<button className="w-full text-left font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low rounded px-4 py-2 transition-colors">
                                Student Memos
                            </button>
</li>
<li>
<button className="w-full text-left font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low rounded px-4 py-2 transition-colors">
                                HR Documents
                            </button>
</li>
</ul>
</div>
</aside>

<div className="flex-grow">
<div className="mb-6 flex justify-between items-center bg-surface-container-lowest p-4 border border-outline-variant rounded-lg">
<div className="relative w-full max-w-md">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" data-icon="search">search</span>
<input className="w-full pl-10 pr-4 py-2 border border-outline-variant rounded focus:border-primary focus:ring-2 focus:ring-primary/10 font-body-md text-body-md bg-transparent" placeholder="Search documents..." type="text" />
</div>
<div className="hidden sm:flex items-center gap-2">
<span className="font-label-md text-label-md text-on-surface-variant">Sort by:</span>
<select className="border border-outline-variant rounded px-2 py-1 font-body-md text-body-md bg-transparent focus:border-primary focus:ring-0">
<option>Date Updated (Newest)</option>
<option>Name (A-Z)</option>
</select>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
<div className="bg-error-container text-error rounded p-3 flex-shrink-0">
<span className="material-symbols-outlined text-[32px]" data-icon="picture_as_pdf">picture_as_pdf</span>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary transition-colors text-xl">Personal Data Sheet (PDS)</h3>
<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]" data-icon="folder">folder</span> Faculty Templates</span>
<span>CS Form No. 212, Revised 2017</span>
</div>
<div className="flex gap-4 mt-3 text-on-surface-variant font-label-sm text-label-sm opacity-80">
<span>PDF</span>
<span>•</span>
<span>1.2 MB</span>
<span>•</span>
<span>Updated: Oct 12, 2023</span>
</div>
</div>
<button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-4 py-2 rounded shrink-0 transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
<span className="hidden sm:inline">Download</span>
</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
<div className="bg-tertiary-container text-tertiary rounded p-3 flex-shrink-0">
<span className="material-symbols-outlined text-[32px]" data-icon="description">description</span>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary transition-colors text-xl">Request for Form 137</h3>
<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]" data-icon="folder">folder</span> Student Memos</span>
<span>Permanent Record Request</span>
</div>
<div className="flex gap-4 mt-3 text-on-surface-variant font-label-sm text-label-sm opacity-80">
<span>DOCX</span>
<span>•</span>
<span>450 KB</span>
<span>•</span>
<span>Updated: Sep 05, 2023</span>
</div>
</div>
<button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-4 py-2 rounded shrink-0 transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
<span className="hidden sm:inline">Download</span>
</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
<div className="bg-secondary-container text-on-secondary-container rounded p-3 flex-shrink-0">
<span className="material-symbols-outlined text-[32px]" data-icon="table">table</span>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary transition-colors text-xl">Class Schedule Template</h3>
<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]" data-icon="folder">folder</span> Faculty Templates</span>
<span>SY 2024-2025 Standard Format</span>
</div>
<div className="flex gap-4 mt-3 text-on-surface-variant font-label-sm text-label-sm opacity-80">
<span>XLSX</span>
<span>•</span>
<span>2.1 MB</span>
<span>•</span>
<span>Updated: Aug 20, 2023</span>
</div>
</div>
<button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-4 py-2 rounded shrink-0 transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
<span className="hidden sm:inline">Download</span>
</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex items-start gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
<div className="bg-error-container text-error rounded p-3 flex-shrink-0">
<span className="material-symbols-outlined text-[32px]" data-icon="picture_as_pdf">picture_as_pdf</span>
</div>
<div className="flex-grow min-w-0">
<h3 className="font-headline-md text-headline-md text-on-surface truncate group-hover:text-primary transition-colors text-xl">Learner Enrollment Form (LEF)</h3>
<div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-on-surface-variant font-label-sm text-label-sm">
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]" data-icon="folder">folder</span> Enrollment Forms</span>
<span>Basic Education Enrollment</span>
</div>
<div className="flex gap-4 mt-3 text-on-surface-variant font-label-sm text-label-sm opacity-80">
<span>PDF</span>
<span>•</span>
<span>850 KB</span>
<span>•</span>
<span>Updated: Jul 15, 2023</span>
</div>
</div>
<button className="bg-transparent border border-primary text-primary hover:bg-primary hover:text-on-primary font-label-md text-label-md px-4 py-2 rounded shrink-0 transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
<span className="hidden sm:inline">Download</span>
</button>
</div>
</div>
<div className="mt-8 flex justify-center">
<button className="font-label-md text-label-md text-primary border border-primary px-6 py-2 rounded hover:bg-primary-fixed transition-colors">
                        Load More Documents
                    </button>
</div>
</div>
</div>
</main>

    </>
  );
}
