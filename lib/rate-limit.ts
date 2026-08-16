/**
 * Minimal in-memory fixed-window rate limiter for route handlers that
 * proxy outbound requests (Drive downloads/thumbnails) on behalf of
 * anonymous visitors — protects our own server's outbound bandwidth
 * and Google's endpoints from being hammered by one client.
 *
 * NOTE: this is per server instance. Fine for a single Node process;
 * if you deploy multiple instances/edge regions behind a load
 * balancer, each gets its own counter, so the effective limit is
 * (limit x instance count). For a small school site that's an
 * acceptable tradeoff for zero extra infra — if it stops being
 * enough, swap this for Upstash Redis or Vercel KV with the same
 * `check()` signature.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Sweep expired buckets occasionally so the Map doesn't grow forever
// under sustained unique-IP traffic.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * @param key       Unique identifier for the caller, e.g. `${ip}:${route}`
 * @param limit     Max requests allowed within the window
 * @param windowMs  Window length in ms
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { ok: true, remaining: limit - 1, resetAt };
  }

  if (existing.count >= limit) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { ok: true, remaining: limit - existing.count, resetAt: existing.resetAt };
}

/** Best-effort client IP from standard proxy headers. */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
