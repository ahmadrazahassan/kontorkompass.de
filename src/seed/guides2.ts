// Second batch: 7 guides, 4 sources, Sage 100 and Sage HR Suite profiles. Safe to re-run.
// Run: pnpm exec payload run src/seed/guides2.ts
import { getPayload } from "payload";
import config from "../../payload.config";
import { affiliateCta, callout, doc, h2, p, steps, table, ul } from "./lexical";

const payload = await getPayload({ config });
const day = (s: string) => new Date(`${s}T12:00:00.000Z`).toISOString();
const TODAY = "2026-11-06";
const first = async (collection: any, where: any) => (await payload.find({ collection, where, limit: 1, depth: 0 })).docs[0] as any;
const cat = async (slug: string) => (await first("categories", { slug: { equals: slug } })).id;
const srcId = async (n: number) => (await first("sources", { number: { equals: n } })).id;
const swId = async (slug: string) => (await first("software", { slug: { equals: slug } })).id;
const T = (arr: string[]) => arr.map((text) => ({ text }));

/* ---------- sources ---------- */
const NEW_SOURCES = [
  { number: 12, publisher: "Sage GmbH (Anbieterblog Sage Advice)", title: "ERP-Einführung: Kosten, Dauer und typische Fehler (11.08.2026)", url: "https://www.sage.com/de-de/blog/erp-einfuehrung-kosten-dauer-fehler/", type: "anbieter" },
  { number: 13, publisher: "Sage GmbH", title: "Sage 100: ERP-Software (Produkt- und Preisseite)", url: "https://www.sage.com/de-de/produkte/sage-100/", type: "anbieter" },
  { number: 14, publisher: "Sage GmbH", title: "Sage HR Suite: Personalsoftware (Produkt- und Preisseite)", url: "https://www.sage.com/de-de/produkte/sage-hr-suite-personal-software/", type: "anbieter" },
  { number: 15, publisher: "Sage GmbH", title: "Sage Preise und Pläne", url: "https://www.sage.com/de-de/preise/", type: "anbieter" },
];
for (const s of NEW_SOURCES) {
  if (!(await first("sources", { number: { equals: s.number } }))) await payload.create({ collection: "sources", data: { ...s, type: s.type as never, accessedAt: day(TODAY) } });
}

/* ---------- profiles ---------- */
const mkLink = async (slug: string, url: string) =>
  (await first("affiliate-links", { slug: { equals: slug } })) ??
  (await payload.create({ collection: "affiliate-links", data: { slug, partner: "Sage", trackingUrl: url, isAffiliate: false, network: "Impact (nach Freigabe)", active: true } }));

if (!(await first("software", { slug: { equals: "sage-100" } }))) {
  const link = await mkLink("sage-100-angebot", "https://www.sage.com/de-de/produkte/sage-100/");
  await payload.create({
    collection: "software",
    data: {
      name: "Sage 100",
      slug: "sage-100",
      vendor: "Sage GmbH",
      categories: [await cat("erp-warenwirtschaft"), await cat("buchhaltung-finanzen")] as never,
      summary: "Modulare ERP-Software für mittelständische Unternehmen mit Warenwirtschaft, Rechnungswesen und Produktion, lokal oder in der Cloud nutzbar.",
      affiliateLink: link.id,
      ctaLabel: "Angebot anfordern",
      trial: "Produkttour; Testphase nicht angegeben",
      entryPrice: 56,
      facts: [
        { label: "Zielgruppe", value: "mittelständische Unternehmen; Sage nennt 10 bis 250 Mitarbeitende" },
        { label: "Bereitstellung", value: "lokal (On-Premise) oder Cloud; Cloud laut Anbieter in deutschen Rechenzentren" },
        { label: "Kernmodule", value: "Warenwirtschaft, Rechnungswesen, Produktion" },
        { label: "Einstiegspreis", value: "ab 56 € pro Monat und Nutzer (Modul Warenwirtschaft), zzgl. MwSt." },
        { label: "Vertragsbedingungen", value: "Preise gelten bei jährlicher Rechnungsstellung mit 12-monatiger Mindestvertragslaufzeit; andere Laufzeiten optional" },
        { label: "E-Rechnung", value: "Erstellen und Versenden (XRechnung, ZUGFeRD) sowie zentraler Rechnungseingang laut Anbieter" },
        { label: "Steuerbüro", value: "DATEV-Export und -Import, USt-Voranmeldung über ELSTER (Modul Rechnungswesen)" },
        { label: "Mehrere Gesellschaften", value: "unbegrenzte Mandantenanzahl laut Anbieter" },
        { label: "Erweiterbar", value: "laut Anbieter mit über 200 Anwendungen und Branchenlösungen zertifizierter Partner" },
        { label: "AVV", value: "auf der Produktseite nicht erwähnt" },
      ],
      plans: [
        { name: "Modul Warenwirtschaft", monthlyNet: 56, billing: "ab, pro Monat und Nutzer, jährliche Rechnungsstellung, 12 Monate Mindestlaufzeit", includes: "Kunden- und Lieferantenverwaltung, Artikel und Preislisten, Auftrags- und Bestellwesen, Lagerverwaltung und Inventur, Seriennummern und Chargen" },
        { name: "Modul Rechnungswesen", monthlyNet: 58, billing: "ab, pro Monat und Nutzer, jährliche Rechnungsstellung, 12 Monate Mindestlaufzeit", includes: "Controlling und Dashboard, Finanz- und Anlagenbuchhaltung, Kassenbuch, Zahlungsverkehr, Bilanzierung und Kostenrechnung, DATEV-Export/-Import, USt-Voranmeldung via ELSTER" },
        { name: "Modul Produktion", monthlyNet: 90, billing: "ab, pro Monat und Nutzer, jährliche Rechnungsstellung, 12 Monate Mindestlaufzeit", includes: "inkl. Warenwirtschaftspaket; Fertigungssteuerung, Ressourcenliste, CAD-Schnittstelle, Simulation, Vor- und Nachkalkulation, BDE, Fremdfertigung, Projektfertigung" },
      ],
      priceNote: "Preise zzgl. MwSt., Stand 06.11.2026. Ein Angebot erhalten Sie über die Anfrage beim Anbieter; der Gesamtpreis hängt von Modulen und Nutzerzahl ab.",
      fits: T(["mittelständische Unternehmen, die Warenwirtschaft, Rechnungswesen und Produktion in einer Lösung abbilden möchten", "Betriebe mit individuellen Prozessen, die eine anpassbare Lösung suchen"]),
      notFits: T(["sehr kleine Unternehmen, die nur Rechnungen und Buchhaltung brauchen (dafür nennt Sage Active)", "Unternehmen mit komplexen internationalen Strukturen; dafür verweist Sage auf Sage X3"]),
      sources: [await srcId(13), await srcId(15)] as never,
      verified: day(TODAY),
    },
  });
}

if (!(await first("software", { slug: { equals: "sage-hr-suite" } }))) {
  const link = await mkLink("sage-hr-suite-angebot", "https://www.sage.com/de-de/produkte/sage-hr-suite-personal-software/");
  await payload.create({
    collection: "software",
    data: {
      name: "Sage HR Suite",
      slug: "sage-hr-suite",
      vendor: "Sage GmbH",
      categories: [await cat("hr-personal"), await cat("lohn-gehalt"), await cat("zeiterfassung")] as never,
      summary: "Modulare Personalsoftware mit Personalabrechnung, Zeitmanagement und Bewerbermanagement, als Cloud- oder lokale Lösung.",
      affiliateLink: link.id,
      ctaLabel: "Angebot anfordern",
      trial: "Produkttour; Testphase nicht angegeben",
      entryPrice: 39,
      facts: [
        { label: "Zielgruppe", value: "Unternehmen mit umfassenden oder komplexen HR-Prozessen; auf der Preisseite für 50+ Mitarbeitende genannt" },
        { label: "Bereitstellung", value: "lokal installiert oder Cloud (laut Anbieter wählbar)" },
        { label: "Aufbau", value: "modular: Module lassen sich Schritt für Schritt einführen" },
        { label: "Einstiegspreis", value: "ab 39 € pro Monat zzgl. MwSt. (Modul Personalabrechnung)" },
        { label: "Vertragsbedingungen", value: "Preis gilt inkl. Softwarewartung für einen Arbeitsplatz bei jährlicher Rechnungsstellung mit zwölfmonatiger Mindestvertragslaufzeit; andere Laufzeiten optional" },
        { label: "Abrechnung", value: "laut Anbieter auch komplexe Fälle wie Altersteilzeit, Zuschläge, Kurzarbeit, Versorgungsbezüge und betriebliche Altersvorsorge" },
        { label: "Meldewesen", value: "automatisierte elektronische Meldungen laut Anbieter" },
        { label: "Digitale Personalakte", value: "zentrale Ablage von Personaldokumenten; ob rechtliche Anforderungen erfüllt sind, hängt laut Anbieter von Vorgaben, Prozessen und Nutzung ab" },
        { label: "AVV / Serverstandort", value: "Gehostete Variante: Rechenzentrum der Microsoft GmbH in Deutschland laut Unterauftragsverarbeiter-Liste von Sage; die Produktseite nennt weder Standort noch AVV" },
      ],
      plans: [
        { name: "Personalabrechnung", monthlyNet: 39, billing: "ab, pro Monat, jährliche Rechnungsstellung, 12 Monate Mindestlaufzeit", includes: "Stammdaten, Erfassung von Arbeitszeiten und Abwesenheiten, automatisierte elektronische Meldungen, komplexe Abrechnungsfälle" },
        { name: "Bewerbermanagement Smart", monthlyNet: 19, billing: "ab, pro Monat, jährliche Rechnungsstellung, 12 Monate Mindestlaufzeit", includes: "Stellenanzeigen erstellen und veröffentlichen, digitale Bewerberakte, Bewertungs-, Auswahl- und Eintrittsprozess" },
        { name: "Zeitmanagement", billing: "Preis auf der Produktseite nicht erfasst: beim Anbieter anfragen", includes: "Flexibilität bei Arbeitszeitmodellen und Saldenregelungen, Reports, Zeitbewertung über die Personalabrechnung" },
      ],
      priceNote: "Preise zzgl. MwSt., Stand 06.11.2026. Die Preisangabe auf der Produktseite verweist auf Pakete; Details zum Mengenstaffel-Modell nennt die Produktseite nicht.",
      fits: T(["Unternehmen, die HR und Lohnabrechnung in einer modularen Lösung verbinden möchten", "Betriebe mit komplexen Abrechnungsfällen"]),
      notFits: T(["kleine Betriebe, die nur eine einfache Cloud-Lohnabrechnung suchen (dafür nennt Sage die Lösung Sage Lohnabrechnung)"]),
      alternatives: [await swId("sage-lohnabrechnung")] as never,
      sources: [await srcId(14), await srcId(15)] as never,
      verified: day(TODAY),
    },
  });
}

/* ---------- guides ---------- */
const guides = [
  {
    slug: "e-rechnungen-empfangen-pflicht-2025",
    title: "E-Rechnungen empfangen: Was seit 2025 für alle Unternehmen gilt",
    seoTitle: "E-Rechnungen empfangen: Pflicht seit 2025",
    description: "Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen empfangen können. Was das bedeutet, was als Postfach reicht und wie Sie XRechnungen lesen.",
    category: "rechnungsstellung-e-rechnung",
    readingMinutes: 6,
    lead: "Beim Empfang von E-Rechnungen gibt es keine Übergangsfrist: Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen sie annehmen können. Dieser Ratgeber erklärt, was das praktisch bedeutet, warum ein E-Mail-Postfach nur ein Anfang ist und wie Sie eingehende Rechnungen sauber verarbeiten.",
    hasAffiliate: true,
    sourceNumbers: [1, 2, 4, 10],
    seed: 71,
    takeaways: [
      "Pflicht: Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen empfangen können, auch Kleinunternehmer.",
      "Übergang: Als Übergangsmaßnahme reicht zunächst ein E-Mail-Postfach.",
      "Lesbarkeit: Eine XRechnung ist eine XML-Datei und ohne passende Software kaum lesbar. Sie brauchen ein Programm oder einen Viewer.",
      "Archiv: Bewahren Sie die E-Rechnung im Originalformat auf. Der strukturierte Teil ist maßgeblich.",
    ],
    faqs: [
      { q: "Gilt die Empfangspflicht auch für Kleinunternehmer?", a: "Ja. Kleinunternehmer müssen E-Rechnungen empfangen können, auch wenn sie selbst keine ausstellen müssen." },
      { q: "Muss ich auf E-Rechnungen mit einer E-Rechnung antworten?", a: "Nein. Die Empfangspflicht und die Ausstellungspflicht sind getrennt geregelt. Für das Ausstellen gelten Übergangsfristen bis 2027 bzw. 2028." },
      { q: "Reicht ein E-Mail-Postfach dauerhaft?", a: "Die IHK Region Stuttgart nennt es eine Übergangsmaßnahme. Wichtig ist, dass Sie die Rechnungen auch verarbeiten können." },
    ],
    body: async () => [
      h2("Die Empfangspflicht im Überblick"),
      p("Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen empfangen können, auch Kleinunternehmer. Das gilt für Leistungen anderer inländischer Unternehmen. Eine Übergangsfrist für den Empfang gibt es nicht. [1]"),
      p("Als Übergangsmaßnahme reicht zunächst ein E-Mail-Postfach aus. [1] Das ändert nichts daran, dass Sie die Rechnung auch verarbeiten müssen: lesen, prüfen, buchen und aufbewahren."),
      h2("Was zählt als E-Rechnung?"),
      p("Eine E-Rechnung ist eine Rechnung in einem strukturierten elektronischen Format, das der europäischen Norm EN 16931 entspricht. Eine PDF-Rechnung per E-Mail ist keine E-Rechnung. [1] In der Praxis begegnen Ihnen zwei Formate: die XRechnung (reines XML) und ZUGFeRD (PDF mit eingebetteter XML-Datei, ab Version 2.0.1 zulässig). [1]"),
      callout("tip", "Praxistipp", "Richten Sie eine zentrale Adresse wie rechnungseingang@ihre-firma.de ein und teilen Sie sie Ihren Lieferanten mit. So landen E-Rechnungen nicht in persönlichen Postfächern und werden nicht übersehen."),
      h2("Von der E-Mail zur Buchung"),
      steps([
        "**Eingang bündeln:** Eine zentrale Adresse für alle Rechnungen, regelmäßig geprüft.",
        "**Format erkennen:** XML-Datei (XRechnung) oder PDF mit eingebetteter XML (ZUGFeRD)?",
        "**Lesen und prüfen:** Mit einer Buchhaltungssoftware, die E-Rechnungen einliest, oder einem Viewer. Ohne Software ist eine XRechnung kaum lesbar.",
        "**Buchen:** Daten in die Buchhaltung übernehmen, Rechnungsdaten abgleichen.",
        "**Archivieren:** Originaldatei unveränderbar ablegen, nicht nur ein Ausdruck.",
      ]),
      h2("Worauf Sie bei der Software achten"),
      ul([
        "Liest sie E-Rechnungen in den Formaten XRechnung und ZUGFeRD ein und zeigt sie lesbar an?",
        "Übernimmt sie die Daten in die Buchung, ohne alles abzutippen?",
        "Speichert sie die Originaldatei GoBD-konform? [10]",
        "Ist der Export für das Steuerbüro möglich, etwa im DATEV-Format?",
      ]),
      p("Beispiel: Sage Active liest nach Anbieterangabe eingehende E-Rechnungen in den Formaten XRechnung und ZUGFeRD in beiden Tarifen ein. [4] Prüfen Sie bei jedem Anbieter, welche Funktionen in welchem Tarif enthalten sind."),
      affiliateCta(await swId("sage-active"), "Liest nach Anbieterangabe XRechnung und ZUGFeRD ein und bündelt Rechnungen, Buchhaltung und Lohn für kleine Unternehmen."),
    ],
  },
  {
    slug: "e-rechnung-kleinunternehmer",
    title: "E-Rechnung für Kleinunternehmer: Was gilt und was nicht",
    seoTitle: "E-Rechnung für Kleinunternehmer: Was gilt?",
    description: "Kleinunternehmer müssen E-Rechnungen empfangen, aber nicht ausstellen. Was die Regeln im Detail bedeuten und welche Einstiegslösungen es gibt.",
    category: "rechnungsstellung-e-rechnung",
    readingMinutes: 5,
    lead: "Kleinunternehmer nach § 19 UStG sind bei der E-Rechnung besonders geregelt: Ausstellen müssen sie keine, empfangen aber schon. Der Ratgeber erklärt die Regeln und zeigt, wie Sie mit wenig Aufwand und Kosten auf der sicheren Seite sind.",
    hasAffiliate: false,
    sourceNumbers: [1, 2, 6, 5],
    seed: 84,
    takeaways: [
      "Empfangen: Auch Kleinunternehmer müssen seit dem 1. Januar 2025 E-Rechnungen empfangen können.",
      "Ausstellen: Kleinunternehmer dürfen weiterhin andere Rechnungen ausstellen (§ 34a UStDV).",
      "Kunden: Wenn Ihre Kunden E-Rechnungen wünschen, kann ein freiwilliges Angebot sinnvoll sein.",
      "Einstieg: Einige Anbieter haben kostenlose oder sehr günstige Tarife für wenige Rechnungen im Monat.",
    ],
    faqs: [
      { q: "Muss ich als Kleinunternehmer ab 2027 oder 2028 E-Rechnungen ausstellen?", a: "Nein. Nach der IHK-Darstellung dürfen Kleinunternehmer (§ 19 UStG) weiterhin nicht-elektronische Rechnungen nach § 34a UStDV ausstellen." },
      { q: "Gilt die Pflicht für meine Rechnungen an Privatkunden?", a: "Nein. Rechnungen an Privatpersonen (B2C) sind von der Pflicht nicht erfasst." },
    ],
    body: async () => [
      h2("Empfangen: Pflicht für alle"),
      p("Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen empfangen können, einschließlich Kleinunternehmer. Als Übergangsmaßnahme reicht zunächst ein E-Mail-Postfach. [1]"),
      h2("Ausstellen: Ausnahme für Kleinunternehmer"),
      p("Die Ausstellungspflicht ist abgestuft: ab 1. Januar 2027 für Unternehmen mit mehr als 800.000 € Gesamtumsatz im Vorjahr, ab 1. Januar 2028 für alle inländischen Unternehmen im B2B. [1] Kleinunternehmer im Sinne von § 19 UStG dürfen nach § 34a UStDV weiterhin Rechnungen ohne E-Rechnungsformat ausstellen. [1][2]"),
      callout("warn", "Achtung", "Die Ausnahme gilt nur für Kleinunternehmer im Sinne von § 19 UStG. Überschreiten Sie die Grenzen der Kleinunternehmerregelung, gelten für Sie die allgemeinen Regeln. Klären Sie Grenzfälle mit Ihrem Steuerbüro."),
      h2("Wann sich ein freiwilliges Angebot lohnt"),
      ul([
        "Ihre gewerblichen Kunden wünschen E-Rechnungen, weil sie diese automatisch verarbeiten.",
        "Sie möchten sich nicht ab 2028 umstellen müssen, falls Sie die Kleinunternehmer-Grenze überschreiten.",
        "Ihre Software bietet E-Rechnungen ohnehin ohne Aufpreis.",
      ]),
      h2("Einstiegslösungen im Überblick"),
      p("Einige Cloud-Anbieter haben Tarife, die für wenige Rechnungen im Monat reichen. Stand 06.11.2026, Preise zzgl. MwSt., regulär ohne Aktionsrabatt:"),
      table([
        ["Anbieter / Tarif", "Preis / Monat", "Hinweis laut Anbieter"],
        ["sevdesk Kostenlos", "0 €", "3 Rechnungen/E-Rechnungen pro Monat, inkl. ZUGFeRD und XRechnung [6]"],
        ["sevdesk Rechnung", "11,90 €", "unbegrenzte (E-)Rechnungen [6]"],
        ["Lexware Office M", "12,90 €", "Angebote, (E-)Rechnungen und Mahnungen [5]"],
      ]),
      p("Prüfen Sie vor dem Abschluss den aktuellen Funktionsumfang je Tarif beim Anbieter, da sich Preise und Aktionen häufig ändern."),
      h2("Ihre Checkliste"),
      steps([
        "**Empfang sicherstellen:** Zentrale E-Mail-Adresse und ein Programm oder Viewer, der XRechnungen lesbar macht.",
        "**Kunden fragen:** Wünschen wichtige Kunden E-Rechnungen?",
        "**Grenzen im Blick behalten:** Entwicklung des Umsatzes und der Kleinunternehmer-Grenzen mit dem Steuerbüro besprechen.",
        "**Archiv klären:** Eingehende Rechnungen im Originalformat aufbewahren.",
      ]),
    ],
  },
  {
    slug: "e-rechnungen-archivieren-gobd",
    title: "E-Rechnungen GoBD-konform archivieren: Format, Fristen und Praxis",
    seoTitle: "E-Rechnungen GoBD-konform archivieren",
    description: "Wie Sie E-Rechnungen richtig aufbewahren: Originalformat, Unveränderbarkeit, Aufbewahrungsfristen und was Ihr Archiv können muss.",
    category: "rechnungsstellung-e-rechnung",
    readingMinutes: 6,
    lead: "E-Rechnungen sind Buchungsbelege und müssen nach den GoBD aufbewahrt werden. Wichtig ist das Originalformat, nicht der Ausdruck. Der Ratgeber zeigt, was Sie aufbewahren müssen, wie lange und worauf Ihr Archiv achten sollte.",
    hasAffiliate: false,
    sourceNumbers: [10, 11, 3],
    seed: 92,
    takeaways: [
      "Original: Es genügt in der Regel, den strukturierten Teil (XML) aufzubewahren. Das empfangene Format bleibt maßgeblich.",
      "Lesbarer Teil: Ein PDF müssen Sie nur aufbewahren, wenn es steuerlich relevante Zusatzinformationen enthält.",
      "Kein Ausdruck: Elektronische Daten dürfen nicht ausschließlich ausgedruckt aufbewahrt werden.",
      "E-Mail: Dient die E-Mail nur als Transportmittel, ist sie selbst nicht aufbewahrungspflichtig.",
      "Fristen: Für Rechnungen und Buchungsbelege nennt Haufe acht Jahre. Klären Sie die geltende Frist für Ihre Unterlagen mit Ihrer Steuerberatung.",
    ],
    faqs: [
      { q: "Reicht es, die PDF-Datei einer ZUGFeRD-Rechnung zu speichern?", a: "Bei ZUGFeRD ist die eingebettete XML-Datei der maßgebliche strukturierte Teil. Bewahren Sie die Originaldatei unverändert auf. Ein Ausdruck ersetzt sie nicht." },
      { q: "Muss ich die E-Mail aufbewahren, mit der die Rechnung kam?", a: "Nach Haufe ist eine E-Mail, die nur als Transportmittel dient, nicht aufbewahrungspflichtig. Hat die E-Mail selbst die Funktion eines Handelsbriefs oder Buchungsbelegs, ist sie elektronisch aufzubewahren." },
    ],
    body: async () => [
      h2("Warum das Originalformat zählt"),
      p("Seit der E-Rechnungspflicht ab 2025 sind E-Rechnungen ausdrücklich in den GoBD verankert. Es genügt in der Regel, den strukturierten Teil (XML) aufzubewahren. Den lesbaren Teil, etwa ein PDF, müssen Sie nur aufbewahren, wenn er steuerlich relevante Zusatzinformationen enthält. Das empfangene Format bleibt maßgeblich. [10]"),
      p("Bei E-Rechnungen ist das Ursprungsformat zu speichern. Dient eine E-Mail nur als Transportmittel, ist sie selbst nicht aufbewahrungspflichtig. [11] Elektronische Daten dürfen vor Ablauf der Aufbewahrungsfrist nicht gelöscht werden, eine ausschließlich ausgedruckte Aufbewahrung ist unzulässig. [11]"),
      callout("warn", "Nicht ausdrucken und wegwerfen", "Bei einer ZUGFeRD-Rechnung geht beim Ausdrucken die eingebettete XML-Datei verloren. Der Ausdruck ersetzt die Originaldatei nicht."),
      h2("Unveränderbarkeit und Index"),
      ul([
        "Archivierte Dokumente dürfen nicht unbemerkt verändert werden. Korrekturen laufen über Storno und Neubuchung. [10]",
        "Elektronische Dokumente brauchen einen eindeutigen Index, der während der gesamten Frist mit dem Dokument verknüpft bleibt. [11]",
        "Änderungen und Zugriffe sollten protokolliert werden. [10]",
      ]),
      h2("Aufbewahrungsfristen"),
      p("Die GoBD legen keine Fristen fest, sie ergeben sich aus Handels- und Steuergesetzen. [10] Für Rechnungen und Buchungsbelege nennt Haufe acht Jahre. [3] Empfangene Handelsbriefe sind nach der IHK München sechs Jahre aufzubewahren. [10] Ältere Darstellungen nennen zehn Jahre. Die Fristen laufen nicht ab, solange die Unterlagen für eine noch nicht verjährte Steuerfestsetzung von Bedeutung sind. [11]"),
      callout("legal", "Fristen abstimmen", "Die Quellen unterscheiden sich bei den Fristen. Klären Sie mit Ihrer Steuerberatung, welche Frist für welche Unterlage gilt, bevor Sie Daten löschen."),
      h2("Was ein gutes Archiv leistet"),
      table([
        ["Anforderung", "Warum sie zählt"],
        ["Speichert die Originaldatei (XML bzw. ZUGFeRD) unverändert", "Das empfangene Format ist maßgeblich"],
        ["Vergibt eindeutige Indizes", "Auffindbarkeit über die gesamte Frist"],
        ["Protokolliert Änderungen und Zugriffe", "Unveränderbarkeit und Nachvollziehbarkeit"],
        ["Erlaubt Export (z. B. DATEV-Format, Datenzugriff)", "Betriebsprüfung und Steuerbüro"],
        ["Verhindert Löschen vor Fristende", "Löschverbot während der Aufbewahrungsfrist"],
        ["Dokumentiert das Verfahren", "Verfahrensdokumentation nach GoBD"],
      ]),
      h2("In vier Schritten zum Archiv"),
      steps([
        "**Ablageort festlegen:** Buchhaltungssoftware mit Archiv, DMS oder ein anderes geprüftes System, kein lose gefüllter Ordner.",
        "**Regel festlegen:** Eingang, Prüfung, Ablage, Zugriffsrechte, jeweils schriftlich.",
        "**Fristen hinterlegen:** Mit der Steuerberatung klären und im System berücksichtigen.",
        "**Verfahren dokumentieren:** Kurze Verfahrensdokumentation, die dem tatsächlichen Ablauf entspricht. [10]",
      ]),
    ],
  },
  {
    slug: "buchhaltungssoftware-kleine-unternehmen",
    title: "Buchhaltungssoftware für kleine Unternehmen: Auswahl, Kosten und Funktionen",
    seoTitle: "Buchhaltungssoftware für kleine Unternehmen",
    description: "Worauf es bei Buchhaltungssoftware ankommt, was Cloud-Lösungen kosten und wie Sage Active, Lexware Office und sevdesk im Überblick abschneiden.",
    category: "buchhaltung-finanzen",
    readingMinutes: 8,
    lead: "Für kleine Unternehmen und Selbstständige gibt es zahlreiche Cloud-Lösungen für Rechnungen und Buchhaltung. Der Ratgeber zeigt, welche Kriterien zählen, was die Einstiegstarife kosten und wo sich Anbieter unterscheiden: mit Preisen direkt von den Anbieterseiten.",
    hasAffiliate: true,
    sourceNumbers: [4, 5, 6, 10],
    seed: 33,
    takeaways: [
      "Kriterien: GoBD-Konformität, E-Rechnung, ELSTER-Voranmeldung, Export für das Steuerbüro (DATEV), Nutzer- und Rechnungsmengen.",
      "Preise: Die regulären Einstiegstarife liegen bei Rechnungsprogrammen zwischen 0 € und rund 25 € pro Monat zzgl. MwSt., Buchhaltungstarife kosten mehr.",
      "Vergleichen Sie reguläre Preise: Aktionen wie 50 % Rabatt für drei Monate verändern das Bild nur zeitweise.",
      "Testen Sie vor dem Kauf mit echten Daten und stimmen Sie Software und Export mit Ihrem Steuerbüro ab.",
    ],
    faqs: [
      { q: "Brauche ich Buchhaltungssoftware oder reicht ein Rechnungsprogramm?", a: "Das hängt davon ab, wer Ihre Buchhaltung macht. Reicht es, Rechnungen zu schreiben und die Belege an das Steuerbüro zu geben, genügt oft ein Rechnungsprogramm mit Export. Wer selbst bucht und Umsatzsteuer meldet, braucht einen Buchhaltungstarif." },
      { q: "Wie vergleiche ich Preise fair?", a: "Nutzen Sie reguläre Monatspreise zzgl. MwSt., prüfen Sie Nutzer- und Rechnungslimits und beachten Sie, dass günstigere Preise teils nur bei längerer Laufzeit gelten." },
    ],
    body: async () => [
      h2("Welche Kriterien zählen"),
      ul([
        "**Umfang:** Nur Rechnungen und Angebote oder auch Buchhaltung mit Umsatzsteuer, EÜR und Abschluss?",
        "**GoBD:** Sorgt die Software für unveränderbare Buchungen und nachvollziehbare Protokolle? [10]",
        "**E-Rechnung:** Einlesen und Erstellen von XRechnung und ZUGFeRD",
        "**Steuerbüro:** Export im DATEV-Format oder Zugang für die Steuerberatung",
        "**ELSTER:** Umsatzsteuer-Voranmeldung direkt aus der Software",
        "**Mengen:** Nutzende, Rechnungen pro Monat, ggf. Beschäftigte für Lohn",
        "**Vertrag:** Laufzeit, Kündigung, Testphase",
      ]),
      h2("Drei Anbieter im Überblick"),
      p("Die folgende Übersicht fasst Angaben von den Anbieterseiten zusammen (Stand 06.11.2026, Preise zzgl. MwSt., reguläre Monatspreise ohne Aktionen). Die Funktionen sind Auszüge laut Anbieter. Details je Tarif prüfen Sie bitte beim Anbieter."),
      table([
        ["Software / Tarif", "Preis / Monat", "Hinweise laut Anbieter", "Quelle"],
        ["Sage Active Starter", "25,00 €", "Angebote und Rechnungen; 5 Nutzende; 300 Rechnungen/Monat; Einlesen von XRechnung/ZUGFeRD", "[4]"],
        ["Sage Active Essentials", "49,00 €", "zusätzlich Buchhaltung (SKR03/SKR04), USt-VA per ELSTER, DATEV-Format-Export, Lohn für 2 Beschäftigte; 10 Nutzende; 500 Rechnungen/Monat", "[4]"],
        ["Lexware Office M", "12,90 €", "Angebote, (E-)Rechnungen und Mahnungen", "[5]"],
        ["Lexware Office L", "21,90 €", "Buchhaltung, EÜR und Umsatzsteuer", "[5]"],
        ["sevdesk Rechnung", "11,90 €", "unbegrenzte (E-)Rechnungen, DATEV/ADDISON-Schnittstelle", "[6]"],
        ["sevdesk Buchhaltung", "25,90 €", "zusätzlich Buchhaltung, UStVA per ELSTER, EÜR/GuV, Bankanbindung", "[6]"],
      ]),
      callout("info", "Aktionen", "Zum Stichtag bot Sage 50 % Rabatt für drei Monate, Lexware 50 % für drei Monate, sevdesk Rabatte bei 12- und 24-monatiger Laufzeit. Entscheidend ist der Preis nach der Aktion."),
      h2("Was das im Jahr kostet"),
      p("Eigene Berechnung: reguläre Monatspreise × 12, zzgl. MwSt., bei monatlicher Abrechnung."),
      table([
        ["Tarif", "Pro Jahr (netto)"],
        ["sevdesk Rechnung", "142,80 €"],
        ["Lexware Office M", "154,80 €"],
        ["Lexware Office L", "262,80 €"],
        ["Sage Active Starter", "300,00 €"],
        ["sevdesk Buchhaltung", "310,80 €"],
        ["Sage Active Essentials", "588,00 €"],
      ]),
      p("Die Tarife sind funktional nicht deckungsgleich. Ein günstiger Rechnungstarif ersetzt keine Buchhaltung, und ein Tarif mit Lohnabrechnung ist nicht mit einem reinen Rechnungstarif vergleichbar."),
      h2("In fünf Schritten zur Entscheidung"),
      steps([
        "**Bedarf klären:** Nur Rechnungen oder volle Buchhaltung? Wer bucht, Sie oder das Steuerbüro?",
        "**Steuerbüro fragen:** Welches Format und welche Schnittstelle wird gewünscht?",
        "**Zwei bis drei Anbieter testen:** Testphasen nutzen, echte Rechnungen anlegen.",
        "**Kosten durchrechnen:** Reguläre Preise, Mengen, Zusatzkosten für Nutzende und Rechnungen.",
        "**Verträge prüfen:** Laufzeit, Kündigung, Datenexport bei Wechsel.",
      ]),
      affiliateCta(await swId("sage-active"), "Cloud-Lösung für Angebote, Rechnungen, Buchhaltung und Lohn für kleine Unternehmen; 14 bzw. 30 Tage kostenlos testen."),
    ],
  },
  {
    slug: "erp-einfuehrung-mittelstand",
    title: "ERP-Einführung im Mittelstand: Leitfaden in sechs Phasen",
    seoTitle: "ERP-Einführung im Mittelstand: Leitfaden",
    description: "Wie ERP-Projekte im Mittelstand ablaufen: von Zielen und Lastenheft über Auswahl und Migration bis Go-live. Mit typischen Fehlern und Aufwandsangaben.",
    category: "erp-warenwirtschaft",
    readingMinutes: 9,
    lead: "Ein ERP-System verbindet Einkauf, Lager, Produktion, Verkauf und Rechnungswesen. Die Einführung ist ein Projekt, kein Softwarekauf. Dieser Leitfaden beschreibt die Phasen, nennt Aufwandsangaben aus Studien und typische Stolpersteine.",
    hasAffiliate: true,
    sourceNumbers: [12, 13],
    seed: 18,
    takeaways: [
      "Projekt: Die Einführung dauert im Mittelstand laut Sage-Blog meist ein halbes bis ein ganzes Jahr von der Auswahl bis zum Go-live.",
      "Auswahl: Die reine Systemauswahl dauert im Schnitt 17 Wochen (Softwarepath ERP Report, zitiert im Sage-Blog).",
      "Ziele: Ohne messbare Ziele und Lastenheft lassen sich Angebote nicht vergleichen.",
      "Ressourcen: Interne Personalkosten gelten laut Sage-Blog als am häufigsten unterschätzter Kostenpunkt.",
      "Quellenlage: Die verfügbaren Zahlen stammen großenteils aus Anbieterquellen und Studien Dritter. Behandeln Sie sie als Orientierung.",
    ],
    faqs: [
      { q: "Wie lange dauert die Einführung eines ERP-Systems?", a: "Das Sage-Blog nennt für den Mittelstand meist ein halbes bis ein ganzes Jahr von der Auswahl bis zum Go-live, ohne eigene Quelle. Als Studienwerte zitiert es einen Median von neun Monaten für die Einführung (Panorama Consulting) und im Schnitt 17 Wochen für die Systemauswahl (Softwarepath)." },
      { q: "Was ist der Unterschied zwischen Lastenheft und Pflichtenheft?", a: "Das Lastenheft beschreibt die Anforderungen aus Sicht des Anwenders. Auf dieser Basis beschreibt der Anbieter im Pflichtenheft, wie er sie umsetzt. Das Pflichtenheft wird häufig Vertragsbestandteil." },
    ],
    body: async () => [
      h2("Was ein ERP-Projekt ausmacht"),
      p("ERP steht für Enterprise Resource Planning. Gemeint sind Systeme, die Prozesse wie Einkauf, Lager, Verkauf, Produktion und Rechnungswesen in einer Datenbasis verbinden. Die Einführung verändert Abläufe und betrifft viele Abteilungen. Wer sie wie eine reine Softwarebeschaffung behandelt, riskiert Verzögerungen und Mehrkosten."),
      h2("Sechs Phasen von der Idee zum Go-live"),
      p("In der Praxis kursieren unterschiedliche Phasenmodelle. Die folgende Gliederung fasst gängige Schritte zusammen. Das ist eine redaktionelle Zusammenfassung, kein normiertes Verfahren."),
      steps([
        "**Ziele und Vorbereitung:** Was soll das System leisten, woran messen Sie Erfolg? Projektteam und Budget festlegen.",
        "**Analyse und Lastenheft:** Prozesse aufnehmen, Anforderungen aus Anwendersicht beschreiben.",
        "**Auswahl:** Anbieter ansprechen, Angebote vergleichen, Systeme vorführen lassen, Vertrag verhandeln.",
        "**Einrichtung und Datenmigration:** Konfiguration, Schnittstellen, Stammdaten bereinigen und übernehmen.",
        "**Schulung und Tests:** Key-User und Anwender einweisen, Prozesse testen.",
        "**Go-live und Support:** Umstellung, Begleitung in den ersten Wochen, laufende Betreuung.",
      ]),
      h2("Lastenheft und Pflichtenheft"),
      p("Das Lastenheft beschreibt, was das System aus Sicht Ihres Unternehmens können muss. Es ist die Grundlage, um Angebote vergleichbar zu machen. Auf dieser Basis erstellt der Anbieter das Pflichtenheft, das beschreibt, wie er die Anforderungen umsetzt, und das häufig Vertragsbestandteil wird. Das Sage-Blog nennt fehlende Ziele und ein fehlendes Lastenheft als typischen Fehler. [12]"),
      h2("Aufwand: Was Studien nennen"),
      p("Das Sage-Blog fasst Zahlen aus Drittstudien zusammen. Es handelt sich um einen Anbieterblog, deshalb sind die Angaben als Orientierung zu verstehen. [12]"),
      table([
        ["Angabe", "Wert", "Herkunft laut Sage-Blog"],
        ["Dauer Auswahl bis Go-live (Mittelstand)", "meist ein halbes bis ein ganzes Jahr", "ohne eigene Quelle"],
        ["Dauer der Einführung (Median)", "9 Monate", "Panorama Consulting ERP Report"],
        ["Dauer der Systemauswahl", "im Schnitt 17 Wochen; unter 50 Mitarbeitenden etwa 14 Wochen", "Softwarepath ERP Report (1.384 Projekte)"],
        ["Anteil der Unternehmen mit Budgetüberschreitung", "über ein Viertel", "Panorama Consulting"],
        ["Probleme bei der Datenübernahme", "36 % der Projektverantwortlichen", "Trovarit"],
      ]),
      h2("Typische Fehler"),
      ul([
        "Unklare Ziele, kein Lastenheft [12]",
        "Interne Ressourcen unterschätzt: Projektleitung und Key-User brauchen feste Zeit [12]",
        "Datenqualität erst kurz vor dem Go-live angegangen [12]",
        "Change-Management vernachlässigt und Schulungsbudget gekürzt [12]",
        "Zu viel Anpassung, die bei jedem Update Mehraufwand verursacht [12]",
      ]),
      callout("tip", "Praxistipp", "Prüfen Sie zuerst, ob der Standard Ihre Anforderungen abdeckt, bevor Sie anpassen. Je mehr Individualentwicklung, desto aufwendiger werden Updates."),
      h2("Ein Beispiel für modulare Mittelstands-ERP"),
      p("Sage 100 ist nach Anbieterangabe eine modulare ERP-Lösung für mittelständische Unternehmen mit den Kernmodulen Warenwirtschaft, Rechnungswesen und Produktion, die lokal oder in der Cloud betrieben werden kann. [13] Prüfen Sie bei jedem Anbieter, welche Module, Branchenlösungen und Implementierungspartner zu Ihrem Vorhaben passen."),
      affiliateCta(await swId("sage-100"), "Modulare ERP-Lösung für den Mittelstand mit Warenwirtschaft, Rechnungswesen und Produktion; Angebot über den Anbieter anfordern."),
    ],
  },
  {
    slug: "erp-kosten-mittelstand",
    title: "ERP-Kosten: Womit Mittelständler realistisch rechnen müssen",
    seoTitle: "ERP-Kosten im Mittelstand: Was Sie einplanen",
    description: "Welche Kostenblöcke ein ERP-Projekt hat, welche Richtwerte Studien nennen und welche Listenpreise Anbieter wie Sage veröffentlichen.",
    category: "erp-warenwirtschaft",
    readingMinutes: 7,
    lead: "Ein ERP-System kostet mehr als die Lizenz. Implementierung, Datenmigration, Schulung und interne Arbeitszeit sind oft die größeren Posten. Der Ratgeber ordnet die Kostenblöcke, nennt Richtwerte aus Studien und zeigt veröffentlichte Listenpreise von Sage als Beispiel.",
    hasAffiliate: true,
    sourceNumbers: [12, 13, 15],
    seed: 25,
    takeaways: [
      "Kostenblöcke: Lizenz oder Abo, Implementierung, Datenmigration, Schulung, interne Personalkosten, Betrieb und Wartung.",
      "Richtwert Studie: Das Sage-Blog nennt durchschnittlich 5.917 € pro Arbeitsplatz (Trovarit-Studie „ERP in der Praxis“).",
      "Software ist nur ein Teil: Laut erp-software.org (im Sage-Blog zitiert) macht Software 20 bis 35 % der Gesamtkosten aus.",
      "Puffer: Mindestens 20 % auf das Anbieterangebot einplanen (ebenfalls laut erp-software.org, zitiert im Sage-Blog).",
      "Listenpreise: Sage 100 Module ab 56 €, 58 € bzw. 90 € pro Monat und Nutzer, zzgl. MwSt.",
    ],
    faqs: [
      { q: "Was kostet ein ERP-System pro Nutzer?", a: "Das hängt von Anbieter, Modulen und Betriebsart ab. Das Sage-Blog nennt für Cloud-Abos meist 50 bis 250 € pro Nutzer und Monat. Sage 100 nennt Modulpreise ab 56 € pro Monat und Nutzer bei jährlicher Abrechnung. Der Gesamtpreis steht im Angebot." },
      { q: "Sind die Angaben aus dem Sage-Blog neutral?", a: "Nein, es ist ein Anbieterblog, der Zahlen aus Drittstudien zitiert. Wir nennen deshalb jeweils die ursprüngliche Quelle und empfehlen, Angebote mehrerer Anbieter einzuholen." },
    ],
    body: async () => [
      h2("Die sechs Kostenblöcke"),
      table([
        ["Kostenblock", "Was dahintersteckt", "Einschätzung laut Sage-Blog [12]"],
        ["Lizenz oder Subscription", "Cloud-Abo oder Einmallizenz", "–"],
        ["Implementierung und Anpassung", "Beratung, Konfiguration, Schnittstellen", "größter variabler Block"],
        ["Datenmigration", "Stammdaten bereinigen und übernehmen", "Aufwand hängt an der Datenqualität"],
        ["Schulung", "Anwender und Key-User", "wichtigster Hebel für die Akzeptanz"],
        ["Interne Personalkosten", "Projektteam, Key-User", "am häufigsten unterschätzter Posten"],
        ["Betrieb und Wartung", "Support, Updates, Hosting", "–"],
      ]),
      h2("Richtwerte aus Studien"),
      p("Das Sage-Blog zitiert die Trovarit-Studie „ERP in der Praxis“ mit durchschnittlich 5.917 € pro Arbeitsplatz. Bis 100 Mitarbeitende seien es 6.142 € pro Nutzer, bei 101 bis 499 Mitarbeitenden 5.774 €. Software mache laut erp-software.org nur 20 bis 35 % der Gesamtkosten aus, auf das Anbieterangebot sollten mindestens 20 % Puffer gerechnet werden. [12]"),
      p("Für Cloud-Abos nennt das Blog meist 50 bis 250 € pro Nutzer und Monat. Für On-Premise-Wartung gelte als branchenüblich ein Anteil von 18 bis 22 % der Lizenzsumme pro Jahr, als Richtwert ohne Quellenangabe. [12]"),
      callout("info", "Hinweis zur Quellenlage", "Dies sind Zahlen aus einem Anbieterblog, das Drittstudien zitiert. Eine Modellrechnung des Blogs (50 Nutzer, 150 € pro Nutzer und Monat) kommt auf rund 330.000 bis 385.000 € im ersten Jahr und danach etwa 90.000 € jährlich. Das ist ein Beispiel mit eigenen Annahmen, keine Prognose für Ihr Unternehmen. [12]"),
      h2("Veröffentlichte Listenpreise als Beispiel"),
      p("Sage veröffentlicht für Sage 100 Modulpreise. Sie gelten bei jährlicher Rechnungsstellung mit 12-monatiger Mindestvertragslaufzeit, zzgl. MwSt. (Stand 06.11.2026). [13]"),
      table([
        ["Modul (Sage 100)", "Preis pro Monat und Nutzer", "Inhalt laut Anbieter"],
        ["Warenwirtschaft", "ab 56 €", "Kunden/Lieferanten, Artikel, Auftrags- und Bestellwesen, Lager, Inventur, Seriennummern, Chargen"],
        ["Rechnungswesen", "ab 58 €", "Finanz- und Anlagenbuchhaltung, Zahlungsverkehr, DATEV-Export/-Import, USt-VA via ELSTER"],
        ["Produktion", "ab 90 €", "inkl. Warenwirtschaftspaket; Fertigungssteuerung, Simulation, Kalkulation, BDE, Projektfertigung"],
      ]),
      p("Zur Einordnung: Auf der Preisübersicht nennt Sage außerdem Sage Operations (Cloud-ERP für Handel und Fertigung) ab 199 € pro Monat und Sage X3 auf Anfrage. [15] Die Preise sind nicht ohne Weiteres vergleichbar, da Nutzerzahl, Module und Betriebsart einfließen."),
      h2("So planen Sie das Budget"),
      steps([
        "**Alle Kostenblöcke auflisten:** Nicht nur Lizenz, auch Migration, Schulung, interne Zeit.",
        "**Mehrere Angebote einholen:** Mit identischem Lastenheft, damit Preise vergleichbar sind.",
        "**Puffer einplanen:** Mindestens 20 % auf das Anbieterangebot. [12]",
        "**Laufende Kosten betrachten:** Abo oder Wartung, Updates, Support, Schnittstellen.",
      ]),
      affiliateCta(await swId("sage-100"), "Veröffentlichte Modulpreise ab 56 € pro Monat und Nutzer; ein individuelles Angebot erhalten Sie über die Anfrage beim Anbieter."),
    ],
  },
  {
    slug: "hr-software-mittelstand",
    title: "HR-Software für den Mittelstand: Module, Kosten und Auswahl",
    seoTitle: "HR-Software für den Mittelstand: Module und Kosten",
    description: "Welche Module HR-Software im Mittelstand bietet, worauf es bei Auswahl und Datenschutz ankommt und was veröffentlichte Preise von Sage zeigen.",
    category: "hr-personal",
    readingMinutes: 7,
    lead: "HR-Software reicht von der reinen Lohnabrechnung bis zur Komplettlösung mit Personalakte, Zeitmanagement und Recruiting. Der Ratgeber ordnet die Module, nennt Kriterien für die Auswahl und zeigt veröffentlichte Preise als Beispiel.",
    hasAffiliate: true,
    sourceNumbers: [14, 15, 9],
    seed: 47,
    takeaways: [
      "Module: Typisch sind Personalabrechnung, Zeit- und Abwesenheitsmanagement, Personalakte, Bewerbermanagement.",
      "Beispiel Sage HR Suite: Personalabrechnung ab 39 € pro Monat, Bewerbermanagement Smart ab 19 € pro Monat, jeweils zzgl. MwSt. bei jährlicher Abrechnung.",
      "Alternative für kleine Betriebe: Sage Lohnabrechnung ab 20 € pro Monat mit fünf Mitarbeitenden.",
      "Datenschutz: Es geht um Beschäftigtendaten. Klären Sie Auftragsverarbeitungsvertrag und Serverstandort schriftlich.",
    ],
    faqs: [
      { q: "Wann lohnt sich eine HR-Suite statt reiner Lohnabrechnung?", a: "Wenn Sie zusätzlich Zeiten, Abwesenheiten, Personalakten oder Recruiting digital abbilden wollen oder komplexe Abrechnungsfälle haben. Für einfache Abrechnungen genügt oft eine Lohnlösung." },
      { q: "Hilft die digitale Personalakte, gesetzliche Pflichten zu erfüllen?", a: "Das hängt von den rechtlichen Vorgaben, Ihren Prozessen und der Nutzung ab. Sage weist selbst darauf hin, dass die Informationen keine Rechtsberatung sind. Lassen Sie konkrete Anforderungen fachkundig prüfen." },
    ],
    body: async () => [
      h2("Welche Module gibt es?"),
      table([
        ["Modul", "Wofür"],
        ["Personalabrechnung", "Lohn und Gehalt, gesetzliche Meldungen"],
        ["Zeit- und Abwesenheitsmanagement", "Arbeitszeiten, Urlaub, Krankheit, Salden"],
        ["Digitale Personalakte", "Zentrale Ablage und Verwaltung von Personaldokumenten"],
        ["Bewerbermanagement", "Stellenanzeigen, Bewerberakten, Auswahlprozess"],
        ["Reisekosten und Auslagen", "Abrechnung von Belegen und Reisen"],
      ]),
      h2("Beispiel Sage HR Suite"),
      p("Sage beschreibt die HR Suite als modulare Personalsoftware, die als lokale Installation oder in der Cloud genutzt werden kann. Die Module lassen sich Schritt für Schritt einführen. [14] Veröffentlichte Preise (zzgl. MwSt., Stand 06.11.2026, bei jährlicher Rechnungsstellung mit zwölfmonatiger Mindestvertragslaufzeit und inkl. Softwarewartung für einen Arbeitsplatz): [14]"),
      table([
        ["Modul", "Preis", "Inhalt laut Anbieter"],
        ["Personalabrechnung", "ab 39 € pro Monat", "Stammdaten, Erfassung von Arbeitszeiten und Abwesenheiten, automatisierte elektronische Meldungen"],
        ["Bewerbermanagement Smart", "ab 19 € pro Monat", "Stellenanzeigen, digitale Bewerberakte, Auswahl- und Eintrittsprozess"],
        ["Zeitmanagement", "auf Anfrage", "Arbeitszeitmodelle, Saldenregelungen, Reports"],
      ]),
      p("Die Sage-Preisübersicht nennt die HR Suite für Unternehmen mit umfassenden oder komplexen HR-Prozessen und 50+ Mitarbeitenden. [15] Die Lösung rechnet laut Anbieter auch komplexe Fälle wie Altersteilzeit, Kurzarbeit, Versorgungsbezüge oder betriebliche Altersvorsorge ab. [14]"),
      h2("Kleine Betriebe: leichtere Alternative"),
      p("Für kleine Unternehmen nennt Sage eine Cloud-Lohnabrechnung mit integrierten HR-Funktionen ab 20 € pro Monat inklusive fünf Mitarbeitenden. [9][15] Mehr dazu im Ratgeber zur Lohnabrechnungssoftware."),
      h2("Kriterien für die Auswahl"),
      ul([
        "**Umfang:** Brauchen Sie wirklich alle Module oder nur Abrechnung plus Urlaub?",
        "**Skalierung:** Wie entwickelt sich die Mitarbeiterzahl, und wie ändert sich der Preis?",
        "**Betriebsart:** Cloud oder lokal. Welche Folgen hat das für Wartung und IT?",
        "**Datenschutz:** Auftragsverarbeitungsvertrag, Serverstandort, Rollen und Rechte für Beschäftigtendaten",
        "**Schnittstellen:** Buchhaltung, Steuerbüro, Zeiterfassungsterminals",
        "**Vertrag:** Mindestlaufzeit, Kündigung, Preisstaffeln",
      ]),
      callout("legal", "Hinweis", "Dieser Beitrag ersetzt keine Rechts- oder Datenschutzberatung. Prüfen Sie konkrete Anforderungen etwa an die Personalakte fachkundig."),
      h2("In vier Schritten zur Auswahl"),
      steps([
        "**Prozesse erfassen:** Was läuft heute auf Papier oder in Tabellen?",
        "**Module priorisieren:** Pflicht und Wunsch trennen.",
        "**Angebote anfragen:** Mit Mitarbeiterzahl und Modulen, Preis je Staffel erfragen.",
        "**Testen und abstimmen:** Mit Personalabteilung, Geschäftsführung und Datenschutz.",
      ]),
      affiliateCta(await swId("sage-hr-suite"), "Modulare Personalsoftware mit Personalabrechnung ab 39 € pro Monat, Zeit- und Bewerbermanagement; Angebot über den Anbieter anfordern."),
    ],
  },
];

for (const g of guides) {
  if (await first("beitraege", { slug: { equals: g.slug } })) {
    console.log("exists:", g.slug);
    continue;
  }
  await payload.create({
    collection: "beitraege",
    draft: false,
    data: {
      _status: "published",
      title: g.title,
      slug: g.slug,
      kind: "ratgeber",
      category: (await cat(g.category)) as never,
      lead: g.lead,
      takeaways: T(g.takeaways),
      body: doc(await g.body()) as never,
      faqs: g.faqs,
      sources: (await Promise.all(g.sourceNumbers.map(srcId))) as never,
      lastVerifiedAt: day(TODAY),
      legalDisclaimer: true,
      hasAffiliate: g.hasAffiliate,
      seoTitle: g.seoTitle,
      description: g.description,
      readingMinutes: g.readingMinutes,
      coverSeed: g.seed,
      publishedAt: day(TODAY),
    },
  });
  console.log("created:", g.slug);
}
process.exit(0);
