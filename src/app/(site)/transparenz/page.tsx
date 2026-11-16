import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/content/PageShell";
import { getActivePartners } from "@/lib/cms";

export const metadata: Metadata = { title: "Transparenz: So finanzieren wir uns", description: "Wie sich Kontorkompass finanziert und wie wir Werbelinks kennzeichnen.", alternates: { canonical: "/transparenz" } };

export default async function Page() {
  // Read from the CMS, so the list always matches the links that are really marked as Werbelinks.
  const partners = await getActivePartners();
  return (
    <TextPage title="So finanzieren wir uns" lead="Kontorkompass ist kostenlos lesbar. Wir finanzieren uns über Partnerprogramme." crumbs={[{ label: "Transparenz" }]}>
      <h2>Werbelinks</h2>
      <p>
        Einige Links auf dieser Website sind Werbelinks (Provisionslinks). Sie sind mit einem Sternchen (*) gekennzeichnet und führen über eine interne Weiterleitung (/go/…)
        zum Anbieter. Wenn Sie über einen solchen Link ein Produkt testen oder kaufen, erhalten wir gegebenenfalls eine Provision. Für Sie entstehen keine Mehrkosten.
      </p>
      <h2>Unsere Partnerprogramme</h2>
      {partners.length > 0 ? (
        <>
          <p>Mit diesen Anbietern arbeiten wir derzeit über ein Partnerprogramm zusammen:</p>
          <ul>
            {partners.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p>Links zu allen anderen Anbietern sind normale Links ohne Provision. Kommt ein Programm hinzu oder endet es, passen wir diese Liste an.</p>
        </>
      ) : (
        <p>
          Derzeit nehmen wir an keinem Partnerprogramm teil. Alle Links zu Anbietern sind normale Links ohne Provision. Sobald ein Programm aktiv ist, nennen wir es hier und
          kennzeichnen die betroffenen Links mit *.
        </p>
      )}
      <h2>Wo Werbung erscheint</h2>
      <ul>
        <li>Buttons zu einem Partner tragen ein Sternchen (*), darunter steht der Hinweis „Werbelink“.</li>
        <li>Seiten mit Werbelinks zeigen oben einen Hinweis.</li>
        <li>
          Im Feld „Anzeige · Partnerangebote“ auf der Startseite, im Software-Verzeichnis, auf Themenseiten und am Ende passender Beiträge stellen wir ausschließlich Partner vor.
          Dieses Feld ist Werbung und immer als „Anzeige“ gekennzeichnet.
        </li>
      </ul>
      <h2>Unabhängigkeit</h2>
      <p>
        Provisionen beeinflussen weder unsere Software-Profile noch die Prüfkriterien oder die Reihenfolge redaktioneller Listen. Für alle Anbieter gelten dieselben
        Kriterien. Übersichten sortieren wir nach den erfüllten Prüfkriterien, im Software-Finder und im Vergleich ergibt sich die Reihenfolge aus Ihren Angaben. Die
        einzige Ausnahme ist das gekennzeichnete Anzeigenfeld. Mehr dazu unter <Link href="/methodik">Methodik</Link>.
      </p>
      <h2>Keine Verbindung zu Anbietern</h2>
      <p>Wir sind weder Vertreter noch Mitarbeitende der Anbieter, über die wir berichten.</p>
    </TextPage>
  );
}
