import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="flex-grow w-full">
      {/* Hero */}
      <div className="w-full h-[420px] md:h-[520px] bg-surface-container-high animate-pulse relative overflow-hidden">
        <div className="max-w-container-max mx-auto h-full flex flex-col justify-center px-margin-mobile md:px-margin-desktop gap-4">
          <Skeleton className="h-10 w-3/4 max-w-xl bg-surface-container-highest/70" />
          <Skeleton className="h-5 w-2/3 max-w-lg bg-surface-container-highest/50" />
          <Skeleton className="h-11 w-40 mt-2 bg-surface-container-highest/70" />
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-16 flex flex-col gap-16">
        {/* Announcements */}
        <section>
          <Skeleton className="h-7 w-56 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </section>

        {/* Events */}
        <section>
          <Skeleton className="h-7 w-40 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-5 w-full" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
