import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageShell";
import { verifySubscription } from "@/lib/newsletter-token";

// Landing page of the confirmation link. Confirming needs a click (POST), because mail scanners open every link.
export const metadata: Metadata = { title: "Newsletter-Anmeldung bestätigen", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  const secret = process.env.NEWSLETTER_SECRET;
  const email = secret ? verifySubscription(token, secret) : null;

  return (
    <>
      <PageHeader title="Anmeldung bestätigen" crumbs={[{ label: "Newsletter", href: "/newsletter" }, { label: "Bestätigen" }]} />
      <div className="container-page border-t border-line pb-24 pt-12">
        {email ? (
          <form method="post" action="/api/newsletter/confirm" className="max-w-xl">
            <input type="hidden" name="token" value={token} />
            <p className="text-[17px] text-ink-700">
              Bitte bestätigen Sie, dass <strong className="font-medium text-ink-950">{email}</strong> den Kontorkompass-Newsletter erhalten soll. Erst danach nehmen wir
              die Adresse in den Verteiler auf.
            </p>
            <button type="submit" className="btn btn-primary btn-md mt-8">
              <span className="btn-label" data-text="Anmeldung bestätigen">
                <span>Anmeldung bestätigen</span>
              </span>
            </button>
            <p className="mt-6 text-[14px] text-ink-500">
              Sie haben sich nicht angemeldet? Dann schließen Sie diese Seite einfach. Hinweise finden Sie in der <Link href="/datenschutz">Datenschutzerklärung</Link>.
            </p>
          </form>
        ) : (
          <div className="max-w-xl">
            <p className="t-h3">Der Bestätigungslink ist ungültig oder abgelaufen.</p>
            <p className="mt-6 text-[15px] text-ink-700">
              Bitte melden Sie sich auf der Seite <Link href="/newsletter">Newsletter</Link> erneut an. Wir senden Ihnen dann einen neuen Link.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
