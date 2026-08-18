import { Skeleton } from "@/components/ui/skeleton";

/** Shared skeleton shape for simple heading + prose-block pages. */
export function ArticleSkeleton({
  narrow = true,
  paragraphs = 5,
}: {
  narrow?: boolean;
  paragraphs?: number;
}) {
  return (
    <main
      className={`flex-grow w-full ${
        narrow ? "max-w-3xl" : "max-w-container-max"
      } mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-10`}
    >
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="flex flex-col gap-8">
        {Array.from({ length: paragraphs }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        ))}
      </div>
    </main>
  );
}
