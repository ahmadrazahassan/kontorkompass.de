import type { Metadata } from "next";
import { PageHeader } from "@/components/content/PageShell";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export const metadata: Metadata = { title: "Newsletter", description: "Neue Ratgeber und wichtige Fristen, einmal im Monat in Ihrem Postfach.", alternates: { canonical: "/newsletter" } };

export default async function Page({ searchParams }: { searchParams: Promise<{ bestaetigt?: string; fehler?: string }> }) {
  const { bestaetigt, fehler } = await searchParams;
  return (
    <>
      <PageHeader title="Newsletter" lead="Neue Ratgeber und wichtige Fristen, einmal im Monat in Ihrem Postfach." eyebrow="Kostenlos" crumbs={[{ label: "Newsletter" }]} />
      <div className="container-page border-t border-line pb-24 pt-12">
        {bestaetigt ? (
          <p className="t-h3">Vielen Dank, Ihre Anmeldung ist bestätigt.</p>
        ) : fehler ? (
          <>
            <p className="t-h3">Der Bestätigungslink ist ungültig oder abgelaufen.</p>
            <p className="mt-6 max-w-xl text-[15px] text-ink-700">Bitte melden Sie sich erneut an – wir senden Ihnen dann einen neuen Bestätigungslink.</p>
            <div className="mt-8">
              <NewsletterForm id="page" />
            </div>
          </>
        ) : (
          <>
            <NewsletterForm id="page" />
            <p className="mt-8 max-w-xl text-[15px] text-ink-700">
              Sie erhalten nach der Anmeldung eine E-Mail mit einem Bestätigungslink (Double-Opt-in). Erst danach nehmen wir Sie in den Verteiler auf. Abmelden können Sie sich in jeder
              E-Mail.
            </p>
          </>
        )}
      </div>
    </>
  );
}
