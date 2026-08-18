import { Skeleton } from "@/components/ui/skeleton";

/** Thin row of pulsing placeholders shown while the next page loads. */
export default function LoadMoreIndicator({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 py-6 ${className}`} role="status">
      <span className="sr-only">Loading more…</span>
      <Skeleton className="h-2 w-2 rounded-full" />
      <Skeleton className="h-2 w-2 rounded-full" />
      <Skeleton className="h-2 w-2 rounded-full" />
    </div>
  );
}
