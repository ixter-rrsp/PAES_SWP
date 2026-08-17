import { getPublishedStaff } from "@/lib/data/staff";
import StaffDirectory from "./StaffDirectory";

export default async function Page() {
  const staff = await getPublishedStaff();

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <div className="mb-12 border-l-4 border-primary pl-4">
        <h1 className="font-display-lg text-display-lg text-on-surface mb-2">Staff Directory</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-3xl">
          Meet the dedicated administration and faculty members committed to
          providing quality education and fostering a supportive learning
          environment.
        </p>
      </div>

      <StaffDirectory staff={staff} />
    </main>
  );
}
