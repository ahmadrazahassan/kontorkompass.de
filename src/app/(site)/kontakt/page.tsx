import type { Metadata } from "next";
import { TextPage } from "@/components/content/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { LinkedInLogo } from "@/components/ui/LinkedInLogo";
import { OPERATOR, SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Kontakt", description: "Schreiben Sie uns: Fragen, Hinweise und Korrekturen.", alternates: { canonical: "/kontakt" } };

export default function Page() {
  return (
    <TextPage title="Kontakt" lead="Fragen, Hinweise oder Korrekturen? Wir freuen uns auf Ihre Nachricht." crumbs={[{ label: "Kontakt" }]}>
      <div className="mb-6 flex items-center gap-4">
        <Avatar initials="PS" src={OPERATOR.photo} alt={`${OPERATOR.representative}, ${OPERATOR.role} der ${OPERATOR.company}`} size={56} />
        <span className="block">
          <span className="block font-medium text-ink-950">{OPERATOR.representative}</span>
          <span className="block text-[14px] text-ink-500">
            {OPERATOR.role}, {OPERATOR.company}
          </span>
        </span>
      </div>
      <p>
        Redaktion: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <br />
        {OPERATOR.representative} direkt: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
        <br />
        Telefon: <a href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}>{OPERATOR.phone}</a>
        <br />
        LinkedIn:{" "}
        <a href={OPERATOR.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 no-underline align-middle">
          <LinkedInLogo size={16} /> {OPERATOR.representative}
        </a>
      </p>
      <p>Wir antworten in der Regel innerhalb weniger Werktage.</p>
    </TextPage>
  );
}
