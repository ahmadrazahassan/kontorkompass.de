// Newsletter signup via Resend double opt-in.
// Needs RESEND_API_KEY, NEWSLETTER_FROM, NEWSLETTER_SECRET and SITE_URL.
// This step only sends the confirmation mail; RESEND_AUDIENCE_ID is used on confirm.
import { signSubscription } from "@/lib/newsletter-token";
import { allow, clientIp, markSent, sentRecently } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TOO_MANY = "Zu viele Anmeldeversuche. Bitte versuchen Sie es in einigen Minuten erneut.";

export async function POST(req: Request) {
  const fd = await req.formData();
  if (fd.get("website")) return Response.json({ ok: true }); // honeypot
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL.test(email)) return Response.json({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }, { status: 400 });

  // At most 5 signups per IP per 15 minutes, and one confirmation mail per address per 10 minutes.
  if (!allow(`ip:${clientIp(req)}`, 5, 15 * 60_000)) return Response.json({ message: TOO_MANY }, { status: 429 });
  if (sentRecently(email, 10 * 60_000)) {
    // Same answer as a success, so the form can't be used to find out which addresses were just signed up.
    return Response.json({ ok: true });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  const secret = process.env.NEWSLETTER_SECRET;
  const siteUrl = process.env.SITE_URL;
  if (!key || !from || !secret || !siteUrl) {
    return Response.json({ message: "Die Newsletter-Anmeldung ist noch nicht eingerichtet." }, { status: 503 });
  }

  const token = signSubscription(email, secret);
  // Points to a page with a confirm button: mail scanners that open links must not be able to confirm on their own.
  const confirmUrl = `${siteUrl}/newsletter/bestaetigen?token=${encodeURIComponent(token)}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "Bitte bestätigen Sie Ihre Newsletter-Anmeldung",
      text:
        `Bitte bestätigen Sie Ihre Anmeldung zum Kontorkompass-Newsletter. Öffnen Sie dazu diesen Link und klicken Sie dort auf „Anmeldung bestätigen“:\n\n` +
        `${confirmUrl}\n\n` +
        `Erst danach nehmen wir Sie in den Verteiler auf. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach – dann passiert nichts.`,
      html:
        `<p>Bitte bestätigen Sie Ihre Anmeldung zum Kontorkompass-Newsletter. Öffnen Sie dazu den folgenden Link und klicken Sie dort auf „Anmeldung bestätigen“:</p>` +
        `<p><a href="${confirmUrl}">Zur Bestätigung</a></p>` +
        `<p>Erst danach nehmen wir Sie in den Verteiler auf. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese E-Mail einfach – dann passiert nichts.</p>`,
    }),
  });
  if (!res.ok) return Response.json({ message: "Das hat nicht geklappt. Bitte versuchen Sie es später erneut." }, { status: 502 });
  markSent(email);
  return Response.json({ ok: true });
}
