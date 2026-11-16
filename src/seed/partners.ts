// Partner links (Werbelinks), new profiles easybill and Pipedrive, and a software-only topic "CRM & Vertrieb".
// Facts read on the vendors' own pages on 16.11.2026 (easybill.de/preise, easybill.de/funktionen/e-rechnung-software,
// pipedrive.com/de/pricing, pipedrive.com/de/features/privacy-security, pipedrive.com/de/features/mobile-crm).
// The partner links were provided by the site operator, who confirmed the programmes are active (16.11.2026).
// Run: pnpm exec payload run src/seed/partners.ts   (safe to re-run; writes a JSON backup of everything it changes first)
import fs from "node:fs";
import { getPayload } from "payload";
import config from "../../payload.config";
import { doc, h2, h3, ol, p, ul } from "./lexical";

/* eslint-disable @typescript-eslint/no-explicit-any */
const payload = await getPayload({ config });
const day = (s: string) => new Date(`${s}T12:00:00.000Z`).toISOString();
const TODAY = "2026-11-16";
const first = async (collection: any, where: any) => (await payload.find({ collection, where, limit: 1, depth: 0, overrideAccess: true })).docs[0] as any;
const T = (arr: string[]) => arr.map((text) => ({ text }));

const CRIT = {
  prices: "Preise öffentlich einsehbar",
  trial: "Kostenlose Testphase",
  term: "Kurze Vertragslaufzeit (monatlich kündbar)",
  einv: "E-Rechnung (XRechnung / ZUGFeRD)",
  datev: "Export oder Schnittstelle für das Steuerbüro (DATEV)",
  data: "Datenstandort öffentlich angegeben",
  avv: "Auftragsverarbeitungsvertrag auf der Produktseite erwähnt",
  payroll: "Lohnabrechnung enthalten oder zubuchbar",
  mobile: "Mobile Nutzung (App) laut Anbieter",
  api: "Programmierschnittstelle (API) laut Anbieter",
};

/* ---------- 0. backup ---------- */
const backup = {
  takenAt: new Date().toISOString(),
  affiliateLinks: (await payload.find({ collection: "affiliate-links", limit: 200, depth: 0, overrideAccess: true })).docs,
  software: (await payload.find({ collection: "software", where: { slug: { in: ["lexware-office", "sevdesk", "weclapp", "easybill", "pipedrive"] } }, limit: 20, depth: 0, overrideAccess: true })).docs,
  categories: (await payload.find({ collection: "categories", limit: 50, depth: 0, overrideAccess: true })).docs,
  beitraegeHasAffiliate: (await payload.find({ collection: "beitraege", limit: 300, depth: 0, overrideAccess: true, select: { slug: true, hasAffiliate: true } as any })).docs,
};
const backupPath = new URL("../../../partners-backup-2026-11-16.json", import.meta.url);
if (!fs.existsSync(backupPath)) fs.writeFileSync(backupPath, JSON.stringify(backup, null, 2));
console.log("backup:", backupPath.pathname);

/* ---------- 1. sources ---------- */
const allSources = (await payload.find({ collection: "sources", limit: 1000, depth: 0, overrideAccess: true, sort: "number" })).docs as any[];
let nextNumber = Math.max(0, ...allSources.map((s) => s.number ?? 0)) + 1;
async function source(publisher: string, title: string, url: string) {
  const found = allSources.find((s) => s.url === url);
  if (found) return found.id;
  const created = await payload.create({ collection: "sources", data: { number: nextNumber++, publisher, title, url, type: "anbieter", accessedAt: day(TODAY) } as any, overrideAccess: true });
  allSources.push(created);
  return created.id;
}
const SRC = {
  easybillPrices: await source("easybill GmbH", "Pakete und Preise", "https://www.easybill.de/preise/"),
  easybillEinv: await source("easybill GmbH", "E-Rechnung Software", "https://www.easybill.de/funktionen/e-rechnung-software/"),
  pipedrivePrices: await source("Pipedrive OÜ", "CRM-Preispläne", "https://www.pipedrive.com/de/pricing"),
  pipedrivePrivacy: await source("Pipedrive OÜ", "CRM Datenschutz und Sicherheit", "https://www.pipedrive.com/de/features/privacy-security"),
  pipedriveMobile: await source("Pipedrive OÜ", "CRM-App für iPhone und Android", "https://www.pipedrive.com/de/features/mobile-crm"),
};

/* ---------- 2. partner links ---------- */
const NOTE = "Partnerlink vom Betreiber bereitgestellt; Programm laut Betreiber aktiv (16.11.2026).";
async function upsertLink(slug: string, partner: string, trackingUrl: string, network?: string) {
  const data = { slug, partner, trackingUrl, isAffiliate: true, active: true, network: network ?? "", notes: NOTE };
  const cur = await first("affiliate-links", { slug: { equals: slug } });
  const saved = cur
    ? await payload.update({ collection: "affiliate-links", id: cur.id, data, overrideAccess: true })
    : await payload.create({ collection: "affiliate-links", data, overrideAccess: true });
  console.log(cur ? "link updated:" : "link created:", slug);
  return saved.id;
}
const softwareLinkSlug = async (softwareSlug: string, fallback: string) => {
  const sw = await first("software", { slug: { equals: softwareSlug } });
  if (!sw?.affiliateLink) return fallback;
  const l = await payload.findByID({ collection: "affiliate-links", id: sw.affiliateLink, depth: 0, overrideAccess: true });
  return (l as any)?.slug ?? fallback;
};

const LINKS = {
  pipedrive: await upsertLink(
    "pipedrive",
    "Pipedrive",
    "https://www.pipedrive.com/en/programlp?utm_campaign=flatfee&utm_medium=Affiliate&utm_source=kontorkompass.de&pscd=aff.trypipedrive.com&ps_partner_key=t57iZXJ0YnJhbmRs&sid7=EN-CTA&ps_xid=wI3FOTPEzjD6lT&gsxid=wI3FOTPEzjD6lT&gspk=cm9iZXJ0YnJhbmRs",
    "PartnerStack",
  ),
  weclapp: await upsertLink(await softwareLinkSlug("weclapp", "weclapp"), "weclapp", "https://www.weclapp.com/?utm_medium=company_profile&utm_source=kontorkompass.de&utm_campaign=kontorkompass.de"),
  easybill: await upsertLink("easybill", "easybill", "https://www.easybill.de/?utm_source=kontorkompass.de&utm_medium=referral&utm_campaign=listing"),
  freshbooks: await upsertLink("freshbooks", "FreshBooks", "https://www.freshbooks.com/?utm_source=kontorkompass.de&utm_medium=referral&utm_campaign=listing"),
  lexware: await upsertLink(await softwareLinkSlug("lexware-office", "lexware-office"), "Lexware", "https://office.lexware.de/?utm_medium=kontorkompass.de&utm_source=kontorkompass.de&utm_campaign=domain_click"),
};

/* ---------- 3. software-only topic for CRM ---------- */
let crm = await first("categories", { slug: { equals: "crm-vertrieb" } });
if (!crm) {
  const maxOrder = Math.max(0, ...backup.categories.map((c: any) => c.order ?? 0));
  crm = await payload.create({
    collection: "categories",
    data: {
      name: "CRM & Vertrieb",
      slug: "crm-vertrieb",
      icon: "IdentificationBadge",
      description: "Kontakte, Leads und Vertriebsprozesse",
      intro: "CRM-Software bündelt Kontakte, Leads und Deals an einem Ort. Hier finden Sie Software-Profile für Vertriebsteams im Mittelstand.",
      order: maxOrder + 1,
    } as any,
    overrideAccess: true,
  });
  console.log("category created: crm-vertrieb");
}
const catId = async (slug: string) => (await first("categories", { slug: { equals: slug } })).id;

/* ---------- 4. profiles ---------- */
type Profile = { slug: string; data: Record<string, any> };

const easybill: Profile = {
  slug: "easybill",
  data: {
    name: "easybill",
    slug: "easybill",
    vendor: "easybill GmbH",
    categories: [await catId("rechnungsstellung-e-rechnung")],
    summary: "Rechnungsprogramm mit E-Rechnung (XRechnung, ZUGFeRD) in allen Paketen, DATEV-Schnittstelle und Servern in Deutschland, vom kostenlosen Free-Paket bis Premium.",
    affiliateLink: LINKS.easybill,
    ctaLabel: "Kostenlos testen",
    trial: "7 Tage, ohne Kreditkarte",
    entryPrice: 0,
    facts: [
      { label: "Anbieter", value: "easybill GmbH, Kaarst; laut Anbieter seit 2007 am Markt" },
      { label: "Bereitstellung", value: "Cloud (Browser)" },
      { label: "Pakete", value: "Free, Starter, Professional, Premium" },
      { label: "Einstiegspreis", value: "Free dauerhaft kostenlos (50 Dokumente pro Monat); Starter 12 € pro Monat oder 9 € bei Jahreszahlung, zzgl. MwSt." },
      { label: "Testphase", value: "7 Tage mit allen Premium-Funktionen, ohne Kreditkarte; danach automatisch das Free-Paket" },
      { label: "Laufzeit", value: "Monat, Quartal, Halbjahr oder Jahr; verlängert sich automatisch, Kündigung zum Laufzeitende im Account" },
      { label: "E-Rechnung", value: "Erstellen, Versenden und Empfangen in allen Paketen; XRechnung und ZUGFeRD laut Anbieter" },
      { label: "Steuerbüro", value: "Schnittstelle zu DATEV Unternehmen online und Steuerberater-Zugang in allen Paketen" },
      { label: "Datenstandort", value: "laut Anbieter ausschließlich Server in Deutschland; Zwei-Faktor-Authentifizierung verfügbar" },
      { label: "Zusatzkosten", value: "Archivierungskosten je nach Gesamtzahl gespeicherter Dokumente (laut Tabelle 2 € bis 15 € pro Monat), Flex-Option 0,29 € je Dokument über dem Kontingent" },
    ],
    plans: [
      { name: "Free", monthlyNet: 0, billing: "dauerhaft kostenlos", includes: "50 Dokumente pro Monat (Angebote, Aufträge, Rechnungen inkl. E-Rechnung, Lieferscheine), 3 Kontakte, 1 Zugang, Steuerberater-Zugang, DATEV- und Lexware-Office-Schnittstelle", unit: "flat" },
      { name: "Starter", monthlyNet: 12, annualMonthly: 9, billing: "monatlich; 9 € pro Monat bei Jahreszahlung (im Voraus)", includes: "bis 250 Dokumente pro Monat, 20 Kontakte, eigenes Briefpapier, Unterschriftengrafik, Belegerfassung mit KI (20 Belege), automatische Vorkontierung mit KI", unit: "flat" },
      { name: "Professional", monthlyNet: 39, annualMonthly: 25, billing: "monatlich; 25 € pro Monat bei Jahreszahlung; Preis für 500 Dokumente pro Monat", includes: "unbegrenzte Kontakte, wiederkehrende Dokumente, Anbindung an Amazon, eBay, Shopify und weitere, Versandmanagement, REST API, Webhooks, Cloud Backup", unit: "flat" },
      { name: "Premium", monthlyNet: 45, annualMonthly: 37, billing: "monatlich; 37 € pro Monat bei Jahreszahlung; Preis für 500 Dokumente pro Monat", includes: "zusätzlich automatisiertes Mahnwesen, Projektverwaltung, Zeiterfassung, Mitarbeiterverwaltung (3), weitere Mitarbeitende 5 € pro Monat", unit: "flat" },
    ],
    scenarioBasis: "none",
    priceNote: "Nettopreise zzgl. MwSt. Professional und Premium gelten für 500 Dokumente pro Monat; die Preisseite bietet Staffeln bis 200.000 Dokumente. Dazu kommen Archivierungskosten je nach Gesamtzahl gespeicherter Dokumente.",
    verdict:
      "easybill ist ein spezialisiertes Rechnungsprogramm, das E-Rechnungen im Format XRechnung und ZUGFeRD in allen Paketen erstellt, versendet und empfängt, auch im kostenlosen Free-Paket. Die Daten liegen laut Anbieter ausschließlich auf Servern in Deutschland, eine DATEV-Schnittstelle ist immer dabei. Eine Buchhaltung oder Lohnabrechnung bietet easybill nicht; die Kosten richten sich vor allem nach der Zahl der Dokumente.",
    checks: [
      [CRIT.prices, "yes", "Alle Pakete mit Preisen, Dokumentenstaffeln und Archivierungskosten auf der Preisseite"],
      [CRIT.trial, "yes", "7 Tage Premium kostenlos, ohne Kreditkarte; danach automatisch Free"],
      [CRIT.term, "yes", "Laufzeit Monat, Quartal, Halbjahr oder Jahr; Kündigung zum Laufzeitende"],
      [CRIT.einv, "yes", "Erstellen, Versenden und Empfangen in allen Paketen; XRechnung und ZUGFeRD laut Anbieter"],
      [CRIT.datev, "yes", "Schnittstelle zu DATEV Unternehmen online in allen Paketen"],
      [CRIT.data, "yes", "Ausschließlich Server in Deutschland laut Anbieter"],
      [CRIT.avv, "unknown", "Auf der Preisseite nicht erwähnt"],
      [CRIT.payroll, "no", "Keine Lohnabrechnung; easybill ist auf Rechnungsstellung spezialisiert"],
      [CRIT.mobile, "unknown", "Auf der Preisseite nicht angegeben"],
      [CRIT.api, "yes", "REST API ab Professional (10 Anfragen pro Minute), Premium 60"],
    ].map(([criterion, status, note]) => ({ criterion, status, note })),
    fits: T([
      "Selbstständige und kleine Unternehmen, die vor allem Rechnungen und E-Rechnungen schreiben und mit dem Steuerbüro über DATEV zusammenarbeiten",
      "Onlinehändler, die Rechnungen beim Bestellimport aus Amazon, eBay oder Shopify automatisch erzeugen möchten (ab Professional)",
    ]),
    notFits: T([
      "Unternehmen, die Buchhaltung oder Lohnabrechnung in derselben Software brauchen",
      "Teams mit mehreren Personen im Büro: eine Mitarbeiterverwaltung nennt die Preisseite erst im Premium-Paket",
    ]),
    sources: [SRC.easybillPrices, SRC.easybillEinv],
    verified: day(TODAY),
    review: doc([
      h2("Was ist easybill?"),
      p("easybill ist ein webbasiertes Rechnungsprogramm der easybill GmbH aus Kaarst. Es deckt Angebote, Aufträge, Rechnungen, E-Rechnungen, Lieferscheine und Mahnungen ab und richtet sich an Selbstständige, kleine Unternehmen und Onlinehändler. Eine Finanzbuchhaltung enthält easybill nicht: Die Daten gehen über Schnittstellen an DATEV oder Lexware Office."),
      h2("Pakete und Funktionen"),
      ul([
        "**Free:** dauerhaft kostenlos, 50 Dokumente pro Monat inklusive E-Rechnung, 3 Kontakte, ein Zugang, Steuerberater-Zugang und DATEV-Schnittstelle",
        "**Starter:** bis 250 Dokumente pro Monat, 20 Kontakte, eigenes Briefpapier, Belegerfassung mit KI und automatische Vorkontierung",
        "**Professional:** ab 500 Dokumente pro Monat, unbegrenzte Kontakte, wiederkehrende Dokumente, Anbindung an Amazon, eBay, Shopify und weitere Shops, Versandmanagement, REST API und Webhooks",
        "**Premium:** zusätzlich automatisiertes Mahnwesen, Projektverwaltung, Zeiterfassung und eine Mitarbeiterverwaltung (laut Preisseite 3 Zugänge, weitere je 5 € pro Monat)",
      ]),
      h2("Preise und Kosten erklärt"),
      p("Alle Preise sind netto zzgl. MwSt. Starter kostet 12 € pro Monat bei monatlicher Zahlung oder 9 € bei Jahreszahlung, Professional 39 € beziehungsweise 25 €, Premium 45 € beziehungsweise 37 €. Das Jahrespaket zahlen Sie einmal im Voraus. Professional und Premium gelten für 500 Dokumente pro Monat; größere Kontingente bis 200.000 Dokumente kosten mehr."),
      p("Zwei Kostenpunkte kommen dazu. Für die zeitlich unbegrenzte, GoBD-konforme Archivierung berechnet easybill monatliche Archivierungskosten, die von der Gesamtzahl gespeicherter Dokumente abhängen (laut Tabelle zwischen 2 € und 15 €). Über dem Kontingent greift die Flex-Option: Jedes weitere Dokument kostet 0,29 €, eine Kostenbremse deckelt den Aufschlag."),
      p("Rechenbeispiel Professional: Bei Jahreszahlung sind es 300 € im Jahr (12 × 25 €), bei monatlicher Zahlung 468 € (12 × 39 €). Die Jahreszahlung spart hier 168 € netto."),
      h2("Stärken"),
      ul([
        "E-Rechnung erstellen, versenden und empfangen in allen Paketen, auch im kostenlosen",
        "DATEV-Schnittstelle und Steuerberater-Zugang ohne Aufpreis",
        "Server ausschließlich in Deutschland laut Anbieter",
        "Laufzeiten von einem Monat bis zu einem Jahr wählbar",
        "Viele E-Commerce-Funktionen ab Professional",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Keine Buchhaltung und keine Lohnabrechnung",
        "Zusätzliche Archivierungskosten je nach Dokumentenzahl",
        "Eine Mitarbeiterverwaltung nennt die Preisseite erst im Premium-Paket",
        "Einen Auftragsverarbeitungsvertrag und eine Mobile App erwähnt die Preisseite nicht",
      ]),
      h2("Für wen eignet sich easybill?"),
      h3("Passt gut"),
      ul([
        "Selbstständige und kleine Betriebe, die Rechnungen schreiben und die Buchhaltung beim Steuerbüro lassen",
        "Unternehmen, die vor 2027 kostengünstig auf E-Rechnungen umstellen wollen",
        "Onlinehändler mit Bestellimport aus Marktplätzen und Shops",
      ]),
      h3("Passt weniger"),
      ul([
        "Betriebe, die Buchhaltung und Lohn in einer Oberfläche erledigen möchten",
        "Teams, die mobil Rechnungen schreiben wollen: eine App nennt die Preisseite nicht",
      ]),
      h2("E-Rechnung in easybill"),
      p("Laut Anbieter erstellt easybill E-Rechnungen automatisch im Format XRechnung oder ZUGFeRD und erfasst die Pflichtfelder der europäischen Norm EN 16931 strukturiert im Dokumenteneditor. Versand und Empfang sind in allen Paketen enthalten, auch im Free-Paket. Seit dem 1. Januar 2025 müssen alle inländischen Unternehmen E-Rechnungen empfangen können, ab 2027 beziehungsweise 2028 folgt schrittweise die Pflicht zum Versand. Die Fristen erklärt unser [Ratgeber zur E-Rechnung ab 2027](/ratgeber/e-rechnung-2027-pflicht-unternehmen)."),
      h2("Zusammenarbeit mit dem Steuerbüro"),
      p("Alle Pakete enthalten eine Schnittstelle zu DATEV Unternehmen online, über die Dokumente an das Steuerbüro gehen, sowie einen eigenen Steuerberater-Zugang. Dazu kommen Schnittstellen zu Lexware Office und zu einem Inkassodienst. Klären Sie mit Ihrer Kanzlei vorab, wie sie die Daten übernehmen möchte. Hintergründe im Beitrag [Zusammenarbeit mit dem Steuerbüro](/magazin/zusammenarbeit-steuerbuero-datev-export)."),
      h2("Datenschutz und Sicherheit"),
      p("easybill speichert die Daten laut Anbieter ausschließlich auf Servern in Deutschland, schützt sie mit Verschlüsselung und bietet eine Zwei-Faktor-Authentifizierung. Einen Auftragsverarbeitungsvertrag erwähnt die Preisseite nicht; lassen Sie ihn sich vor dem Start geben. Was ein AVV enthalten muss, erklärt unser Beitrag [Cloud-Software und Datenschutz](/magazin/cloud-software-datenschutz-avv-dsgvo)."),
      h2("Einführung in der Praxis"),
      ol([
        "Die 7-tägige Testphase mit allen Premium-Funktionen starten, ohne Kreditkarte",
        "Firmen- und Steuerdaten hinterlegen, ab Starter auch das eigene Briefpapier",
        "Eine Test-E-Rechnung im Format XRechnung erzeugen und mit einem kostenlosen Validator prüfen",
        "Die DATEV-Übertragung einmal mit der Kanzlei durchspielen",
        "Vor Ende der Testphase das Paket nach Dokumentenmenge wählen; sonst wechselt der Account automatisch ins Free-Paket",
      ]),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[Lexware Office](/software/lexware-office): wenn Rechnungen und Buchhaltung in einer Software laufen sollen",
        "[Sage Active](/software/sage-active): Rechnungen, Buchhaltung und eine kleine Lohnabrechnung in einer Cloud-Lösung",
        "[sevdesk](/software/sevdesk): Rechnungen und Buchhaltung mit einem dauerhaft kostenlosen Tarif",
      ]),
      h2("Häufige Fragen zu easybill"),
      h3("Ist easybill kostenlos?"),
      p("Ja, das Free-Paket ist dauerhaft kostenlos und enthält 50 Dokumente pro Monat inklusive E-Rechnung, drei Kontakte und einen Zugang. Bei vielen gespeicherten Dokumenten können Archivierungskosten anfallen."),
      h3("Was passiert nach der Testphase?"),
      p("Die 7-tägige Testphase umfasst das Premium-Paket. Buchen Sie danach kein kostenpflichtiges Paket, wechselt der Account automatisch ins Free-Paket."),
      h3("Was zählt als Dokument?"),
      p("Jedes Ausgangs- und Eingangsdokument im Account: Angebote, Aufträge, Rechnungen und E-Rechnungen, Lieferscheine sowie erfasste Belege. Im E-Commerce zählt zusätzlich jede Rechnung aus dem Bestellimport."),
      h2("Fazit"),
      p("easybill ist eine gute Wahl, wenn Sie vor allem Rechnungen und E-Rechnungen schreiben und die Buchhaltung beim Steuerbüro liegt. Die E-Rechnung ist schon im kostenlosen Paket dabei, die Daten liegen in Deutschland. Rechnen Sie bei vielen Dokumenten die Archivierungskosten und die Flex-Option mit ein."),
    ]),
  },
};

const pipedrive: Profile = {
  slug: "pipedrive",
  data: {
    name: "Pipedrive",
    slug: "pipedrive",
    vendor: "Pipedrive OÜ",
    categories: [crm.id],
    summary: "CRM-Software für Vertriebsteams mit vier Plänen pro Nutzer, Apps für iPhone und Android und 14 Tagen Testphase ohne Kreditkarte.",
    affiliateLink: LINKS.pipedrive,
    ctaLabel: "Kostenlos testen",
    trial: "14 Tage, ohne Kreditkarte",
    entryPrice: 19,
    facts: [
      { label: "Anbieter", value: "Pipedrive OÜ, Tallinn (Estland)" },
      { label: "Bereitstellung", value: "Cloud (Browser); Apps für iPhone und Android" },
      { label: "Pläne", value: "Lite, Growth, Premium, Ultimate" },
      { label: "Einstiegspreis", value: "Lite 19 € pro Nutzer und Monat, 14 € bei jährlicher Abrechnung, zzgl. MwSt." },
      { label: "Testphase", value: "14 Tage mit vollem Zugriff, ohne Kreditkarte; beliebig viele Teammitglieder einladbar" },
      { label: "Abrechnung", value: "monatlich oder jährlich (laut Anbieter bis zu 26 % günstiger)" },
      { label: "Add-ons", value: "LeadBooster, Projects, Campaigns, Webbesucher und Smart Docs gegen Aufpreis" },
      { label: "Hosting", value: "AWS-Rechenzentren in Europa und den USA laut Anbieter" },
      { label: "Datenschutz", value: "DSGVO, SOC 2, SOC 3, ISO/IEC 27001, ISO 27701 und EU-US Data Privacy Framework laut Anbieter; AVV auf der Seite nicht erwähnt" },
      { label: "Schnittstellen", value: "über 500 Integrationen und eine API für Entwickler laut Anbieter" },
    ],
    plans: [
      { name: "Lite", monthlyNet: 19, annualMonthly: 14, billing: "pro Nutzer und Monat; 14 € bei jährlicher Abrechnung", includes: "Einstiegsplan; laut Anbieter übernimmt Meeting-Intelligence Verwaltungsaufgaben, damit sich das Team auf den Vertrieb konzentriert", unit: "perUser" },
      { name: "Growth", monthlyNet: 34, annualMonthly: 24, billing: "pro Nutzer und Monat; 24 € bei jährlicher Abrechnung", includes: "zusätzlich Automatisierung von E-Mails und Follow-ups laut Anbieter", unit: "perUser" },
      { name: "Premium", monthlyNet: 64, annualMonthly: 49, billing: "pro Nutzer und Monat; 49 € bei jährlicher Abrechnung", includes: "Werkzeuge für den gesamten Vertriebszyklus von Leads bis zum Abschluss; laut Anbieter der beliebteste Plan", unit: "perUser" },
      { name: "Ultimate", monthlyNet: 89, annualMonthly: 69, billing: "pro Nutzer und Monat; 69 € bei jährlicher Abrechnung", includes: "umfassendster Funktionsumfang laut Anbieter", unit: "perUser" },
    ],
    scenarioBasis: "users",
    priceNote: "Preise pro Nutzer und Monat zzgl. MwSt. Die Preisseite führt die Pläne in Euro mit denselben Beträgen wie in US-Dollar. Den genauen Funktionsumfang je Plan zeigt der Planvergleich des Anbieters.",
    verdict:
      "Pipedrive ist ein CRM für kleine und mittlere Vertriebsteams, das Leads und Deals in den Mittelpunkt stellt. Die Preise pro Nutzer sind offen veröffentlicht, die Testphase dauert 14 Tage ohne Kreditkarte. Gehostet wird laut Anbieter in AWS-Rechenzentren in Europa und den USA; welche Region für Ihr Konto gilt, sollten Sie vorab klären.",
    checks: [
      [CRIT.prices, "yes", "Alle vier Pläne mit Preisen pro Nutzer, monatlich und jährlich"],
      [CRIT.trial, "yes", "14 Tage mit vollem Zugriff, ohne Kreditkarte"],
      [CRIT.term, "yes", "Monatliche Abrechnung wählbar"],
      [CRIT.einv, "na", "Für CRM-Software nicht relevant"],
      [CRIT.datev, "na", "Für CRM-Software nicht relevant"],
      [CRIT.data, "partial", "AWS-Rechenzentren in Europa und den USA; welche Region für ein Konto gilt, nennt die Seite nicht"],
      [CRIT.avv, "unknown", "Datenschutzseite nennt DSGVO und Zertifizierungen, aber keinen AVV"],
      [CRIT.payroll, "na", "Für CRM-Software nicht relevant"],
      [CRIT.mobile, "yes", "Apps für iPhone und Android"],
      [CRIT.api, "yes", "API für Entwickler laut Anbieter"],
    ].map(([criterion, status, note]) => ({ criterion, status, note })),
    fits: T([
      "Vertriebsteams in kleinen und mittleren Unternehmen, die Leads und Deals übersichtlich verwalten wollen",
      "Teams im Außendienst, die mit den Apps für iPhone und Android arbeiten",
    ]),
    notFits: T([
      "Unternehmen, die Rechnungen, Buchhaltung oder Warenwirtschaft in derselben Software brauchen; Pipedrive ist ein reines CRM",
      "Betriebe, die eine Datenhaltung ausschließlich in Deutschland voraussetzen: Pipedrive nennt Rechenzentren in Europa und den USA",
    ]),
    sources: [SRC.pipedrivePrices, SRC.pipedrivePrivacy, SRC.pipedriveMobile],
    verified: day(TODAY),
    review: doc([
      h2("Was ist Pipedrive?"),
      p("Pipedrive ist eine CRM-Software der Pipedrive OÜ mit Sitz in Tallinn. Sie richtet sich an Vertriebsteams und stellt Leads, Deals und die nächsten Aktivitäten in den Mittelpunkt. Laut Anbieter arbeiten weltweit über 100.000 Vertriebsteams mit Pipedrive."),
      h2("Pläne im Überblick"),
      ul([
        "**Lite:** Einstiegsplan; laut Anbieter übernimmt Meeting-Intelligence Verwaltungsaufgaben, damit sich das Team auf den Vertrieb konzentriert",
        "**Growth:** zusätzlich Automatisierung von E-Mails und Follow-ups",
        "**Premium:** Werkzeuge für den gesamten Vertriebszyklus, von Leads bis zum Abschluss; laut Anbieter der beliebteste Plan",
        "**Ultimate:** der umfassendste Funktionsumfang",
      ]),
      p("Ergänzend bietet Pipedrive kostenpflichtige Add-ons: LeadBooster für die Lead-Generierung, Projects für Projekte, Campaigns für E-Mail-Marketing, Webbesucher und Smart Docs für Dokumente. Laut Anbieter lassen sie sich zu jedem Plan hinzubuchen."),
      h2("Preise und Kosten erklärt"),
      p("Pipedrive rechnet pro Nutzer und Monat ab, zzgl. MwSt. Die Preisseite führt die Pläne in Euro: Lite kostet 19 € bei monatlicher und 14 € bei jährlicher Abrechnung, Growth 34 € beziehungsweise 24 €, Premium 64 € beziehungsweise 49 € und Ultimate 89 € beziehungsweise 69 €."),
      p("Rechenbeispiel mit fünf Nutzenden im Plan Growth: 170 € pro Monat bei monatlicher Abrechnung, bei Jahreszahlung umgerechnet 120 € pro Monat. Über ein Jahr sind das 2.040 € gegenüber 1.440 €, also 600 € weniger."),
      h2("Stärken"),
      ul([
        "Klar veröffentlichte Preise pro Nutzer, monatlich oder jährlich",
        "14 Tage kostenlos testen, ohne Kreditkarte und mit dem ganzen Team",
        "Apps für iPhone und Android",
        "Über 500 Integrationen und eine API laut Anbieter",
      ]),
      h2("Grenzen und offene Punkte"),
      ul([
        "Die Kosten steigen mit jeder weiteren Person linear",
        "Rechenzentren in Europa und den USA: welche Region gilt, sollten Sie vor dem Start klären",
        "Einen Auftragsverarbeitungsvertrag erwähnt die Datenschutzseite nicht",
        "Pipedrive ist ein CRM: Buchhaltung, E-Rechnung und Lohn brauchen eine weitere Software",
      ]),
      h2("Für wen eignet sich Pipedrive?"),
      h3("Passt gut"),
      ul([
        "Vertriebsteams, die Leads und Deals in einer übersichtlichen Oberfläche verfolgen wollen",
        "Außendienst und Teams, die viel unterwegs mit dem Smartphone arbeiten",
      ]),
      h3("Passt weniger"),
      ul([
        "Unternehmen, die CRM, Rechnungen und Buchhaltung in einer Software bündeln möchten",
        "Betriebe mit der Vorgabe, Daten ausschließlich in Deutschland zu speichern",
      ]),
      h2("Datenschutz und Sicherheit"),
      p("Pipedrive-Konten werden laut Anbieter in AWS-Rechenzentren in Europa und den USA gehostet, Daten werden verschlüsselt übertragen und täglich gesichert. Pipedrive nennt die Einhaltung der DSGVO sowie SOC 2, SOC 3, ISO/IEC 27001 und ISO 27701 und beruft sich auf das EU-US Data Privacy Framework. Klären Sie vor dem Abschluss, in welcher Region Ihre Daten liegen, und lassen Sie sich den Auftragsverarbeitungsvertrag geben. Hintergründe im Beitrag [Cloud-Software und Datenschutz](/magazin/cloud-software-datenschutz-avv-dsgvo)."),
      h2("Einführung in der Praxis"),
      ol([
        "Die Testphase starten und das Team einladen; laut Anbieter ohne Begrenzung der Personenzahl",
        "Die Phasen der Vertriebspipeline an den eigenen Ablauf anpassen",
        "Kontakte und laufende Deals übernehmen",
        "Die Apps auf den Smartphones des Außendienstes einrichten",
        "Vor Ende der Testphase den Plan wählen und monatliche gegen jährliche Abrechnung durchrechnen",
      ]),
      h2("Wann eine andere Lösung besser passt"),
      ul([
        "[weclapp](/software/weclapp): wenn CRM, Projekte, Rechnungen und Buchhaltung in einem Cloud-ERP mit Daten in Deutschland laufen sollen (CRM ab Paket ERP Dienstleistung)",
      ]),
      h2("Häufige Fragen zu Pipedrive"),
      h3("Was kostet Pipedrive?"),
      p("Ab 14 € pro Nutzer und Monat bei jährlicher Abrechnung (Lite), bei monatlicher Abrechnung 19 €. Alle Preise zzgl. MwSt."),
      h3("Kann ich Pipedrive kostenlos testen?"),
      p("Ja, 14 Tage mit vollem Zugriff und ohne Kreditkarte. Sie können beliebig viele Teammitglieder in die Testversion einladen."),
      h3("Wo liegen meine Daten?"),
      p("Laut Anbieter in AWS-Rechenzentren in Europa und den USA. Welche Region für Ihr Konto gilt, nennt die Datenschutzseite nicht."),
      h2("Fazit"),
      p("Pipedrive passt zu Vertriebsteams, die ein schlankes CRM mit klaren Preisen suchen und unterwegs mit Apps arbeiten. Weil jede Person einzeln zählt, lohnt sich ein Blick auf die Jahreszahlung. Klären Sie vor dem Start Datenregion und Auftragsverarbeitungsvertrag."),
    ]),
  },
};

for (const prof of [easybill, pipedrive]) {
  const cur = await first("software", { slug: { equals: prof.slug } });
  if (cur) await payload.update({ collection: "software", id: cur.id, data: prof.data as any, overrideAccess: true });
  else await payload.create({ collection: "software", data: prof.data as any, overrideAccess: true });
  console.log(cur ? "profile updated:" : "profile created:", prof.slug);
}

/* ---------- 5. alternatives (two-way, appended, never removed) ---------- */
const swId = async (slug: string) => (await first("software", { slug: { equals: slug } }))?.id;
async function addAlternatives(slug: string, alts: string[]) {
  const cur = await first("software", { slug: { equals: slug } });
  if (!cur) return;
  const ids = new Set<any>((cur.alternatives ?? []).map((a: any) => (typeof a === "object" ? a.id : a)));
  for (const a of alts) {
    const id = await swId(a);
    if (id) ids.add(id);
  }
  await payload.update({ collection: "software", id: cur.id, data: { alternatives: [...ids] } as any, overrideAccess: true });
}
await addAlternatives("easybill", ["lexware-office", "sage-active", "sevdesk"]);
await addAlternatives("pipedrive", ["weclapp"]);
await addAlternatives("lexware-office", ["easybill"]);
await addAlternatives("sevdesk", ["easybill"]);

/* ---------- 6. article notice: hasAffiliate = article contains a software box whose link is a Werbelink ---------- */
const affiliateSoftwareIds = new Set(
  (await payload.find({ collection: "software", limit: 200, depth: 1, overrideAccess: true })).docs
    .filter((s: any) => typeof s.affiliateLink === "object" && s.affiliateLink?.isAffiliate)
    .map((s: any) => String(s.id)),
);
const docs = (await payload.find({ collection: "beitraege", where: { _status: { equals: "published" } }, limit: 300, depth: 0, overrideAccess: true })).docs as any[];
for (const d of docs) {
  const ids: string[] = [];
  JSON.stringify(d.body ?? {}, (k, v) => {
    if (v && typeof v === "object" && v.blockType === "affiliateCta" && v.software != null) ids.push(String(typeof v.software === "object" ? v.software.id : v.software));
    return v;
  });
  const should = ids.some((id) => affiliateSoftwareIds.has(id));
  if (Boolean(d.hasAffiliate) !== should) {
    await payload.update({ collection: "beitraege", id: d.id, data: { hasAffiliate: should, _status: "published" } as any, overrideAccess: true });
    console.log("hasAffiliate", should, d.slug);
  }
}

console.log("Partners done.");
process.exit(0);
