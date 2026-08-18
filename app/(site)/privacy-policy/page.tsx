const SECTIONS = [
  {
    title: "Information We Collect",
    body: `We collect information you provide directly to us, such as your name, email address, and message content when you use the contact form on this website. We do not collect information from visitors beyond what is voluntarily submitted through forms on this site.`,
  },
  {
    title: "How We Use Your Information",
    body: `Information submitted through this website is used solely to respond to enrollment inquiries, general questions, and support requests. We do not sell, rent, or share your personal information with third parties for marketing purposes.`,
  },
  {
    title: "Data Storage and Security",
    body: `Information submitted through this website is transmitted securely and is only accessible to authorized school staff. We take reasonable measures to protect your information from unauthorized access, alteration, or disclosure.`,
  },
  {
    title: "Cookies",
    body: `This website may use essential cookies required for basic site functionality. We do not use cookies for tracking or advertising purposes.`,
  },
  {
    title: "Children's Privacy",
    body: `As a public elementary school, we are committed to protecting the privacy of children. We do not knowingly collect personal information directly from students through this website without parental or guardian involvement.`,
  },
  {
    title: "Changes to This Policy",
    body: `We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.`,
  },
  {
    title: "Contact Us",
    body: `If you have questions about this Privacy Policy or how your information is handled, please reach out through our Contact page.`,
  },
];

export default function Page() {
  return (
    <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className="font-label-md text-label-md text-primary uppercase tracking-wide">Legal</span>
        <h1 className="font-display-lg text-display-lg text-on-background">Privacy Policy</h1>
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
