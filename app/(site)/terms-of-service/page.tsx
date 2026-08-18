const SECTIONS = [
  {
    title: "Acceptance of Terms",
    body: `By accessing and using this website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use this website.`,
  },
  {
    title: "Purpose of This Website",
    body: `This website is an official platform of Pag-Asa Elementary School, operating under the Department of Education, Schools Division Office – Caloocan. It is provided to share school announcements, events, downloadable resources, and other information for students, parents, staff, and the community.`,
  },
  {
    title: "Acceptable Use",
    body: `You agree to use this website only for lawful purposes. You may not use this website in any way that could damage, disable, overburden, or impair the site, or interfere with any other party's use of it.`,
  },
  {
    title: "Content Accuracy",
    body: `While we strive to keep information on this website accurate and up to date, we make no warranties about the completeness, reliability, or accuracy of this information. Any reliance you place on such information is strictly at your own risk.`,
  },
  {
    title: "Intellectual Property",
    body: `Unless otherwise stated, all content on this website — including text, images, and logos — is the property of Pag-Asa Elementary School or the Department of Education and is protected by applicable intellectual property laws.`,
  },
  {
    title: "Third-Party Links",
    body: `This website may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of any linked external sites.`,
  },
  {
    title: "Changes to These Terms",
    body: `We may revise these Terms of Service at any time. Continued use of this website following any changes constitutes acceptance of the updated terms.`,
  },
  {
    title: "Contact Us",
    body: `If you have questions about these Terms of Service, please reach out through our Contact page.`,
  },
];

export default function Page() {
  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className="font-label-md text-label-md text-primary uppercase tracking-wide">Legal</span>
        <h1 className="font-display-lg text-display-lg text-on-background">Terms of Service</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {SECTIONS.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="font-headline-md text-headline-md text-primary">{section.title}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
