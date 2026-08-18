"use client";

import { useEffect, useRef } from "react";

/**
 * Invisible marker element. When it scrolls into view, calls
 * `onVisible` — used to trigger fetching the next page of a list
 * right before the user reaches the bottom, so more items are
 * already loading by the time they'd notice a gap. Falls back to
 * doing nothing extra if IntersectionObserver isn't available.
 */
export default function LoadMoreSentinel({
  onVisible,
  disabled = false,
}: {
  onVisible: () => void;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          onVisible();
        }
      },
      { rootMargin: "400px 0px" } // start fetching before it's actually visible
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  return <div ref={ref} aria-hidden className="h-1 w-full" />;
}
