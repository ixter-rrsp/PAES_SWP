import { getPublishedSbmYears } from "@/lib/data/sbm";
import SbmAccordion from "./SbmAccordion";

export default async function Page() {
  const years = await getPublishedSbmYears();

  return (
    <>
      <main className="flex-grow pt-24 pb-margin-desktop px-margin-desktop md:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="mb-12">
          <h1 className="font-display-lg text-display-lg text-primary mb-4">School-Based Management</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
            Transparency and accountability are the cornerstones of our School-Based Management (SBM) system.
            Access comprehensive reports, financial disclosures, and operational documents detailing our
            school&rsquo;s performance and governance via OneDrive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-8 flex flex-col gap-base">
            <SbmAccordion years={years} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-base">
            <div className="bg-primary-container text-on-primary-container p-6 rounded-xl border border-outline-variant">
              <h3 className="font-headline-md text-headline-md font-bold mb-2">Need Clarification?</h3>
              <p className="font-body-md text-body-md mb-6">
                If you have questions regarding any of the documents provided in the SBM portal, please reach out
                to the SBM Coordinator.
              </p>
              <div className="flex items-center gap-4 bg-surface-container-lowest/20 p-4 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center overflow-hidden">
                  <img
                    className="object-cover w-full h-full"
                    data-alt="A professional headshot of a middle-aged Filipino educator with a warm smile, wearing a formal DepEd uniform polo. The lighting is bright and even, set against a neutral, slightly blurred office background. The style is a high-quality, realistic corporate portrait conveying approachability and authority."
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMzxQK3FKLBpdFEN9ulfnM4TN5CkhDCik_mS5mlRUB7xMUADp2HZTNMoZmNjbXTTQiChNxtGxA15Gj_gfEoTeOeB4nbcRyh1DiocJDK-Hr_E3XXvjm4N-aFoaNS5lLHP6KD9ZmGZ95B1HNMPtByqFKuBtJK5alHabxWqnlTbJZDHvLUnFaZpxGc8TdOMPb1MwhyzbjpXXLT8VwTrXw25FOuetIAeFi9WmyguFBMP7Q44kGu4shHn79"
                  />
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
              <span className="material-symbols-outlined text-secondary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
              <div>
                <h4 className="font-label-md text-label-md font-bold text-on-surface mb-1">Commitment to Transparency</h4>
                <p className="font-body-md text-body-md text-sm text-on-surface-variant">
                  We adhere strictly to the DepEd mandate on public disclosure of information, ensuring all
                  stakeholders are informed of school operations and fiscal management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
