// Double-opt-in confirmation. Needs RESEND_API_KEY, RESEND_AUDIENCE_ID, NEWSLETTER_SECRET, SITE_URL.
// GET only shows the confirm page: corporate mail scanners (Defender Safe Links, Mimecast …) open every link in a mail,
// so a GET must never confirm. The visitor confirms with a button (POST), which adds the contact to the Resend audience
// and stores the consent proof (signup time + confirmation time) in the CMS collection "newsletter-consents".
import { getPayload } from "payload";
import config from "@payload-config";
import { requestedAt, verifySubscription } from "@/lib/newsletter-token";

export const runtime = "nodejs";

const siteUrlOf = (req: Request) => process.env.SITE_URL || new URL(req.url).origin;

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  return Response.redirect(`${siteUrlOf(req)}/newsletter/bestaetigen?token=${encodeURIComponent(token)}`, 303);
}

export async function POST(req: Request) {
  // Redirect on the visitor's own origin: the CSP "form-action 'self'" also applies to the redirect after a form POST.
  const siteUrl = new URL(req.url).origin;
  const redirectTo = (path: string) => Response.redirect(`${siteUrl}${path}`, 303);
  const fail = () => redirectTo("/newsletter?fehler=bestaetigung");

  const key = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const secret = process.env.NEWSLETTER_SECRET;
  if (!key || !audienceId || !secret) return fail();

  const token = String((await req.formData()).get("token") ?? "");
  const email = verifySubscription(token, secret);
  if (!email) return fail();

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  // 201 = angelegt; 409/422 = bereits im Verteiler – beides zählt als bestätigt.
  if (!res.ok && res.status !== 409 && res.status !== 422) return fail();

  // Consent proof. A failure here must not undo a valid confirmation, but it is logged so it can be fixed.
  try {
    const payload = await getPayload({ config });
    await payload.create({
      collection: "newsletter-consents",
      data: { email, requestedAt: requestedAt(token)?.toISOString(), confirmedAt: new Date().toISOString() },
      overrideAccess: true,
    });
  } catch (err) {
    console.error("newsletter-consents: could not store consent proof", err);
  }
  return redirectTo("/newsletter?bestaetigt=1");
}
