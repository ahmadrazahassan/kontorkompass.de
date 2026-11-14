// Adds weclapp and Personio (no affiliate programme assumed), links them from Sage profiles and extends three guides.
// Run: pnpm exec payload run src/seed/vendors.ts   (safe to re-run)
import { getPayload } from "payload";
import config from "../../payload.config";
import { affiliateCta, callout, h2, p, table } from "./lexical";

/* eslint-disable @typescript-eslint/no-explicit-any */
const payload = await getPayload({ config });
const day = (s: string) => new Date(`${s}T12:00:00.000Z`).toISOString();
const TODAY = "2026-11-06";
const first = async (collection: any, where: any) => (await payload.find({ collection, where, limit: 1, depth: 0 })).docs[0] as any;
const cat = async (slug: string) => (await first("categories", { slug: { equals: slug } })).id;
const srcId = async (n: number) => (await first("sources", { number: { equals: n } })).id;
const T = (arr: string[]) => arr.map((text) => ({ text }));

for (const s of [
  { number: 16, publisher: "weclapp SE", title: "Preise und Funktionen von weclapp", url: "https://www.weclapp.com/de/preise/", type: "anbieter" },
  { number: 17, publisher: "Personio SE & Co. KG", title: "Pläne und Preise", url: "https://www.personio.de/plaene/", type: "anbieter" },
]) {
  if (!(await first("sources", { number: { equals: s.number } }))) await payload.create({ collection: "sources", data: { ...s, type: s.type as never, accessedAt: day(TODAY) } });
}

const plainLink = async (slug: string, partner: string, url: string) =>
  (await first("affiliate-links", { slug: { equals: slug } })) ??
  (await payload.create({ collection: "affiliate-links", data: { slug, partner, trackingUrl: url, isAffiliate: false, active: true, notes: "Kein bekanntes Partnerprogramm: normaler Link ohne Werbekennzeichnung." } }));

/* ---------- weclapp ---------- */
if (!(await first("software", { slug: { equals: "weclapp" } }))) {
  const link = await plainLink("weclapp", "weclapp", "https://www.weclapp.com/de/preise/");
  await payload.create({
    collection: "software",
    data: {
      name: "weclapp",
      slug: "weclapp",
      vendor: "weclapp SE",
      categories: [await cat("erp-warenwirtschaft"), await cat("buchhaltung-finanzen"), await cat("rechnungsstellung-e-rechnung")] as never,
      summary: "Cloud-ERP mit den Paketen Starter, Dienstleistung und Handel, die Daten werden laut Anbieter ausschließlich in Deutschland gespeichert.",
      affiliateLink: link.id,
      ctaLabel: "Zum Anbieter",
      trial: "30 Tage kostenlos",
      entryPrice: 39,
      facts: [
        { label: "Bereitstellung", value: "Cloud; für Self-Hosting bietet weclapp laut Preisseite „weclappOn“ (Private Cloud vor Ort)" },
        { label: "Datenstandort", value: "laut Anbieter ausschließlich in Deutschland, mehrere Rechenzentren; Initiative „Cloud Services in Germany“" },
        { label: "Pakete", value: "ERP Starter, ERP Dienstleistung, ERP Handel, Enterprise (ab mehr als 10 Lizenzen individuell)" },
        { label: "Einstiegspreis", value: "39 € pro Nutzer und Monat netto (ERP Starter)" },
        { label: "Testphase", value: "30 Tage kostenlos; der Testaccount läuft danach automatisch ab und wird nicht automatisch kostenpflichtig" },
        { label: "Kündigung", value: "monatlich abgerechnete Lizenz: Frist von einem Monat; bei längerer Laufzeit nur zum Ende der Vertragslaufzeit" },
        { label: "E-Rechnung", value: "im Paket ERP Starter aufgeführt" },
        { label: "Buchhaltung", value: "im Starter als „Fibu & Banking“ enthalten; als Einzellizenz ab 39 € monatlich" },
        { label: "Zusatzmodule", value: "Vertragsmanagement, Helpdesk, weclapp POS je 55 € monatlich (mit Dienstleistung oder Handel kombinierbar)" },
      ],
      plans: [
        { name: "ERP Starter", monthlyNet: 39, billing: "nur monatlich buchbar, nicht mit anderen Paketen kombinierbar; pro Nutzer", includes: "Kontaktmanagement, Angebote & Rechnungen, Aufgaben & Kalender, Fibu & Banking, Berichtswesen, E-Rechnung; kein CRM-Paket, keine Warenwirtschaft" },
        { name: "ERP Dienstleistung", monthlyNet: 86, billing: "pro Nutzer und Monat; 86 € in der Ansicht „Jährlich“, 95 € in der Ansicht „Monatlich“ der Preisseite", includes: "zusätzlich CRM, Projektmanagement inkl. Leistungsnachweis, (Personal-)Zeiterfassung, API-Zugriff" },
        { name: "ERP Handel", monthlyNet: 163, billing: "pro Nutzer und Monat; 163 € in der Ansicht „Jährlich“, 179 € in der Ansicht „Monatlich“ der Preisseite", includes: "zusätzlich Warenwirtschaft, Disposition & Einkauf, Lagerverwaltung inkl. Mobile Lager-App, Serien- und Chargennummern, Produktion, Shop- und Marktplatzanbindung" },
      ],
      priceNote: "Nettopreise pro Nutzer und Monat zzgl. MwSt., Stand 06.11.2026. Die Preisseite zeigt zwei Preisansichten („Jährlich“ und „Monatlich“); die Zuordnung der niedrigeren Preise zur Jahresabrechnung ergibt sich aus der Standardansicht und sollte vor Veröffentlichung am Anbieter bestätigt werden.",
      fits: T(["kleine und mittlere Unternehmen im Dienstleistungs- oder Handelsbereich, die ein Cloud-ERP mit Datenhaltung in Deutschland suchen"]),
      notFits: T(["Unternehmen mit mehr als zehn Lizenzen, für die der Anbieter ein individuelles Enterprise-Angebot nennt (Preise dort nicht öffentlich)"]),
      sources: [await srcId(16)] as never,
      verified: day(TODAY),
    },
  });
}

/* ---------- Personio ---------- */
if (!(await first("software", { slug: { equals: "personio" } }))) {
  const link = await plainLink("personio", "Personio", "https://www.personio.de/plaene/");
  await payload.create({
    collection: "software",
    data: {
      name: "Personio",
      slug: "personio",
      vendor: "Personio SE & Co. KG",
      categories: [await cat("hr-personal"), await cat("lohn-gehalt"), await cat("zeiterfassung")] as never,
      summary: "HR-Plattform mit den Plänen Core, Core Pro und Core Enterprise sowie einem separaten Payroll-Modul, laut Anbieter in der EU gehostet.",
      affiliateLink: link.id,
      ctaLabel: "Zum Anbieter",
      trial: "Demo buchbar; Testphase nicht angegeben",
      entryPrice: 7.6,
      facts: [
        { label: "Pläne HR", value: "Core, Core Pro (laut Anbieter am beliebtesten), Core Enterprise" },
        { label: "Einstiegspreis HR", value: "ab 7,60 € pro Monat und Mitarbeitende; es gilt eine monatliche Mindestabnahme von 420 €" },
        { label: "Payroll", value: "separate Lösung ab 5 € pro Monat und Mitarbeitende; Anbindung an DATEV, ADDISON und ADP Advanced Pay laut Anbieter" },
        { label: "Core enthält", value: "Mitarbeitendenprofile, Dokumente und elektronische Signaturen (mit Einschränkungen), Analysen und Berichte, Workflow-Automatisierung, Zeiterfassung, vorbereitende Lohnbuchhaltung" },
        { label: "Hosting / Datenschutz", value: "laut Anbieter in der EU gehostet und DSGVO-konform; den AVV nennt die Preisseite nicht" },
        { label: "Preisangabe", value: "die Preisseite nennt weder Netto- noch Brutto-Angabe: beim Anbieter klären" },
        { label: "Zielgruppen", value: "Personio unterscheidet nach Unternehmensgröße (unter 200, 200–1.000, über 1.000 Mitarbeitende)" },
      ],
      plans: [
        { name: "Core", monthlyNet: 7.6, billing: "pro Mitarbeitende und Monat ab; Mindestabnahme 420 € monatlich; Netto/Brutto nicht angegeben", includes: "Mitarbeitendenprofile, Dokumente und Signaturen (mit Einschränkungen), Analysen, Workflow-Automatisierung, Zeiterfassung, vorbereitende Lohnbuchhaltung" },
        { name: "Core Pro", billing: "Preis auf Anfrage über Demo", includes: "alles aus Core plus u. a. Positionsmanagement und weitere Funktionen für komplexere HR-Arbeit" },
        { name: "Core Enterprise", billing: "Preis auf Anfrage über Demo", includes: "alles aus Core Pro plus Premium Support, Sandbox-Testumgebung, Whistleblowing, Mitarbeitendenumfragen, KI-Credits" },
        { name: "Payroll", monthlyNet: 5, billing: "pro Mitarbeitende und Monat ab; Netto/Brutto nicht angegeben", includes: "Prüfungen während der Lohnabrechnung, Gehaltsabrechnungsvorschau, automatisierte Abläufe" },
      ],
      priceNote: "Stand 06.11.2026. Die Preise hängen laut Anbieter von der Mitarbeiterzahl und den gewählten Zusatzfunktionen ab. Mit der Mindestabnahme von 420 € ergibt sich beim Einstiegspreis von 7,60 € rechnerisch eine Schwelle von etwa 56 Mitarbeitenden (eigene Berechnung: 420 ÷ 7,60).",
      fits: T(["Unternehmen, die HR-Prozesse, Zeiterfassung und Dokumente in einer EU-gehosteten Plattform bündeln wollen"]),
      notFits: T(["sehr kleine Betriebe: wegen der Mindestabnahme von 420 € pro Monat lohnt sich der Einstiegspreis erst bei größerer Mitarbeiterzahl (laut Preisseite)"]),
      sources: [await srcId(17)] as never,
      verified: day(TODAY),
    },
  });
}

/* ---------- cross-links between profiles ---------- */
const id = async (slug: string) => (await first("software", { slug: { equals: slug } })).id;
const setAlt = async (slug: string, alts: string[]) => {
  const cur = await first("software", { slug: { equals: slug } });
  await payload.update({ collection: "software", id: cur.id, data: { alternatives: await Promise.all(alts.map(id)) as never } });
};
await setAlt("sage-100", ["weclapp"]);
await setAlt("weclapp", ["sage-100"]);
await setAlt("sage-hr-suite", ["personio", "sage-lohnabrechnung"]);
await setAlt("personio", ["sage-hr-suite", "sage-lohnabrechnung"]);

/* ---------- extend guides ---------- */
async function extend(slug: string, marker: string, nodes: any[], newSources: number[]) {
  const g = await first("beitraege", { slug: { equals: slug } });
  const full = await payload.findByID({ collection: "beitraege", id: g.id, depth: 0 });
  const body: any = full.body;
  const children: any[] = body.root.children;
  if (JSON.stringify(children).includes(nodes[0].children?.[0]?.text ?? "__none__")) return console.log("already extended:", slug);
  const at = children.findIndex((c) => c.type === "heading" && c.children?.[0]?.text === marker);
  if (at < 0) return console.log("marker not found:", slug, marker);
  children.splice(at, 0, ...nodes);
  const srcs = new Set<any>(((full.sources as any[]) ?? []).map((s) => (typeof s === "object" ? s.id : s)));
  for (const n of newSources) srcs.add(await srcId(n));
  await payload.update({ collection: "beitraege", id: g.id, draft: false, data: { body, sources: [...srcs] as never } });
  console.log("extended:", slug);
}

await extend(
  "erp-kosten-mittelstand",
  "So planen Sie das Budget",
  [
    h2("Zum Vergleich: ein Cloud-ERP mit veröffentlichten Preisen"),
    p("Auch weclapp veröffentlicht Preise pro Nutzer und Monat (netto, zzgl. MwSt., Stand 06.11.2026). Die Preisseite zeigt zwei Ansichten, „Jährlich“ und „Monatlich“; die niedrigeren Werte stehen in der Standardansicht „Jährlich“. [16]"),
    table([
      ["Paket (weclapp)", "Jährlich (Standardansicht)", "Monatlich", "Inhalt laut Anbieter"],
      ["ERP Starter", "39 €", "39 € (nur monatlich buchbar)", "Kontakte, Angebote und Rechnungen, Fibu & Banking, E-Rechnung"],
      ["ERP Dienstleistung", "86 €", "95 €", "zusätzlich CRM, Projektmanagement, Zeiterfassung, API"],
      ["ERP Handel", "163 €", "179 €", "zusätzlich Warenwirtschaft, Lager, Produktion, Shop-Anbindung"],
    ]),
    p("Ab mehr als zehn Lizenzen nennt weclapp ein individuelles Enterprise-Angebot. Die Daten werden laut Anbieter ausschließlich in Deutschland gespeichert, 30 Tage lassen sich kostenlos testen. [16] Vergleichen Sie auch hier die Gesamtkosten inklusive Implementierung und interner Arbeitszeit, nicht nur den Lizenzpreis."),
    callout("info", "Preise nicht gleichsetzen", "Sage 100 (Module pro Nutzer, jährliche Abrechnung, lokale oder Cloud-Nutzung) und weclapp (Pakete pro Nutzer, rein cloudbasiert) sind in Aufbau und Abrechnung verschieden. Vergleichen Sie Angebote mit demselben Lastenheft."),
  ],
  [16],
);

await extend(
  "erp-einfuehrung-mittelstand",
  "Ein Beispiel für modulare Mittelstands-ERP",
  [
    h2("Cloud oder lokal: Beispiele aus dem Markt"),
    p("Anbieter unterscheiden sich vor allem in der Betriebsart. Sage 100 lässt sich nach Anbieterangabe lokal oder in der Cloud nutzen. [13] weclapp ist ein Cloud-ERP, bei dem die Daten laut Anbieter ausschließlich in Deutschland gespeichert werden, und bietet für Self-Hosting die Lösung „weclappOn“ (Private Cloud vor Ort) an. [16] Prüfen Sie Betriebsart, Datenstandort und Auftragsverarbeitungsvertrag schon in der Auswahlphase."),
  ],
  [16],
);

await extend(
  "hr-software-mittelstand",
  "Kleine Betriebe: leichtere Alternative",
  [
    h2("Beispiel Personio"),
    p("Personio ist eine HR-Plattform mit den Plänen Core, Core Pro und Core Enterprise. Laut Preisseite beginnen HR-Lösungen ab 7,60 € pro Monat und Mitarbeitende, es gilt eine monatliche Mindestabnahme von 420 €. Das Payroll-Modul startet ab 5 € pro Monat und Mitarbeitende. Ob die Preise netto oder brutto sind, nennt die Seite nicht. [17]"),
    table([
      ["", "Sage HR Suite [14]", "Personio [17]"],
      ["Bereitstellung", "lokal oder Cloud", "Cloud, laut Anbieter in der EU gehostet"],
      ["Einstieg", "Personalabrechnung ab 39 € pro Monat (zzgl. MwSt.)", "HR ab 7,60 € pro Mitarbeitende und Monat; Payroll ab 5 €"],
      ["Mindestabnahme / Vertrag", "jährliche Abrechnung, 12 Monate Mindestlaufzeit; andere Laufzeiten optional", "monatliche Mindestabnahme 420 € (HR)"],
      ["Module", "Personalabrechnung, Zeitmanagement, Bewerbermanagement", "Profile, Dokumente, Zeiterfassung, Workflows; Payroll separat"],
      ["Testen", "Produkttour; Testphase nicht angegeben", "Demo buchbar"],
    ]),
    p("Die Preismodelle sind nicht direkt vergleichbar: Sage nennt Modulpreise je Arbeitsplatz und Paket, Personio einen Preis je Mitarbeitenden mit Mindestabnahme. Rechnen Sie mit Ihrer tatsächlichen Mitarbeiterzahl. Beim Einstiegspreis von 7,60 € ergibt die Mindestabnahme von 420 € rechnerisch eine Schwelle von etwa 56 Mitarbeitenden (eigene Berechnung)."),
    affiliateCta(await id("personio"), "HR-Plattform mit Profilen, Dokumenten, Zeiterfassung und Workflow-Automatisierung; Preise ab 7,60 € pro Mitarbeitende und Monat bei 420 € Mindestabnahme."),
  ],
  [17],
);

console.log("Vendors done.");
process.exit(0);
