export type Category = { slug: string; name: string; icon: string; description: string; intro: string };

export const CATEGORIES: Category[] = [
  {
    slug: "buchhaltung-finanzen",
    name: "Buchhaltung & Finanzen",
    icon: "Calculator",
    description: "Software, GoBD, Steuern und Abschluss",
    intro:
      "Buchhaltung ist Pflicht, aber nicht jede Lösung passt zu jedem Betrieb. Hier finden Sie Leitfäden zu Anforderungen, Kosten und Zusammenarbeit mit dem Steuerbüro.",
  },
  {
    slug: "rechnungsstellung-e-rechnung",
    name: "Rechnungsstellung & E-Rechnung",
    icon: "Receipt",
    description: "Pflichten, Formate und Umsetzung",
    intro:
      "Die E-Rechnung wird schrittweise Pflicht. Diese Ratgeber erklären Fristen, Formate, Ausnahmen und die Anforderungen an Ihre Software.",
  },
  {
    slug: "lohn-gehalt",
    name: "Lohn & Gehalt",
    icon: "Money",
    description: "Abrechnung, Meldungen und Fristen",
    intro: "Lohnabrechnung intern oder extern, mit oder ohne Software: Hier erfahren Sie, worauf es ankommt.",
  },
  {
    slug: "hr-personal",
    name: "HR & Personal",
    icon: "IdentificationBadge",
    description: "Personalakte, Urlaub und HR-Software",
    intro: "Personalprozesse digital organisieren: Pflichten, Module und Kosten verständlich erklärt.",
  },
  {
    slug: "erp-warenwirtschaft",
    name: "ERP & Warenwirtschaft",
    icon: "Package",
    description: "Auswahl, Einführung und Kosten",
    intro: "ERP-Projekte sind Mittelstandsprojekte. Diese Leitfäden helfen bei Auswahl, Einführung und Kostenplanung.",
  },
  {
    slug: "zeiterfassung",
    name: "Zeiterfassung",
    icon: "Clock",
    description: "Pflichten und passende Systeme",
    intro: "Arbeitszeiterfassung: Was Arbeitgeber wissen müssen und welche Systeme dafür infrage kommen.",
  },
  {
    slug: "digitalisierung-datenschutz",
    name: "Digitalisierung & Datenschutz",
    icon: "Cloud",
    description: "KI, Cloud-Software, DSGVO und Bürokratieabbau",
    intro:
      "Digitalisierung betrifft jeden Fachbereich: Cloud-Software, KI-Funktionen und digitale Abläufe sollen Zeit sparen, werfen aber Fragen zu Datenschutz und Auftragsverarbeitung auf. Hier finden Sie Beiträge zu Zahlen, Pflichten und einem sinnvollen Einstieg.",
  },
];

export const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);

export type Source = { id: number; publisher: string; title: string; url: string; accessed: string };

export const SOURCES_ERECHNUNG: Source[] = [
  {
    id: 1,
    publisher: "IHK Region Stuttgart",
    title: "Obligatorische E-Rechnungen für inländische B2B-Umsätze",
    url: "https://www.ihk.de/stuttgart/fuer-unternehmen/recht-und-steuern/steuerrecht/steuermeldungen/e-rechnungen-5864496",
    accessed: "2026-11-06",
  },
  {
    id: 2,
    publisher: "IHK Frankfurt am Main",
    title: "E-Rechnungspflicht ab 2025",
    url: "https://www.frankfurt-main.ihk.de/recht/uebersicht-alle-rechtsthemen/steuerrecht/umsatzsteuer-national/e-rechnungspflicht-ab-2025-6055774",
    accessed: "2026-11-06",
  },
  {
    id: 3,
    publisher: "Haufe",
    title: "Aufbewahrungsfristen (Prof. Rolf-Rüdiger Radeisen)",
    url: "https://www.haufe.de/id/beitrag/aufbewahrungsfristen-HI844776.html",
    accessed: "2026-11-06",
  },
  {
    id: 4,
    publisher: "Sage GmbH",
    title: "Sage Active (Produkt- und Preisseite)",
    url: "https://www.sage.com/de-de/produkte/sage-active/",
    accessed: "2026-11-06",
  },
  {
    id: 5,
    publisher: "Lexware",
    title: "Preise Lexware Office",
    url: "https://www.lexware.de/preise/",
    accessed: "2026-11-06",
  },
  {
    id: 6,
    publisher: "sevdesk",
    title: "Preise",
    url: "https://sevdesk.de/preise/",
    accessed: "2026-11-06",
  },
];

export type GlossaryTerm = { slug: string; term: string; short: string; body: string[]; sourceIds: number[] };

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "e-rechnung",
    term: "E-Rechnung",
    short:
      "Eine Rechnung in einem strukturierten elektronischen Format, das der europäischen Norm EN 16931 entspricht und maschinell verarbeitet werden kann.",
    body: [
      "Nach § 14 Abs. 1 UStG ist eine E-Rechnung eine Rechnung, die in einem strukturierten elektronischen Format ausgestellt, übermittelt und empfangen wird und eine elektronische Verarbeitung ermöglicht. Sie muss der europäischen Norm EN 16931 entsprechen. Alternativ können Aussteller und Empfänger ein anderes Format vereinbaren, wenn sich daraus die erforderlichen Daten extrahieren lassen.",
      "Eine PDF-Rechnung per E-Mail ist keine E-Rechnung. Sie gilt als sonstige Rechnung.",
    ],
    sourceIds: [1],
  },
  {
    slug: "xrechnung",
    term: "XRechnung",
    short: "Ein reines XML-Format für E-Rechnungen, das erst mit passender Software lesbar wird.",
    body: [
      "Die XRechnung ist eines der beiden in Deutschland verbreiteten Formate für E-Rechnungen. Sie besteht ausschließlich aus strukturierten Daten und ist ohne Anzeige-Software für Menschen kaum lesbar.",
    ],
    sourceIds: [1],
  },
  {
    slug: "zugferd",
    term: "ZUGFeRD",
    short: "Ein hybrides Format aus lesbarem PDF und eingebetteter XML-Datei.",
    body: [
      "Nach dem BMF-Schreiben vom 15. Oktober 2024 ist ZUGFeRD ab Version 2.0.1 als E-Rechnung zulässig. Beim Ausdrucken einer ZUGFeRD-Rechnung geht die eingebettete XML-Datei verloren. Ein Ausdruck ersetzt die Originaldatei deshalb nicht.",
    ],
    sourceIds: [1],
  },
  {
    slug: "en-16931",
    term: "EN 16931",
    short: "Die europäische Norm für das semantische Datenmodell der elektronischen Rechnung.",
    body: [
      "E-Rechnungen im Sinne des deutschen Umsatzsteuergesetzes müssen dieser Norm entsprechen. Nicht jedes Rechnungsprofil erfüllt sie. Lassen Sie sich vom Softwareanbieter bestätigen, dass die erzeugten Rechnungen konform sind.",
    ],
    sourceIds: [1, 2],
  },
  {
    slug: "kleinbetragsrechnung",
    term: "Kleinbetragsrechnung",
    short: "Eine Rechnung über einen Gesamtbetrag von bis zu 250 € brutto (§ 33 UStDV), für die keine E-Rechnung erforderlich ist.",
    body: [
      "Kleinbetragsrechnungen sind von der Pflicht zur E-Rechnung ausgenommen. Andere Rechnungsformen dürfen weiterhin verwendet werden.",
    ],
    sourceIds: [1, 2],
  },
  {
    slug: "sonstige-rechnung",
    term: "Sonstige Rechnung",
    short: "Eine Rechnung in Papierform oder in einem anderen elektronischen Format, etwa als PDF.",
    body: [
      "Sonstige Rechnungen sind in Übergangszeiträumen noch zulässig. Elektronische Formate wie PDF dürfen nur mit Zustimmung des Empfängers verwendet werden.",
    ],
    sourceIds: [1, 2],
  },
];

export const termBySlug = (s: string) => GLOSSARY.find((t) => t.slug === s);

// ---------------- Software ----------------
export type Plan = {
  name: string;
  monthlyNet: number | null;
  billing: string;
  includes: string;
  promo?: string;
  // Pricing model (only published vendor prices) for calculators and charts
  unit?: "flat" | "perUser" | "perEmployee";
  includedUsers?: number | null;
  extraUserMonthly?: number | null;
  includedEmployees?: number | null;
  extraEmployeeMonthly?: number | null;
  minMonthly?: number | null;
  annualMonthly?: number | null;
  promoMonthly?: number | null;
  promoMonths?: number | null;
};
export type Check = { criterion: string; status: "yes" | "partial" | "no" | "unknown" | "na"; note?: string };
export type Software = {
  slug: string;
  name: string;
  vendor: string;
  categories: string[];
  summary: string;
  affiliateSlug: string;
  isAffiliate: boolean;
  ctaLabel: string;
  facts: [string, string][];
  plans: Plan[];
  priceNote?: string;
  fits: string[];
  notFits: string[];
  alternatives: string[];
  sourceIds: number[];
  verified: string;
  trial: string;
  entryPrice: number | null;
  scenarioBasis?: "users" | "employees" | "none";
  verdict?: string;
  review?: unknown;
  checks?: Check[];
};

export const SOFTWARE: Software[] = [
  {
    slug: "sage-active",
    name: "Sage Active",
    vendor: "Sage GmbH",
    categories: ["buchhaltung-finanzen", "rechnungsstellung-e-rechnung", "lohn-gehalt"],
    summary:
      "Cloud-Lösung für Angebote, Rechnungen, Buchhaltung und Lohn, ausgerichtet auf kleine Unternehmen mit 1 bis 50 Beschäftigten.",
    affiliateSlug: "sage-active-testen",
    isAffiliate: false,
    ctaLabel: "Kostenlos testen",
    facts: [
      ["Bereitstellung", "Cloud (Browser); Mobile App laut Anbieter"],
      ["Zielgruppe", "kleine Unternehmen, 1–50 Beschäftigte"],
      ["Tarife", "Starter, Essentials"],
      ["Einstiegspreis", "25,00 € pro Monat zzgl. MwSt. (regulär)"],
      ["Testphase", "Starter: 14 Tage, ohne Kreditkarte · Essentials: 30 Tage, mit Zahlungsdaten"],
      ["Kündigung", "jederzeit zum Ende des laufenden Abrechnungsmonats"],
      ["E-Rechnung", "Einlesen von XRechnung und ZUGFeRD in beiden Tarifen laut Anbieter; das Erstellen beschreibt die Produktseite nicht ausdrücklich"],
      ["Steuer & Steuerbüro", "USt-Voranmeldung per ELSTER, Export im DATEV-Format (Essentials)"],
      ["Kontenrahmen", "SKR03 und SKR04"],
      ["GoBD", "laut Anbieter GoBD-konform („zertifizierte Software“)"],
      ["Serverstandort / AVV", "Microsoft Azure, Rechenzentrum in Deutschland (laut Unterauftragsverarbeiter-Liste von Sage; die Produktseite nennt keinen Standort). AVV auf der Produktseite nicht erwähnt"],
    ],
    plans: [
      {
        name: "Starter",
        monthlyNet: 25,
        billing: "monatlich kündbar",
        includes: "Angebote & Rechnungen; 1 Unternehmen, 5 Nutzende, 300 Rechnungen/Monat; weitere Nutzende 5 € je Monat",
        promo: "Aktion zum Stichtag: 12,50 € für 3 Monate (50 % Rabatt)",
      },
      {
        name: "Essentials",
        monthlyNet: 49,
        billing: "monatlich kündbar",
        includes:
          "Buchhaltung & Lohnabrechnung; 1 Unternehmen, 10 Nutzende, 2 Beschäftigte, 500 Rechnungen/Monat; weitere Nutzende 10 € je Monat; weitere Beschäftigte 3 € je Monat",
        promo: "Aktion zum Stichtag: 24,50 € für 3 Monate (50 % Rabatt)",
      },
    ],
    priceNote:
      "Weitere Rechnungen: 0,05 € je Rechnung oder Rechnungspakete (z. B. 100 Rechnungen für 10 €). Alle Preise zzgl. MwSt.",
    fits: [
      "kleine Unternehmen, die Rechnungsstellung, Buchhaltung und Lohn in einer Cloud-Lösung bündeln möchten",
      "Betriebe, die mit einem Steuerbüro zusammenarbeiten (Export im DATEV-Format)",
    ],
    notFits: [
      "Unternehmen mit mehreren Gesellschaften oder komplexen Finanzprozessen; Sage selbst verweist hier auf Sage Intacct",
      "Handel und Fertigung mit Lager- und Produktionssteuerung; dafür nennt Sage ERP-Lösungen wie Sage Operations oder Sage 100",
    ],
    alternatives: ["lexware-office", "sevdesk"],
    sourceIds: [4],
    verified: "2026-11-06",
    trial: "14 bzw. 30 Tage",
    entryPrice: 25,
  },
  {
    slug: "lexware-office",
    name: "Lexware Office",
    vendor: "Lexware",
    categories: ["buchhaltung-finanzen", "rechnungsstellung-e-rechnung"],
    summary:
      "Cloud-Lösung in vier Versionen (S, M, L, XL) von der Belegerfassung bis zu Buchhaltung und Abschlagsrechnungen. Lohn & Gehalt ist optional kombinierbar.",
    affiliateSlug: "lexware-office",
    isAffiliate: false,
    ctaLabel: "Zum Anbieter",
    facts: [
      ["Versionen", "S, M, L, XL"],
      ["Einstiegspreis", "7,90 € pro Monat zzgl. MwSt. (Version S, regulär)"],
      ["Abrechnung", "monatlich kündbar (laut Anbieter)"],
      ["Testphase", "30 Tage, kostenlos und unverbindlich; enthält laut Anbieter alle XL-Funktionen und Lohn & Gehalt"],
      ["E-Rechnung", "Empfangen in allen Versionen; Erstellen und Übermitteln (ZUGFeRD, XRechnung) ab Version M laut Anbieter"],
      ["Lohn & Gehalt", "optionales Modul, kombinierbar mit allen Versionen; Staffeln von bis 2 bis bis 50 Mitarbeitenden"],
      ["Nutzerzahl", "auf der Preisseite nicht angegeben"],
    ],
    plans: [
      { name: "S", monthlyNet: 7.9, billing: "monatlich", includes: "Belegerfassung und -archiv", promo: "Aktion: 3,95 € für 3 Monate (50 % Rabatt)" },
      { name: "M", monthlyNet: 12.9, billing: "monatlich", includes: "Angebote, (E-)Rechnungen und Mahnungen", promo: "Aktion: 6,45 € für 3 Monate" },
      { name: "L", monthlyNet: 21.9, billing: "monatlich", includes: "Buchhaltung, EÜR und Umsatzsteuer", promo: "Aktion: 10,95 € für 3 Monate" },
      { name: "XL", monthlyNet: 32.9, billing: "monatlich", includes: "EU- und Abschlagsrechnungen, API", promo: "Aktion: 16,45 € für 3 Monate" },
    ],
    priceNote: "Alle Preise pro Monat zzgl. MwSt. Zahlung per Lastschrift oder Kreditkarte (laut Anbieter).",
    fits: ["Selbstständige und kleine Unternehmen, die mit einem günstigen Einstiegstarif starten möchten"],
    notFits: ["Unternehmen, die eine Lösung für Warenwirtschaft oder Fertigung suchen"],
    alternatives: ["sage-active", "sevdesk"],
    sourceIds: [5],
    verified: "2026-11-06",
    trial: "30 Tage",
    entryPrice: 7.9,
  },
  {
    slug: "sevdesk",
    name: "sevdesk",
    vendor: "sevdesk",
    categories: ["buchhaltung-finanzen", "rechnungsstellung-e-rechnung"],
    summary:
      "Cloud-Lösung mit einem dauerhaft kostenlosen Tarif sowie den Tarifen Rechnung, Buchhaltung und Buchhaltung Pro.",
    affiliateSlug: "sevdesk",
    isAffiliate: false,
    ctaLabel: "Zum Anbieter",
    facts: [
      ["Tarife", "Kostenlos, Rechnung, Buchhaltung, Buchhaltung Pro"],
      ["Einstiegspreis", "0 € (3 Rechnungen/E-Rechnungen pro Monat); bezahlt ab 11,90 € pro Monat zzgl. MwSt. bei monatlicher Abrechnung (regulär)"],
      ["Nutzende", "1 Nutzer inklusive; weiterer Benutzer 5,90 € pro Monat"],
      ["E-Rechnung", "ZUGFeRD und XRechnung; unbegrenzt in den bezahlten Tarifen"],
      ["Steuerbüro", "DATEV/ADDISON-Schnittstelle ab Tarif Rechnung"],
      ["Testphase", "„Kostenlos testen“ angeboten; Dauer auf der Preisseite nicht angegeben"],
    ],
    plans: [
      { name: "Kostenlos", monthlyNet: 0, billing: "dauerhaft kostenlos", includes: "3 Rechnungen/E-Rechnungen pro Monat" },
      { name: "Rechnung", monthlyNet: 11.9, billing: "monatlich (12 Monate: 9,90 €; 24 Monate: 8,90 €)", includes: "unbegrenzte (E-)Rechnungen, Angebote, Mahnungen, DATEV/ADDISON-Schnittstelle" },
      { name: "Buchhaltung", monthlyNet: 25.9, billing: "monatlich (12 Monate: 22,90 €; 24 Monate: 19,90 €)", includes: "zusätzlich Buchhaltung, UStVA per ELSTER, EÜR/GuV, Bankanbindung" },
      { name: "Buchhaltung Pro", monthlyNet: 34.9, billing: "monatlich (12 Monate: 30,90 €; 24 Monate: 27,90 €)", includes: "zusätzlich Kostenstellen, REST-API, BWA" },
    ],
    priceNote:
      "Die Preisseite zeigte zum Stichtag mehrere Aktionspreise (u. a. bis zu 50 % Rabatt). Hier sind die regulär durchgestrichenen Preise genannt; vor Veröffentlichung erneut prüfen.",
    fits: ["Selbstständige und kleine Unternehmen, die mit wenigen Rechnungen kostenlos starten möchten"],
    notFits: ["Unternehmen mit Lohnabrechnung als Kernanforderung (auf der Preisseite nicht aufgeführt)"],
    alternatives: ["sage-active", "lexware-office"],
    sourceIds: [6],
    verified: "2026-11-06",
    trial: "laut Anbieter",
    entryPrice: 0,
  },
];

export const softwareBySlug = (s: string) => SOFTWARE.find((x) => x.slug === s);

// ---------------- Guides / Articles ----------------
export type Doc = {
  slug: string;
  kind: "ratgeber" | "magazin";
  title: string;
  seoTitle: string;
  description: string;
  lead: string;
  category: string;
  readingMinutes: number;
  published: string;
  updated: string;
  hasAffiliate: boolean;
  legalDisclaimer: boolean;
  takeaways: string[];
  toc: { id: string; label: string }[];
  sourceIds: number[];
  faqs: { q: string; a: string }[];
  coverSeed: number;
};

export const DOCS: Doc[] = [
  {
    slug: "e-rechnung-2027-pflicht-unternehmen",
    kind: "ratgeber",
    title: "E-Rechnung ab 2027: Was Unternehmen mit mehr als 800.000 € Umsatz jetzt umsetzen müssen",
    seoTitle: "E-Rechnung ab 2027: Was Unternehmen jetzt umsetzen müssen",
    description:
      "Ab 1. Januar 2027 müssen Unternehmen mit mehr als 800.000 € Vorjahresumsatz E-Rechnungen ausstellen. Wer betroffen ist, was zählt und wie Sie sich vorbereiten.",
    lead: "Seit 2025 müssen alle Unternehmen in Deutschland E-Rechnungen empfangen können. Ab dem 1. Januar 2027 kommt für umsatzstarke Betriebe die Pflicht hinzu, sie auch auszustellen. Dieser Ratgeber zeigt, wer betroffen ist, was als E-Rechnung zählt und wie Sie die Umstellung in sieben Schritten organisieren.",
    category: "rechnungsstellung-e-rechnung",
    readingMinutes: 11,
    published: "2026-11-06",
    updated: "2026-11-06",
    hasAffiliate: true,
    legalDisclaimer: true,
    takeaways: [
      "Empfangen: Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen empfangen können, auch Kleinunternehmer. Als Übergang reicht dafür ein E-Mail-Postfach.",
      "Ausstellen ab 2027: Wer 2026 einen Gesamtumsatz von mehr als 800.000 € erzielt, muss ab dem 1. Januar 2027 für inländische B2B-Umsätze E-Rechnungen ausstellen.",
      "Ausstellen ab 2028: Ab dem 1. Januar 2028 gilt die Pflicht für alle inländischen Unternehmen.",
      "Ein PDF ist keine E-Rechnung. Als E-Rechnung gilt nur ein strukturiertes Format nach EN 16931, etwa XRechnung oder ZUGFeRD ab Version 2.0.1.",
      "Ausnahmen gibt es unter anderem für Kleinbetragsrechnungen bis 250 € und Fahrausweise.",
    ],
    toc: [
      { id: "was-sich-aendert", label: "Was sich zum 1. Januar 2027 ändert" },
      { id: "betroffen", label: "Ist mein Unternehmen betroffen?" },
      { id: "zeitplan", label: "Der Zeitplan im Überblick" },
      { id: "was-zaehlt", label: "Was als E-Rechnung zählt" },
      { id: "ausnahmen", label: "Ausnahmen" },
      { id: "empfang", label: "Empfang: Was seit 2025 gilt" },
      { id: "archivierung", label: "Archivierung" },
      { id: "sieben-schritte", label: "In 7 Schritten startklar" },
      { id: "software", label: "Was Ihre Software können muss" },
      { id: "kosten", label: "Was Software kostet" },
      { id: "faq", label: "Häufige Fragen" },
    ],
    sourceIds: [1, 2, 3, 4, 5, 6],
    faqs: [
      {
        q: "Reicht es, wenn ich PDF-Rechnungen per E-Mail verschicke?",
        a: "Bis zum Ende Ihrer Übergangsfrist ist das mit Zustimmung des Empfängers möglich. Danach nicht mehr: Ein PDF ist keine E-Rechnung im Sinne des Gesetzes.",
      },
      {
        q: "Muss ich als Kleinunternehmer E-Rechnungen ausstellen?",
        a: "Nein, Kleinunternehmer dürfen weiterhin andere Rechnungen ausstellen. Sie müssen E-Rechnungen aber empfangen können.",
      },
      {
        q: "Welcher Umsatz zählt für die 800.000-€-Grenze?",
        a: "Der umsatzsteuerliche Gesamtumsatz des Vorjahres, für die Pflicht ab 2027 also der Gesamtumsatz 2026. Klären Sie Grenzfälle mit Ihrem Steuerbüro.",
      },
      {
        q: "Gilt die Pflicht auch für Rechnungen an Privatkunden?",
        a: "Nein. Die Pflicht betrifft Umsätze zwischen inländischen Unternehmen.",
      },
      {
        q: "Darf ich weiterhin EDI nutzen?",
        a: "Im Jahr 2027 ist das EDI-Verfahren mit Zustimmung des Empfängers zulässig. Darüber hinaus bleibt EDI möglich, wenn sich daraus die nötigen Rechnungsdaten korrekt und vollständig extrahieren lassen.",
      },
    ],
    coverSeed: 11,
  },
  {
    slug: "e-rechnung-fristen-bis-2028",
    kind: "magazin",
    title: "E-Rechnung: Alle Fristen bis 2028 auf einen Blick",
    seoTitle: "E-Rechnung: Alle Fristen bis 2028 im Überblick",
    description: "Empfang seit 2025, Ausstellung ab 2027 und 2028: die Fristen der E-Rechnung in einer Übersicht.",
    lead: "Die E-Rechnung wird in Stufen eingeführt. Diese Übersicht fasst zusammen, was wann gilt, und verweist auf die ausführlichen Ratgeber.",
    category: "rechnungsstellung-e-rechnung",
    readingMinutes: 3,
    published: "2026-11-06",
    updated: "2026-11-06",
    hasAffiliate: false,
    legalDisclaimer: true,
    takeaways: [
      "Seit 1. Januar 2025: Empfang von E-Rechnungen für alle inländischen Unternehmen.",
      "Ab 1. Januar 2027: Ausstellungspflicht bei mehr als 800.000 € Gesamtumsatz im Vorjahr.",
      "Ab 1. Januar 2028: Ausstellungspflicht für alle inländischen Unternehmen im B2B.",
    ],
    toc: [{ id: "uebersicht", label: "Die Fristen im Überblick" }],
    sourceIds: [1, 2],
    faqs: [],
    coverSeed: 27,
  },
];

export const docBySlug = (kind: Doc["kind"], slug: string) => DOCS.find((d) => d.kind === kind && d.slug === slug);

export const TIMELINE = [
  { when: "seit 1. Januar 2025", what: "E-Rechnungen empfangen können (E-Mail-Postfach reicht als Übergang)", who: "alle inländischen Unternehmen, auch Kleinunternehmer" },
  { when: "2025–2026", what: "Papierrechnungen weiter erlaubt; andere elektronische Formate (z. B. PDF) mit Zustimmung", who: "alle" },
  { when: "ab 1. Januar 2027", what: "E-Rechnungen ausstellen", who: "Unternehmen mit mehr als 800.000 € Gesamtumsatz im Vorjahr" },
  { when: "2027", what: "Sonstige Rechnungen weiterhin möglich; EDI-Verfahren mit Zustimmung", who: "Unternehmen bis 800.000 € Vorjahresumsatz (EDI: alle)" },
  { when: "ab 1. Januar 2028", what: "E-Rechnungen ausstellen", who: "alle inländischen Unternehmen für inländische B2B-Umsätze" },
];
