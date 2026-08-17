"use client";

import EditableText from "@/components/site/editable-text";
import EditableImage from "@/components/site/editable-image";

const MISSION_STAKEHOLDERS = [
  {
    key: "students",
    icon: "diversity_3",
    title: "Students",
    text: "Learn in a child-friendly, gender-sensitive, safe, and motivating environment.",
  },
  {
    key: "teachers",
    icon: "menu_book",
    title: "Teachers",
    text: "Facilitate learning and constantly nurture every learner.",
  },
  {
    key: "admins",
    icon: "corporate_fare",
    title: "Administrators & Staff",
    text: "As stewards of the institution, ensure an enabling and supportive environment for effective learning to happen.",
  },
  {
    key: "family",
    icon: "groups",
    title: "Family & Community",
    text: "Actively engaged and share responsibility for developing life-long learners.",
  },
];

const HISTORY_STATS = [
  { key: "founded", value: "1989", label: "Year founded" },
  { key: "students", value: "56 → 6,000+", label: "Students, then and now" },
  { key: "teachers", value: "4", label: "Founding teachers" },
];

const SCHOOL_ADDRESS_DEFAULT =
  "Phase 7-B Bagong Silang, Brgy. 176 Katarungan Rd, Caloocan, Metro Manila";
const SCHOOL_PHONE_DEFAULT = "950-952-4017";

export default function AboutPageView() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-16 md:gap-28">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="md:col-span-7 flex flex-col gap-5">
          <EditableText
            id="hero_eyebrow"
            label="Hero eyebrow label"
            as="span"
            className="font-label-md text-label-md text-primary uppercase tracking-wide"
          >
            About Pag-Asa Elementary School
          </EditableText>
          <EditableText
            id="hero_title"
            label="Hero heading"
            as="h1"
            className="font-display-lg text-display-lg text-on-background"
          >
            Rooted in the DepEd vision, shaped by our own community.
          </EditableText>
          <EditableText
            id="hero_body"
            label="Hero paragraph"
            type="richtext"
            as="p"
            className="font-body-lg text-body-lg text-on-surface-variant max-w-xl"
          >
            A public elementary school in Caloocan committed to quality, equitable, and complete basic
            education — from our founding in 1989 to the digital tools we use today.
          </EditableText>
        </div>
        <div className="md:col-span-5">
          <EditableImage id="hero_image" label="Hero photo" ratio="wide" placeholderLabel="School facade / main gate photo" />
        </div>
      </section>

      {/* DepEd Vision */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
        <div className="md:col-span-4 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="font-headline-lg text-headline-lg text-primary">The DepEd Vision</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            The vision every Department of Education school — including ours — works toward.
          </p>
        </div>
        <div className="md:col-span-8 bg-primary-container rounded-xl p-8 md:p-10 flex flex-col gap-6">
          <EditableText
            id="vision_statement"
            label="Vision statement"
            type="richtext"
            as="p"
            className="font-headline-md text-headline-md text-on-primary-container leading-snug"
          >
            We dream of Filipinos who passionately love their country and whose values and competencies
            enable them to realize their full potential and contribute meaningfully to building the
            nation.
          </EditableText>
          <EditableText
            id="vision_subtext"
            label="Vision sub-text"
            type="richtext"
            as="p"
            className="font-body-md text-body-md text-on-primary-container/80 border-t border-on-primary-container/15 pt-6"
          >
            As a learner-centered public institution, the Department of Education continuously improves
            itself to better serve its stakeholders.
          </EditableText>
        </div>
      </section>

      {/* DepEd Mission */}
      <section className="flex flex-col gap-10">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-3">
          <h2 className="font-headline-lg text-headline-lg text-primary">The DepEd Mission</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            To protect and promote the right of every Filipino to quality, equitable, culture-based, and
            complete basic education where:
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {MISSION_STAKEHOLDERS.map((item) => (
            <div
              key={item.key}
              className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
            >
              <div className="w-11 h-11 bg-secondary-container rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-on-secondary-container text-2xl">
                  {item.icon}
                </span>
              </div>
              <EditableText
                id={`mission_${item.key}_title`}
                label={`${item.title} — title`}
                as="h3"
                className="font-label-lg text-label-lg text-on-surface"
              >
                {item.title}
              </EditableText>
              <EditableText
                id={`mission_${item.key}_text`}
                label={`${item.title} — description`}
                type="richtext"
                as="p"
                className="font-body-sm text-body-sm text-on-surface-variant"
              >
                {item.text}
              </EditableText>
            </div>
          ))}
        </div>
      </section>

      {/* School History */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
        <div className="md:col-span-6 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="font-headline-lg text-headline-lg text-primary">School History</h2>
          </div>
          <EditableText
            id="history_paragraph_1"
            label="History paragraph 1"
            type="richtext"
            as="p"
            className="font-body-md text-body-md text-on-surface-variant"
          >
            Pag-Asa Elementary was established in 1989 with the vision of providing quality education
            and fostering holistic development in students. Starting with just 56 students and 4
            teachers, the school grew steadily, gaining a reputation for academic excellence and
            community engagement.
          </EditableText>
          <EditableText
            id="history_paragraph_2"
            label="History paragraph 2"
            type="richtext"
            as="p"
            className="font-body-md text-body-md text-on-surface-variant"
          >
            Over the years, the school has expanded its facilities, embraced modern teaching methods,
            and continuously improved its curriculum to meet the evolving educational needs of the
            community. Milestones include the introduction of new extracurricular programs, partnerships
            with local organizations, and the implementation of a School-Based Management System that
            has streamlined operations and enhanced learning outcomes.
          </EditableText>
          <EditableText
            id="history_paragraph_3"
            label="History paragraph 3"
            type="richtext"
            as="p"
            className="font-body-md text-body-md text-on-surface-variant"
          >
            Today, Pag-Asa Elementary School proudly serves over 6,000 students, providing a nurturing
            environment where young minds are empowered to reach their full potential. The school
            remains committed to its founding mission of excellence in education and continues to adapt
            to the changing landscape of learning, ensuring a bright future for generations to come.
          </EditableText>
          <div className="grid grid-cols-3 gap-4 pt-2">
            {HISTORY_STATS.map((stat) => (
              <div
                key={stat.key}
                className="bg-surface-container-low rounded-lg px-3 py-4 text-center flex flex-col gap-1"
              >
                <EditableText
                  id={`history_stat_${stat.key}_value`}
                  label={`${stat.label} — value`}
                  as="span"
                  className="font-headline-md text-headline-md text-primary"
                >
                  {stat.value}
                </EditableText>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="md:col-span-6 grid grid-cols-2 gap-4">
          <EditableImage
            id="history_image_founding"
            label="1989 founding class photo"
            placeholderLabel="1989 founding class photo"
            ratio="portrait"
            className="col-span-1"
          />
          <div className="col-span-1 flex flex-col gap-4">
            <EditableImage id="history_image_campus" label="Campus today" placeholderLabel="Campus today" ratio="square" />
            <EditableImage
              id="history_image_milestones"
              label="School milestones / events"
              placeholderLabel="School milestones / events"
              ratio="square"
            />
          </div>
        </div>
      </section>

      {/* SBM Platform vision & mission */}
      <section className="flex flex-col gap-10">
        <div className="max-w-2xl mx-auto text-center flex flex-col gap-3">
          <span className="font-label-md text-label-md text-primary uppercase tracking-wide">
            About this portal
          </span>
          <h2 className="font-headline-lg text-headline-lg text-primary">
            Our School-Based Management System
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            The platform behind this website — built to support the school the same way our teachers and
            staff support our students.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          <div className="bg-surface border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-primary-fixed rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-fixed text-3xl">visibility</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">Vision</h3>
            <EditableText
              id="sbm_vision_text"
              label="SBM vision paragraph"
              type="richtext"
              as="p"
              className="font-body-md text-body-md text-on-surface-variant"
            >
              To empower educational institutions with a user-friendly, and data-driven School-Based
              Management System that fosters transparency, efficiency, and collaboration, ensuring the
              holistic development of students and the continuous growth of educators and staff.
            </EditableText>
          </div>
          <div className="bg-surface border border-outline-variant rounded-xl p-8 shadow-sm flex flex-col gap-4">
            <div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container text-3xl">flag</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-primary">Mission</h3>
            <EditableText
              id="sbm_mission_text"
              label="SBM mission paragraph"
              type="richtext"
              as="p"
              className="font-body-md text-body-md text-on-surface-variant"
            >
              The School-Based Management System enhances decision-making, promotes accountability, and
              empowers stakeholders through real-time data and collaboration tools. It supports academic
              excellence by monitoring student performance and automating administrative tasks, enabling
              educators to focus more on teaching and improving learning outcomes.
            </EditableText>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-stretch">
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-primary rounded-full" />
            <h2 className="font-headline-lg text-headline-lg text-primary">Visit or Reach Us</h2>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-secondary-container rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-2xl">
                location_on
              </span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface mb-1">Address</p>
              <EditableText
                id="school_address"
                label="School address"
                as="p"
                className="font-body-md text-body-md text-on-surface-variant"
              >
                {SCHOOL_ADDRESS_DEFAULT}
              </EditableText>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 bg-secondary-container rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-on-secondary-container text-2xl">call</span>
            </div>
            <div>
              <p className="font-label-lg text-label-lg text-on-surface mb-1">Phone</p>
              <EditableText
                id="school_phone"
                label="School phone"
                as="span"
                className="font-body-md text-body-md text-on-surface-variant"
              >
                {SCHOOL_PHONE_DEFAULT}
              </EditableText>
            </div>
          </div>
        </div>
        <div className="md:col-span-7 rounded-xl overflow-hidden border border-outline-variant shadow-sm min-h-[320px]">
          <iframe
            title="Pag-Asa Elementary School location"
            src={`https://www.google.com/maps?q=${encodeURIComponent(SCHOOL_ADDRESS_DEFAULT)}&output=embed`}
            className="w-full h-full min-h-[320px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </main>
  );
}
