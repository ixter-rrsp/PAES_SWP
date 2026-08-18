import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-1 max-w-container-max mx-auto w-full flex flex-col md:flex-row py-gutter px-margin-mobile md:px-margin-desktop gap-gutter">
      <aside className="w-full md:w-[280px] flex flex-col gap-gutter shrink-0">
        <div className="bg-surface-container-low p-gutter rounded border border-outline-variant flex flex-col gap-4">
          <Skeleton className="h-5 w-20" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-3/4" />
          ))}
        </div>
      </aside>
      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
