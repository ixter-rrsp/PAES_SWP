import Link from "next/link";

export default function Page() {
  return (
    <>

<main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-16 md:gap-32">

<section className="text-center max-w-3xl mx-auto flex flex-col gap-6">
<h1 className="font-display-lg text-display-lg text-primary">About Our School</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">
                Committed to nurturing the minds of tomorrow through quality education, 
                rooted in the values of the Department of Education.
            </p>
</section>

<section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
<div className="md:col-span-6 flex flex-col gap-6 pr-0 md:pr-12">
<div className="flex items-center gap-3 mb-2">
<div className="w-1 h-8 bg-primary rounded-full"></div>
<h2 className="font-headline-lg text-headline-lg text-primary">Our History</h2>
</div>
<p className="text-on-surface-variant">
                    Established in 1945, our institution has been a cornerstone of public education in the region. 
                    From a humble three-room schoolhouse, we have grown into a premier educational facility serving over 3,000 students annually.
                </p>
<p className="text-on-surface-variant">
                    Our legacy is built on the dedication of generations of educators who believed in the transformative power of learning, adapting to the modern digital age while preserving our core traditional values.
                </p>
</div>
<div className="md:col-span-6 rounded-xl overflow-hidden border border-outline-variant shadow-sm bg-surface">
<img className="w-full h-80 object-cover" data-alt="A historic black and white photograph of a Philippine public school building circa 1950, transitioning smoothly into a modern day full-color vibrant photograph of the same updated facility. Corporate modern aesthetic, high quality, professional lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPD5lwlb7RhPMCR2Nma3JpMx2xwGDwZMsxDtDJf5Hufn1qc15IoTLIbM-ldD-yMSVnfqClhxRroO5G_PuQbAaRYvDrKEps9XJppLFwR9jwKxdwRNZEu2GEn-TdUn1ffPGjBSata_3CxSIhoSNGJCBDrBIAUI5qU9FwycuEfEV1FPSeudAZbuaJ8JQfr_bWd2YRTBgN7es_PBbAftPvzsauVNkaTTZn0pP7kktBRl3GpMDd8Ge8IbM8" />
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">

<div className="md:col-span-6 bg-surface border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6">
<div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-on-secondary-container text-3xl">flag</span>
</div>
<h3 className="font-headline-md text-headline-md text-primary">The DepEd Mission</h3>
<p className="text-on-surface-variant">
                    To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:
                </p>
<ul className="flex flex-col gap-3 mt-2">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary text-xl mt-1">check_circle</span>
<span className="text-on-surface-variant">Students learn in a child-friendly, gender-sensitive, safe, and motivating environment.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-secondary text-xl mt-1">check_circle</span>
<span className="text-on-surface-variant">Teachers facilitate learning and constantly nurture every learner.</span>
</li>
</ul>
</div>

<div className="md:col-span-6 bg-surface border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6">
<div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center mb-2">
<span className="material-symbols-outlined text-on-primary-fixed text-3xl">visibility</span>
</div>
<h3 className="font-headline-md text-headline-md text-primary">The DepEd Vision</h3>
<p className="text-on-surface-variant">
                    We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.
                </p>
<p className="text-on-surface-variant font-medium mt-auto p-4 bg-surface-container-low rounded-lg border-l-4 border-secondary">
                    As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.
                </p>
</div>
</section>

<section className="flex flex-col gap-12 text-center items-center">
<div className="flex flex-col gap-4 max-w-2xl">
<h2 className="font-headline-lg text-headline-lg text-primary">Core Values (Maka-Diyos, Maka-tao, Makakalikasan, Makabansa)</h2>
<p className="text-on-surface-variant">Our foundation rests on these four pillars that guide our students and faculty every single day.</p>
</div>
<div className="w-full rounded-xl overflow-hidden border border-outline-variant shadow-sm h-64 md:h-96 relative">
<img className="w-full h-full object-cover" data-alt="A diverse group of cheerful Filipino public school students in crisp uniforms raising the Philippine flag in a sunlit courtyard. Professional, inspiring, government educational setting, bright morning light, corporate modern visual language." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAHToFtz-JfU7nCMlYZCohjEOqTeldf7OPa9-awvEnrK5Gd6pIFitkuHwtE9oSUYcAm0HIplqk8bNogYGHYd3_cXAjW8tgN-ue8DSjY2ws9zQ0QBR-5Uw5xg30ETHKYyyNtNmREvOwz-Btv_V0Vjk2Y4TxnrrfXc33jSCY7YAhMc3MGU357G72YGHgmMcmbHXWGNJRd3Arlht5PQa9cUIpyqrIJl8V8F4D9GZ2kC9sCi71uT6Qz938Q" />
<div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 to-transparent flex items-end p-8">
<p className="text-inverse-on-surface font-headline-md text-headline-md max-w-3xl text-left">
                         "Building a nation of lifelong learners, one student at a time."
                     </p>
</div>
</div>
</section>
</main>

    </>
  );
}
