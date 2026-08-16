import Link from "next/link";

export default function Page() {
  return (
    <>

<main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">

<div className="mb-12 border-l-4 border-primary pl-4">
<h1 className="font-display-lg text-display-lg text-on-surface mb-2">Staff Directory</h1>
<p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">Meet the dedicated administration and faculty members committed to providing quality education and fostering a supportive learning environment.</p>
</div>

<div className="mb-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex flex-col md:flex-row gap-4">
<div className="relative flex-grow">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="w-full pl-10 pr-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-md text-body-md bg-transparent" placeholder="Search staff by name or role..." type="text" />
</div>
<select className="px-4 py-2 rounded-lg border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-body-md text-body-md bg-transparent min-w-[200px]">
<option value="all">All Departments</option>
<option value="admin">Administration</option>
<option value="grade1">Grade 1 Teachers</option>
<option value="science">Science Department</option>
</select>
</div>

<section className="mb-16">
<div className="flex items-center gap-3 mb-6">
<h2 className="font-headline-lg text-headline-lg text-primary">Administration</h2>
<div className="flex-grow h-px bg-outline-variant"></div>
</div>
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow flex flex-col items-center p-6 text-center group">
<div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container-low group-hover:border-primary transition-colors">
<img className="w-full h-full object-cover" data-alt="A professional headshot portrait of a mature male school principal in his 50s. He is wearing a formal Barong Tagalog, appropriate for a Philippine government official setting. He has a warm, welcoming smile and is standing in a well-lit, modern office environment with soft, high-key lighting that emphasizes a trustworthy and authoritative yet approachable demeanor." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6bVa-Ed_1wALFvspBuquULvu8L6JMtcNsJ91JN1k-CLuy3R7q9fsIRLCMnTVwtQqGLn92-yBvLQh3_jSaK92aTBtEfCwrBn7l9Si3FVHTSkF1ymZpvi3vETYeG13R5PsMWoboKN0xCxHtbqz8_w30H-z1roPlme45rG4a64E6r7Kd_6izapC--7lexq3w2rPW1oJLmONubf6p19lhY79HChx8dtNlQlZVOgwIBTgxswEHw2AeO7aV" />
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">Dr. Roberto Santos</h3>
<p className="font-label-md text-label-md text-primary mb-4">School Principal IV</p>
<button className="mt-auto px-4 py-2 rounded border border-primary text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-sm text-label-sm w-full flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[16px]">mail</span>
                        Contact
                    </button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow flex flex-col items-center p-6 text-center group">
<div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container-low group-hover:border-primary transition-colors">
<img className="w-full h-full object-cover" data-alt="A professional headshot portrait of a female school administrator in her 40s. She is wearing a neat, corporate blouse in a neutral tone, reflecting a professional government office style. She has a confident, organized expression and is photographed against a clean, light-colored background typical of an official school ID photo." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLRsR3g7dHuu5tcnO5DV_QRPPDAYCBAneAL76AHWpDsuPd9TJQbexobqmir_7CAoFQbnVefaTdmD_dMh4HEhrIJdV-Ai5iNeIYO8NRQVeBhjmrLcrzfdUizx3-JyF8qNmgK7CntkHAM2fKVxWCOrFdC7Y84kLUVb73Iu7i20JuDmtuSsCVmiRPk_OEhn4YrF60dU-ZRF35nYbX0O3yEN5TqmN5Hucs0v9mdM4atdHJ3A8ENCZa7t-T" />
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">Maria Clara Reyes</h3>
<p className="font-label-md text-label-md text-primary mb-4">Head Teacher III - Admin</p>
<button className="mt-auto px-4 py-2 rounded border border-primary text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-sm text-label-sm w-full flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[16px]">mail</span>
                        Contact
                    </button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow flex flex-col items-center p-6 text-center group">
<div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-surface-container-low group-hover:border-primary transition-colors">
<img className="w-full h-full object-cover" data-alt="A professional portrait of a male school guidance counselor in his 30s. He is wearing a smart-casual polo shirt, conveying a sense of approachability and readiness to assist students. The lighting is soft and inviting, and the background is slightly blurred, suggesting a comfortable office setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDd-l3bsH_kz7b-qXt-Njt-hKrdFPDRx-QmvkayGfRmUaThXBNgYW4Q0_1pesaj_EL3Q04a410wxK3wdMvp7bk-HZRNvr3iChK44Qr1HM63ADq0F9wbo1dUDklZ0TpK7rqGHDbp8mO_wvvGd7PUapmR19SdIAEkVUOpDv6ykVN4bRAuwoU2FKN1BprKNWrHp7_gbqEix4eiEIyNP5_pb8eufH9ZaqSfP7yCcd_MjCR7MY-Q5z_zPdmA" />
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">Juan Dela Cruz</h3>
<p className="font-label-md text-label-md text-primary mb-4">Guidance Counselor</p>
<button className="mt-auto px-4 py-2 rounded border border-primary text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-sm text-label-sm w-full flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-[16px]">mail</span>
                        Contact
                    </button>
</div>
</div>
</section>
</main>

    </>
  );
}
