import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/content/PageShell";

export const metadata: Metadata = { title: "Transparenz: So finanzieren wir uns", description: "Wie sich Kontorkompass finanziert und wie wir Werbelinks kennzeichnen.", alternates: { canonical: "/transparenz" } };

export default function Page() {
  return (
    <TextPage title="So finanzieren wir uns" lead="Kontorkompass ist kostenlos lesbar. Wir finanzieren uns über Partnerprogramme." crumbs={[{ label: "Transparenz" }]}>
      <h2>Werbelinks</h2>
      <p>
        Einige Links auf dieser Website sind Werbelinks (Affiliate-Links). Sie sind mit einem Sternchen (*) gekennzeichnet. Wenn Sie über einen solchen Link ein Produkt testen
        oder kaufen, erhalten wir gegebenenfalls eine Provision. Für Sie entstehen keine Mehrkosten.
      </p>
      <h2>Unsere Partnerprogramme</h2>
      <p>
        Derzeit nehmen wir an keinem Partnerprogramm teil. Alle Links zu Anbietern sind normale Links ohne Provision. Sobald ein Programm aktiv ist, nennen wir es hier und
        kennzeichnen die betroffenen Links mit *.
      </p>
      <h2>Unabhängigkeit</h2>
      <p>
        Die Provision beeinflusst weder Auswahl noch Darstellung. Wir wenden für alle Anbieter dieselben Kriterien an und kennzeichnen bezahlte Platzierungen als „Anzeige“. Reihenfolgen ergeben
        sich allein aus unseren Prüfkriterien und Ihren Angaben, nie aus Provisionen. Mehr dazu unter <Link href="/methodik">Methodik</Link>.
      </p>
      <h2>Keine Verbindung zu Anbietern</h2>
      <p>Wir sind weder Vertreter noch Mitarbeitende der Anbieter, über die wir berichten.</p>
    </TextPage>
  );
}
