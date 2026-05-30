type Bucket = { count: number; resetAt: number };
// In-memory IP rate limiter. Per-process state — cold starts reset the map.
// Defense-in-depth, not a guarantee. Swap to Upstash/Redis if multi-region needed.
const buckets = new Map<string, Bucket>();

export function checkRateLimit(
    key: string,
    max: number,
    windowMs: number,
): { ok: boolean; retryAfterSec?: number } {
    const now = Date.now();
    const bucket = buckets.get(key);

    if (!bucket || bucket.resetAt < now) {
        buckets.set(key, { count: 1, resetAt: now + windowMs });
        return { ok: true };
    }

    if (bucket.count >= max) {
        return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
    }

    bucket.count++;
    return { ok: true };
}