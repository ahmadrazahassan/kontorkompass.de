import type { Metadata } from "next";
import Link from "next/link";
import { TextPage } from "@/components/content/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { LinkedInLogo } from "@/components/ui/LinkedInLogo";
import { OPERATOR } from "@/lib/site";

export const metadata: Metadata = { title: "Über uns", description: "Wer hinter Kontorkompass steht und wie wir arbeiten.", alternates: { canonical: "/ueber-uns" } };

export default function Page() {
  return (
    <TextPage title="Über uns" lead="Kontorkompass ist ein unabhängiger Ratgeber für B2B-Software in Deutschland." crumbs={[{ label: "Über uns" }]}>
      <h2>Unser Auftrag</h2>
      <p>
        Wir helfen kleinen und mittleren Unternehmen, Pflichten und Prozesse rund um Business-Software zu verstehen und passende Lösungen zu finden. Unsere
        Schwerpunkte sind Buchhaltung, E-Rechnung, Lohn, HR, ERP und Zeiterfassung.
      </p>
      <h2>Wie wir arbeiten</h2>
      <p>
        Wir stützen uns auf Primärquellen, nennen sie offen und rechnen Preise transparent nach. Details zu unserem Vorgehen finden Sie auf der Seite{" "}
        <Link href="/methodik">Methodik</Link>, zur Finanzierung auf der Seite <Link href="/transparenz">Transparenz</Link>.
      </p>
      <h2>Redaktion</h2>
      <div className="my-4 flex items-center gap-4">
        <Avatar initials="PS" src={OPERATOR.photo} alt={`${OPERATOR.representative}, ${OPERATOR.role} der ${OPERATOR.company}`} size={64} />
        <span className="block">
          <span className="block font-medium text-ink-950">{OPERATOR.representative}</span>
          <span className="block text-[14px] text-ink-500">
            {OPERATOR.role}, {OPERATOR.company}
          </span>
          <a
            href={OPERATOR.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-[14px] no-underline"
          >
            <LinkedInLogo size={16} /> LinkedIn
          </a>
        </span>
      </div>
      <p>
        Verantwortlich für die Inhalte von Kontorkompass ist {OPERATOR.representative}, {OPERATOR.role} der {OPERATOR.company}.
      </p>
      <h2>Kontakt</h2>
      <p>
        Fragen, Hinweise oder Fehler? Schreiben Sie uns über die Seite <Link href="/kontakt">Kontakt</Link>.
      </p>
    </TextPage>
  );
}
