export const SITE = {
  name: "Kontorkompass",
  domain: "kontorkompass.de",
  url: process.env.SITE_URL ?? "https://www.kontorkompass.de",
  tagline: "Software-Entscheidungen mit Substanz.",
  description:
    "Fundierte Ratgeber zu Buchhaltung, E-Rechnung, Lohn, HR und ERP – mit Quellen, Euro-Preisen und Kostenrechnungen.",
  author: "Redaktion Kontorkompass",
  email: "redaktion@kontorkompass.de",
  /** Share image (1200x630) for pages without their own; made by scripts/make-default-og.mjs. */
  shareImage: "/media/og/default.jpg",
  logo: "/brand/icon-512.png",
};

/** Open Graph image entry for the default share image. */
export const DEFAULT_OG_IMAGE = { url: SITE.shareImage, width: 1200, height: 630, alt: `${SITE.name}: ${SITE.tagline}` };

/**
 * Betreiber der Website: Pflichtangaben für Impressum und Datenschutz.
 * Nur die echten Angaben des tatsächlichen Betreibers eintragen. Leere Felder erscheinen als Platzhalter.
 */
export const OPERATOR = {
  company: "PSG GmbH",
  street: "Egerlandstraße 47a",
  city: "85053 Ingolstadt",
  country: "Deutschland",
  representative: "Patrick Seifert",
  /** Direct address of the person responsible (§ 18 Abs. 2 MStV); general contact stays SITE.email. */
  email: "patrick.seifert@kontorkompass.de",
  registerCourt: "Amtsgericht Ingolstadt",
  registerNumber: "HRB 12213",
  phone: "+49 1590 8023546",
  // USt-IdNr. (falls vorhanden) hier eintragen; leer => Abschnitt wird ausgeblendet.
  vatId: "",
  role: "Geschäftsführer",
  photo: "/media/team/patrick-seifert.webp",
  linkedin: "https://www.linkedin.com/in/patrick-seifert-169332a0/",
};

/** Named author of all Ratgeber and Magazin articles (user decision 2026-11-14). Only real, verifiable details. */
export const AUTHOR = {
  name: OPERATOR.representative,
  initials: "PS",
  role: `${OPERATOR.role}, ${OPERATOR.company}`,
  photo: OPERATOR.photo,
  linkedin: OPERATOR.linkedin,
  profile: "/ueber-uns",
};
