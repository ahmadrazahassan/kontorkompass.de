// Contact form: forwards the message by e-mail via Resend. Nothing is stored in the database.
// Needs RESEND_API_KEY and NEWSLETTER_FROM (verified sender). CONTACT_TO is optional (default: SITE.email).
import { SITE } from "@/lib/site";
import { allow, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Header fields must stay on one line (no injected mail headers). */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(req: Request) {
  const fd = await req.formData();
  if (fd.get("website")) return Response.json({ ok: true }); // honeypot

  const name = oneLine(String(fd.get("name") ?? "")).slice(0, 120);
  const email = oneLine(String(fd.get("email") ?? "")).toLowerCase().slice(0, 200);
  const subject = oneLine(String(fd.get("subject") ?? "")).slice(0, 150);
  const message = String(fd.get("message") ?? "").trim().slice(0, 5000);

  if (!EMAIL.test(email)) return Response.json({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }, { status: 400 });
  if (message.length < 10) return Response.json({ message: "Bitte schreiben Sie uns eine Nachricht mit mindestens 10 Zeichen." }, { status: 400 });
  if (fd.get("privacy") !== "on") return Response.json({ message: "Bitte bestätigen Sie den Hinweis zum Datenschutz." }, { status: 400 });

  // At most 3 messages per IP per 15 minutes.
  if (!allow(`kontakt:${clientIp(req)}`, 3, 15 * 60_000)) {
    return Response.json({ message: "Zu viele Nachrichten in kurzer Zeit. Bitte versuchen Sie es in einigen Minuten erneut." }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM;
  if (!key || !from) {
    return Response.json({ message: `Das Formular ist noch nicht eingerichtet. Bitte schreiben Sie uns an ${SITE.email}.` }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from,
      to: [process.env.CONTACT_TO || SITE.email],
      reply_to: email,
      subject: `Kontaktformular: ${subject || "Nachricht"}`,
      text: `Name: ${name || "(nicht angegeben)"}\nE-Mail: ${email}\nBetreff: ${subject || "(nicht angegeben)"}\n\n${message}`,
      html:
        `<p><strong>Name:</strong> ${esc(name) || "(nicht angegeben)"}<br><strong>E-Mail:</strong> ${esc(email)}<br><strong>Betreff:</strong> ${esc(subject) || "(nicht angegeben)"}</p>` +
        `<p style="white-space:pre-wrap">${esc(message)}</p>`,
    }),
  });
  if (!res.ok) {
    return Response.json({ message: `Das hat nicht geklappt. Bitte versuchen Sie es später erneut oder schreiben Sie an ${SITE.email}.` }, { status: 502 });
  }
  return Response.json({ ok: true });
}
