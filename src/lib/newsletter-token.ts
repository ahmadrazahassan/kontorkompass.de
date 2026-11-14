// Signed confirmation tokens for the newsletter double opt-in.
// Resend has no native DOI endpoint, so we sign the pending address ourselves,
// mail the confirm link, and only add the contact once the link is opened.
import crypto from "node:crypto";

const TTL_MS = 1000 * 60 * 60 * 48; // Bestätigungslink gilt 48 Stunden.

function hmac(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("base64url");
}

export function signSubscription(email: string, secret: string): string {
  const now = Date.now();
  // t = time of the signup request (kept as proof of consent), x = expiry
  const payload = Buffer.from(JSON.stringify({ e: email, t: now, x: now + TTL_MS })).toString("base64url");
  return `${payload}.${hmac(payload, secret)}`;
}

/** Signup time stored in the token (older tokens without it: derived from the expiry). */
export function requestedAt(token: string): Date | null {
  try {
    const { t, x } = JSON.parse(Buffer.from(token.split(".")[0] ?? "", "base64url").toString()) as { t?: unknown; x?: unknown };
    if (typeof t === "number") return new Date(t);
    if (typeof x === "number") return new Date(x - TTL_MS);
  } catch {
    // fall through
  }
  return null;
}

export function verifySubscription(token: string, secret: string): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;

  const expected = hmac(payload, secret);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString()) as { e?: unknown; x?: unknown };
    if (typeof e !== "string" || typeof x !== "number" || Date.now() > x) return null;
    return e;
  } catch {
    return null;
  }
}
