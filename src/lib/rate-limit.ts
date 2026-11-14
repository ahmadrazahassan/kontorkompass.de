// Small fixed-window rate limiter kept in memory.
// Limits abuse of the newsletter form (sending confirmation mails to strangers' addresses, hurting the sender reputation).
// Note: on serverless hosting each instance has its own memory, so this is a first line of defence, not a hard cap.
// For a hard cap across instances, swap the Map for a shared store (e.g. Upstash Redis or a Supabase table).
const buckets = new Map<string, { count: number; resetAt: number }>();

/** Returns true if the action is allowed for this key, false if the limit for the current window is used up. */
export function allow(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  if (buckets.size > 5000) for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}

// Per-address cooldown that only starts once a mail was really sent (a failed send must not block a retry).
const sent = new Map<string, number>();
export function sentRecently(key: string, windowMs: number): boolean {
  const at = sent.get(key);
  return at !== undefined && Date.now() - at < windowMs;
}
export function markSent(key: string) {
  if (sent.size > 5000) for (const [k, at] of sent) if (Date.now() - at > 60 * 60_000) sent.delete(k);
  sent.set(key, Date.now());
}

/** Client IP as reported by the hosting proxy (Vercel sets x-forwarded-for). */
export function clientIp(req: Request): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}
