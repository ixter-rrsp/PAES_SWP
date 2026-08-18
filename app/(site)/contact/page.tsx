import ContactForm from "./ContactForm";

export default function Page() {
  return (
    <>

<main className="flex-grow flex flex-col items-center py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full gap-12">
<div className="text-center max-w-2xl">
<h1 className="font-display-lg text-display-lg text-on-surface mb-4">Contact &amp; Enrollment</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant">We are here to assist you with enrollment inquiries, general questions, and support. Please fill out the form below or reach out to us directly.</p>
</div>
<div className="w-full flex flex-col lg:flex-row gap-gutter">

<div className="w-full lg:w-2/3 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
<h2 className="font-headline-md text-headline-md text-on-surface mb-6">Send us a Message</h2>
<ContactForm />
</div>

<div className="w-full lg:w-1/3 flex flex-col gap-6">
<div className="bg-surface-container-low rounded-xl p-6 border border-outline-variant">
<h3 className="font-headline-md text-headline-md text-on-surface mb-4">Contact Information</h3>
<div className="flex flex-col gap-4">
<div className="flex items-start gap-4">
<div className="bg-surface-container-highest p-2 rounded-full text-primary">
<span className="material-symbols-outlined" data-icon="location_on">location_on</span>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface">Address</h4>
<p className="font-body-md text-body-md text-on-surface-variant">DepEd Division Office Compound<br />Rizal St., Brgy. Poblacion<br />Manila, Philippines 1000</p>
</div>
</div>
<div className="flex items-start gap-4">
<div className="bg-surface-container-highest p-2 rounded-full text-primary">
<span className="material-symbols-outlined" data-icon="call">call</span>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface">Phone</h4>
<p className="font-body-md text-body-md text-on-surface-variant">+63 (2) 1234-5678</p>
<p className="font-body-md text-body-md text-on-surface-variant">Mon-Fri, 8:00 AM - 5:00 PM</p>
</div>
</div>
<div className="flex items-start gap-4">
<div className="bg-surface-container-highest p-2 rounded-full text-primary">
<span className="material-symbols-outlined" data-icon="mail">mail</span>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface">Email</h4>
<p className="font-body-md text-body-md text-on-surface-variant">support@deped.gov.ph</p>
</div>
</div>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm h-64 relative">
<img className="w-full h-full object-cover" data-alt="A highly detailed overhead map view showing an urban school campus in Manila, Philippines. The map displays a grid of streets with the main school building highlighted in a subtle red tint. The overall aesthetic is clean, professional, and consistent with a modern light-mode government digital interface, utilizing off-white backgrounds and soft gray road lines to maintain a trustworthy, official appearance." data-location="Manila, Philippines" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyOyuleErXnVVABDjSNXdqS06zY4f7hgrYPCqS-Yvdpb11Bb7fCMCCjxOYzDWcAHnPWL1CXqUe9nhqWl5zVGfsiB-NxaLvEK2yglpYfDhxqdmeowlJsYScFgE7624UpLQLFlDWLd81eIdV4QQGveqwqv0a4utXrlP1447TGlvSge7XphZYM6rghdEYsdQMiXIpWcGwL7mx6ir6OJa5IlYvBG8Em8468yenlvo9ifzc4Cp9wbCadyPB" />
<div className="absolute inset-0 bg-black/5 hover:bg-transparent transition-colors flex items-center justify-center pointer-events-none">
<div className="bg-surface/80 backdrop-blur-sm px-4 py-2 rounded-full border border-outline-variant shadow-sm flex items-center gap-2">
<span className="material-symbols-outlined text-primary" data-icon="pin_drop" data-weight="fill" style={{fontVariationSettings: "'FILL' 1"}}>pin_drop</span>
<span className="font-label-md text-label-md text-on-surface">View on Map</span>
</div>
</div>
</div>
</div>
</div>
</main>

    </>
  );
}
