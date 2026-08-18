/**
 * Base pulsing placeholder block. Compose these into page-shaped
 * skeletons inside route `loading.tsx` files so navigation feels
 * instant while the real (async) page is still fetching data.
 */
export function Skeleton({
  className = "",
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={`animate-pulse rounded-DEFAULT bg-surface-container-highest ${className}`}
      {...props}
    />
  );
}
