import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-grow flex flex-col items-center py-12 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto w-full gap-12">
      <div className="text-center max-w-2xl flex flex-col items-center gap-3">
        <Skeleton className="h-9 w-72 max-w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-gutter">
        <div className="w-full lg:w-2/3 border border-outline-variant rounded-xl p-8 flex flex-col gap-4">
          <Skeleton className="h-6 w-48 mb-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-11 w-32" />
        </div>
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-outline-variant rounded-xl p-6 flex flex-col gap-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
