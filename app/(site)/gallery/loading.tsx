import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
      <div className="mb-12 border-l-4 border-outline-variant pl-4 flex flex-col gap-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full max-w-3xl" />
      </div>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="mb-14">
          <Skeleton className="h-6 w-40 mb-5" />
          <Skeleton className="h-64 w-full" />
        </div>
      ))}
    </main>
  );
}
