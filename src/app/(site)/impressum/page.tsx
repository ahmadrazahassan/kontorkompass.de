import type { Metadata } from "next";
import { Fill, TextPage } from "@/components/content/PageShell";
import { Avatar } from "@/components/ui/Avatar";
import { LinkedInLogo } from "@/components/ui/LinkedInLogo";
import { OPERATOR, SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum", alternates: { canonical: "/impressum" } };

export default function Page() {
  return (
    <TextPage title="Impressum" crumbs={[{ label: "Impressum" }]}>
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        <Fill value={OPERATOR.company} label="FIRMA / NAME" />
        <br />
        <Fill value={OPERATOR.street} label="STRASSE UND HAUSNUMMER" />
        <br />
        <Fill value={OPERATOR.city} label="PLZ UND ORT" />
        <br />
        <Fill value={OPERATOR.country} label="LAND" />
      </p>
      <h2>Vertreten durch</h2>
      <div className="my-3 flex items-center gap-4">
        <Avatar initials="PS" src={OPERATOR.photo} alt={`${OPERATOR.representative}, ${OPERATOR.role} der ${OPERATOR.company}`} size={56} />
        <span className="block">
          <span className="block font-medium text-ink-950">{OPERATOR.representative}</span>
          <span className="block text-[14px] text-ink-500">
            {OPERATOR.role} · {OPERATOR.company}
          </span>
          <a
            href={OPERATOR.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 text-[14px] no-underline"
          >
            <LinkedInLogo size={16} /> LinkedIn-Profil
          </a>
        </span>
      </div>
      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={`tel:${OPERATOR.phone.replace(/\s/g, "")}`}>{OPERATOR.phone}</a>
        <br />
        E-Mail: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
      </p>
      {/* Nur bei eingetragenen Unternehmen. Bei einer Einzelperson ohne Registereintrag entfällt dieser Abschnitt. */}
      <h2>Registereintrag</h2>
      <p>
        Registergericht: <Fill value={OPERATOR.registerCourt} label="REGISTERGERICHT" />
        <br />
        Registernummer: <Fill value={OPERATOR.registerNumber} label="REGISTERNUMMER" />
      </p>
      {/* USt-IdNr. ist nur anzugeben, wenn das Unternehmen eine hat. Wird ausgeblendet, solange OPERATOR.vatId leer ist. */}
      {OPERATOR.vatId ? (
        <>
          <h2>Umsatzsteuer-Identifikationsnummer</h2>
          <p>Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {OPERATOR.vatId}</p>
        </>
      ) : null}
      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <p>
        <Fill value={OPERATOR.representative} label="NAME" />
        <br />
        <Fill value={OPERATOR.street} label="STRASSE UND HAUSNUMMER" />
        <br />
        <Fill value={OPERATOR.city} label="PLZ UND ORT" />
        <br />
        E-Mail: <a href={`mailto:${OPERATOR.email}`}>{OPERATOR.email}</a>
      </p>
      <h2>Bildnachweise</h2>
      <p>
        Die Personenfotos in den Ratgebern und Artikeln sind Symbolbilder, die mit Hilfe künstlicher Intelligenz erstellt wurden. Sie zeigen keine realen Personen oder
        Unternehmen. Logos von Software-Anbietern sind Marken der jeweiligen Inhaber und werden nur zur Kennzeichnung der beschriebenen Produkte verwendet.
      </p>
    </TextPage>
  );
}
