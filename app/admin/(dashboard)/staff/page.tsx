"use client";

import Link from "next/link";

export default function Page() {
  return (
    <>

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Staff Directory</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Manage staff profiles, roles, and visibility settings.</p>
</div>
<div className="flex items-center gap-3">
<button className="px-4 py-2 border border-outline-variant bg-transparent text-on-surface-variant rounded-DEFAULT font-label-lg text-label-lg hover:bg-surface-container-low transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">filter_list</span>
                    Filter
                </button>
<button className="px-4 py-2 bg-primary-container text-on-primary rounded-DEFAULT font-label-lg text-label-lg hover:bg-[#8f000d] transition-colors flex items-center gap-2 shadow-sm" onClick={() => { document.getElementById('AddStaffModal')?.classList.remove('hidden') }}>
<span className="material-symbols-outlined text-[18px]">person_add</span>
                    Add Staff
                </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg flex flex-col gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow group relative">
<div className="flex items-start justify-between">
<div className="flex items-center gap-3">
<img alt="Dr. Sarah Jenkins" className="w-12 h-12 rounded-full object-cover border border-surface-variant shrink-0" data-alt="A professional corporate headshot of a middle-aged woman with glasses, smiling softly. She is wearing a modern dark blazer over a light blouse. The background is a crisp, bright, out-of-focus modern office setting with natural white light. The overall mood is approachable, organized, and professional, fitting a high-end corporate or educational administrative environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPfRE_bcP1P_bx7apDhHpNIk3g-yiT50K_Xmc_eZwZKvu0-T7DnvjhgF2k6JoRSUk4s6YmxB26bkKNrTqOeeHSnfupWV5lXfWuk_nY20zbfI2vxWHDeVLk8uwr3WjS3-XnfkFhn6Tcpbb9FOKThAsg7llclhkR-Y_77arSLu_sLLmaoDqoLjeLponnxzOeKcIbIH97Ypj-tizJbv52_PNQcckgLcvPqkjyHd9ETU31YkkdY_SlI5cL" />
<div>
<h3 className="font-label-lg text-label-lg text-on-surface leading-tight">Dr. Sarah Jenkins</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Principal</p>
</div>
</div>

<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1 transition-colors" title="Edit">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error hover:bg-error-container rounded-full p-1 transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</div>
</div>
<div className="flex-grow">
<span className="inline-flex items-center px-2 py-1 rounded-DEFAULT bg-surface-container-high text-on-surface font-label-md text-label-md text-[11px]">
                        Administration
                    </span>
</div>
<div className="pt-3 border-t border-surface-variant flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Directory Visibility</span>

<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 z-10" id="toggle1" name="toggle" style={{top: "-2px", left: "0"}} type="checkbox" />
<label className="toggle-label block overflow-hidden h-4 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle1"></label>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg flex flex-col gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow group relative">
<div className="flex items-start justify-between">
<div className="flex items-center gap-3">
<img alt="Marcus Chen" className="w-12 h-12 rounded-full object-cover border border-surface-variant shrink-0" data-alt="A professional headshot of a young man with short dark hair and a neat beard. He is wearing a crisp light blue button-down shirt without a tie. The lighting is studio-quality, high-key, casting soft shadows. The background is a clean, minimal light grey studio backdrop. The image conveys a modern, efficient, and friendly staff member in an educational setting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXdYjdUi65LGCYtAyoYSCXxxwEkZzOGRmb1D_Vz4NbXj6wJ32YTZLZ8xpyfQS_xWQrGIA3vcwFaqfmmGnZl-vNDeugZU6OJfDGyS3U5hBgrIn6i2VB7zHyHKSLmA7zyKLTN9ATHu0UpqiBdXcc5K1Rv8LTVCK26Y9skbSQJWrMUOAzjbC7-ipaakB650QjqjP4BtIoTr3ZvB0jjRXdF1ZMREs6cWaPz7uRKcvUUVq1mC1WtRq-7pXi" />
<div>
<h3 className="font-label-lg text-label-lg text-on-surface leading-tight">Marcus Chen</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Head of Mathematics</p>
</div>
</div>
<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1 transition-colors" title="Edit">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error hover:bg-error-container rounded-full p-1 transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</div>
</div>
<div className="flex-grow">
<span className="inline-flex items-center px-2 py-1 rounded-DEFAULT bg-surface-container-high text-on-surface font-label-md text-label-md text-[11px]">
                        Academic Staff
                    </span>
</div>
<div className="pt-3 border-t border-surface-variant flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Directory Visibility</span>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 z-10" id="toggle2" name="toggle" style={{top: "-2px", left: "0"}} type="checkbox" />
<label className="toggle-label block overflow-hidden h-4 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle2"></label>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg flex flex-col gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow group relative">
<div className="flex items-start justify-between">
<div className="flex items-center gap-3">
<div className="w-12 h-12 rounded-full bg-tertiary-fixed-dim flex items-center justify-center text-tertiary shrink-0 font-headline-sm">
                            EL
                        </div>
<div>
<h3 className="font-label-lg text-label-lg text-on-surface leading-tight">Elena Lopez</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Guidance Counselor</p>
</div>
</div>
<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1 transition-colors" title="Edit">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error hover:bg-error-container rounded-full p-1 transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</div>
</div>
<div className="flex-grow">
<span className="inline-flex items-center px-2 py-1 rounded-DEFAULT bg-surface-container-high text-on-surface font-label-md text-label-md text-[11px]">
                        Student Services
                    </span>
</div>
<div className="pt-3 border-t border-surface-variant flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Directory Visibility</span>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 z-10" id="toggle3" name="toggle" style={{top: "-2px", left: "0"}} type="checkbox" />
<label className="toggle-label block overflow-hidden h-4 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle3"></label>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-density-lg flex flex-col gap-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-shadow group relative">
<div className="flex items-start justify-between">
<div className="flex items-center gap-3">
<img alt="Margaret Higgins" className="w-12 h-12 rounded-full object-cover border border-surface-variant shrink-0" data-alt="A bright, clear professional portrait of an older woman with short silver hair. She wears a vibrant red cardigan that pops against a neutral, well-lit white office background. The lighting is soft and even, highlighting her confident and experienced expression. The aesthetic is clean, minimalist, and perfectly suited for an administrative staff directory." src="https://lh3.googleusercontent.com/aida-public/AB6AXuARuTQ4EWDXisf1HZSF1uoj4HTqjqzbtIJosP-iu71o65iuJuAmHbVLlVgt7MWs-U4gkVMLkhZ28Qra_6QHZff9ozM3Ptr7C4mPn5_vBHYkEDPbrW9vRd-1W0LPXfLdH6LB7LQx4-c614RGydUf9ecayYbCYsOlmB2v3ohw0fHiK-gw-Wqcr4sl4UrCel_rTTE7V_c46OhEI2xU5pt6jsX5jJpihrwoJFlEmN5WVshGvdKJu1RT9yON" />
<div>
<h3 className="font-label-lg text-label-lg text-on-surface leading-tight">Margaret Higgins</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Facility Manager</p>
</div>
</div>
<div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-full p-1 transition-colors" title="Edit">
<span className="material-symbols-outlined text-[18px]">edit</span>
</button>
<button className="text-on-surface-variant hover:text-error hover:bg-error-container rounded-full p-1 transition-colors" title="Delete">
<span className="material-symbols-outlined text-[18px]">delete</span>
</button>
</div>
</div>
<div className="flex-grow">
<span className="inline-flex items-center px-2 py-1 rounded-DEFAULT bg-surface-container-high text-on-surface font-label-md text-label-md text-[11px]">
                        Operations
                    </span>
</div>
<div className="pt-3 border-t border-surface-variant flex items-center justify-between">
<span className="font-label-md text-label-md text-on-surface-variant">Directory Visibility</span>
<div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 z-10" id="toggle4" name="toggle" style={{top: "-2px", left: "0"}} type="checkbox" />
<label className="toggle-label block overflow-hidden h-4 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle4"></label>
</div>
</div>
</div>
</div>

<div className="hidden fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm p-4" id="AddStaffModal">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.1)] w-full max-w-md overflow-hidden flex flex-col">

<div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Add New Staff Member</h3>
<button className="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-surface-container-high transition-colors" onClick={() => { document.getElementById('AddStaffModal')?.classList.add('hidden') }}>
<span className="material-symbols-outlined">close</span>
</button>
</div>

<div className="p-6 overflow-y-auto">
<form className="flex flex-col gap-5">

<div className="flex flex-col gap-2">
<label className="font-label-md text-label-md text-on-surface">Profile Photo</label>
<div className="flex items-center gap-4">
<div className="w-16 h-16 rounded-full bg-surface-container-high border border-dashed border-outline flex items-center justify-center text-on-surface-variant">
<span className="material-symbols-outlined text-[24px]">add_a_photo</span>
</div>
<button className="px-3 py-1.5 border border-outline-variant text-on-surface-variant text-label-md font-label-md rounded-DEFAULT hover:bg-surface-container-low transition-colors" type="button">
                                Upload Image
                            </button>
</div>
</div>

<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface" htmlFor="staffName">Full Name</label>
<input className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" id="staffName" placeholder="e.g. Jane Doe" type="text" />
</div>

<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface" htmlFor="staffRole">Role / Title</label>
<input className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" id="staffRole" placeholder="e.g. Science Teacher" type="text" />
</div>

<div className="flex flex-col gap-1.5">
<label className="font-label-md text-label-md text-on-surface" htmlFor="staffDept">Department</label>
<div className="relative">
<select className="w-full px-3 py-2 border border-outline-variant rounded-DEFAULT bg-surface-bright font-body-md text-body-md appearance-none focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary" defaultValue="" id="staffDept">
<option disabled value="">Select a department</option>
<option value="admin">Administration</option>
<option value="academic">Academic Staff</option>
<option value="student_services">Student Services</option>
<option value="operations">Operations &amp; Facilities</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
</div>
</div>

<div className="flex items-center justify-between mt-2 pt-4 border-t border-surface-variant">
<div>
<p className="font-label-md text-label-md text-on-surface">Public Directory</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">Visible on public-facing site</p>
</div>
<div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
<input defaultChecked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-2 border-outline-variant appearance-none cursor-pointer transition-all duration-300 z-10" id="toggle_new" name="toggle_new" style={{top: "-2px", left: "0"}} type="checkbox" />
<label className="toggle-label block overflow-hidden h-4 rounded-full bg-surface-variant cursor-pointer transition-colors duration-300" htmlFor="toggle_new"></label>
</div>
</div>
</form>
</div>

<div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
<button className="px-4 py-2 bg-transparent text-on-surface-variant border border-outline-variant rounded-DEFAULT font-label-lg text-label-lg hover:bg-surface-container-high transition-colors" onClick={() => { document.getElementById('AddStaffModal')?.classList.add('hidden') }}>
                    Cancel
                </button>
<button className="px-4 py-2 bg-primary-container text-on-primary rounded-DEFAULT font-label-lg text-label-lg hover:bg-[#8f000d] transition-colors shadow-sm">
                    Save Staff Member
                </button>
</div>
</div>
</div>
    </>
  );
}
