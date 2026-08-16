import Link from "next/link";

export default function Page() {
  return (
    <>

<main className="flex-grow">

<section className="relative bg-surface-container-low py-16 md:py-32 overflow-hidden">
<div className="absolute inset-0 z-0 opacity-10" data-alt="A subtle, modern architectural pattern inspired by Philippine public school buildings. Light gray on white, geometric lines, clean and professional, bright lighting. Designed as a faint background texture for a modern website." style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBS0B0fqwbXz8qQrtgADtKoZDHkQVvGyB_Ig_mzr66EQAVSO8HgDO9LDtShnMABolZJ4bC454YGpZ-64ilGKxSWIyOhyMhhE8TyQ0tuh09-O6pYvV5fOXVQmmSIWAacbA-KWx7VPRuu9XPKHb-HKdkC4huyNtKAh0P4siLiH3IqosVig_6OVPoo0qRvrr46S7HynTYRj9UbHzczJCfYgMjdQSJWpX1uBjy1UumDBh2gQ4H6Ta7PzD56')"}}></div>
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 flex flex-col items-center text-center">
<div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-surface shadow-md flex items-center justify-center mb-8 border-4 border-white">
<img className="w-24 h-24 object-contain rounded-full" data-alt="A polished, official-looking crest or seal for a Philippine Public School. It features traditional elements like an open book, a torch, and laurel leaves, rendered in deep primary red and secondary green against a pristine white background. Corporate modern style, high legibility." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJg3wBaaUgMxfmLf4yK_nOFSADxfk5SDmrCDEsAL-ddLSGFkOgIEosB6ZO8xS0tckRrKsyhZ2x3z7yywg3hzqv6-tuzH2Lk5nfn7eNvIOANqhaXCBesfinIST-plgH5IyyoedCd5NclbXPWbpSRPZWKPDAelzTrUuAxX26YYBKw1ivrk3cc0DsoRlIQxDADLDDC_GtZvLXRgD9YcoWeax9NdbNsCwwxgJJVRVsdGhNnRq1denZxC95" />
</div>
<h1 className="font-display-lg text-display-lg text-primary mb-4 max-w-3xl">Welcome to our School</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl">Empowering students through quality education, fostering community, and building a brighter future for the Philippines. Explore our resources and stay updated.</p>
<div className="flex gap-4">
<button className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-full hover:opacity-90 transition-opacity font-bold shadow-sm">Enroll Now</button>
<button className="bg-transparent border-2 border-primary text-primary font-label-md text-label-md px-8 py-3 rounded-full hover:bg-primary-container hover:text-on-primary-container transition-colors font-bold">Learn More</button>
</div>
</div>
</section>

<section className="py-12 bg-surface">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<h2 className="font-headline-md text-headline-md text-on-surface mb-8 text-center">Quick Access</h2>
<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter"><Link className="group flex flex-col items-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all" href="/slms"><div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>laptop_mac</span></div><h3 className="font-label-md text-label-md text-on-surface font-bold">SLMS</h3><p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">Student Learning Management System</p></Link><Link className="group flex flex-col items-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all" href="/sbm"><div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>account_balance</span></div><h3 className="font-label-md text-label-md text-on-surface font-bold">SBM Portal</h3><p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">School-Based Management</p></Link><Link className="group flex flex-col items-center p-8 bg-surface-container-lowest border border-outline-variant rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all" href="/online-services"><div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="material-symbols-outlined text-[32px]" style={{fontVariationSettings: "'FILL' 1"}}>folder_open</span></div><h3 className="font-label-md text-label-md text-on-surface font-bold">Downloadables</h3><p className="font-body-md text-body-md text-on-surface-variant text-center mt-2">Forms, modules, and public documents</p></Link></div>
</div>
</section>

<section className="py-16 bg-surface-container-low">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
<div className="flex justify-between items-end mb-8">
<h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Latest Announcements</h2>
<Link className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1" href="/news-events">View All <span className="material-symbols-outlined text-sm">arrow_forward</span></Link>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow relative flex flex-col">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
<div className="h-40 w-full" data-alt="A clean, modern photograph of students in a Philippine public school classroom, engaged in a learning activity. The classroom is bright with natural light, showcasing a professional and structured educational environment. White walls with subtle red and green accents." style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDqRyKmCJuwZBTVL5ol2t8qA-J7Hnt80-cZZLgJLwGwsKaMBrMP3wjBrByRsqi18iUltYjtnRLPXrEP055rkNvk3dmAyvPMujogiYhrrU5e1-cDKUpuOi488WzszAiow3P_-DTxH5BVxGVYcgkWt-xQIMkKrOFc6nHrkX5-GiEiqYYSygj_Rvr0l3u17aFeeCdGJCeytxcR_HpSEQejZUjc7tFUy8gjTre9U0-vS0aR7Y7VIeIXgeN-')"}}></div>
<div className="p-4 flex-grow flex flex-col pl-6">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Oct 24, 2024</span>
<h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-2 leading-tight">School Year 2024-2025 Enrollment Schedule Released</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4">The official enrollment period for the upcoming academic year will commence next week. Please review the requirements.</p>
<a className="mt-auto font-label-md text-label-md text-primary hover:underline self-start" href="#">Read More</a>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow relative flex flex-col">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
<div className="h-40 w-full" data-alt="A bright, official photograph of a school administrative meeting in a modern conference room. Teachers and staff discussing plans. Professional setting, clean lighting, with folders and laptops on the table. Colors lean towards pristine whites and deep reds." style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW4V648vEcujDm0nrwqQbHh_WGKSZxrJoCVps2emTNWXAv_hY12MhDytTnSFwX4__nakdInfBEBXhWqtYJLbeqZ0wku-u3bc6jA6dh4QkLKAzyxyrxw5UrAzz1mCaqz50rZvUIvCcjEf2UqufqDBajumZy8OdOQFobDGdsjOzHx-EZQIcaFVuAJyjgV6gr2TK3ytJ-VDtCdS7PETNkyt39-CJJDEmrQ6DpRXLvpGAQc4qhwRped0Fu')"}}></div>
<div className="p-4 flex-grow flex flex-col pl-6">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Oct 18, 2024</span>
<h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-2 leading-tight">Parent-Teacher Association General Assembly</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4">All parents and guardians are invited to attend the first PTA General Assembly of the year in the school gymnasium.</p>
<a className="mt-auto font-label-md text-label-md text-primary hover:underline self-start" href="#">Read More</a>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow relative flex flex-col">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
<div className="h-40 w-full bg-surface flex items-center justify-center border-b border-outline-variant">
<span className="material-symbols-outlined text-[64px] text-primary" style={{fontVariationSettings: "'FILL' 0"}}>campaign</span>
</div>
<div className="p-4 flex-grow flex flex-col pl-6">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Oct 15, 2024</span>
<h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-2 leading-tight">Suspension of Classes Due to Weather</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4">Classes in all levels are suspended tomorrow in accordance with the latest local government advisory.</p>
<a className="mt-auto font-label-md text-label-md text-primary hover:underline self-start" href="#">Read More</a>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow relative flex flex-col">
<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
<div className="h-40 w-full" data-alt="Students participating in a science fair project, examining a model. The environment is a clean, well-lit school laboratory. The image projects an atmosphere of active learning and academic excellence, fitting for a government educational institution." style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAkyj3c2EUI2coAMVy0vvN42XAwSKICQCXcmbqlxtElokyhU2Gl2kXegTWFHnyWsNdNQDYK7WKrago_XLx9PH1yzPnXbfrET0H9r9_Q0IpxrGa4b5V676ajgCSuQSkpDvhjBRFhr-vOGha3Glio9DZNMhXr47xlryL2LSGoK-AKEjrQzden_83gA5mxeGP8eF2euS51JjTluAx9ubyoMNdc5b2C0Ff2cO06SaJI6nw71t2ds-A6yIGv')"}}></div>
<div className="p-4 flex-grow flex flex-col pl-6">
<span className="font-label-sm text-label-sm text-on-surface-variant mb-2">Oct 10, 2024</span>
<h3 className="font-headline-md text-body-lg font-bold text-on-surface mb-2 leading-tight">Science Month Celebration Winners</h3>
<p className="font-body-md text-body-md text-on-surface-variant line-clamp-3 mb-4">Congratulations to the winners of this year's Science Investigatory Project competition. View the full list here.</p>
<a className="mt-auto font-label-md text-label-md text-primary hover:underline self-start" href="#">Read More</a>
</div>
</div>
</div>
</div>
</section>
</main>

    </>
  );
}
