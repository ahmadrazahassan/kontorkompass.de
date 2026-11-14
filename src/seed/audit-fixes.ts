// One-off CMS fixes from the site audit (2026-11-14). Backup: kontorkompass.backup-before-audit-fixes.db
// Run once: pnpm exec payload run src/seed/audit-fixes.ts  (safe to re-run: every change is idempotent)
//  1. Sage links are plain links until Impact approves us (no *, no "Anzeige", no notice).
//  2. "Testbericht"/"im Test" -> "Software-Profil" (no hands-on tests happen).
//  3. Promo notes name the month of the price check instead of "zum Zeitpunkt unserer Prüfung".
//  4. Open research notes ("noch zu prüfen", "beim Anbieter erfragen", "vor Veröffentlichung erneut prüfen") resolved or stated neutrally.
//  5. Sources 46–48 (second BMF letter on E-Rechnung via IHK, Lexware E-Rechnung page) added.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from "payload";
import config from "../../payload.config";

const PRICE_MONTH = "November 2026";

// Applied to every string in the listed fields (CMS) – keep in sync with the seed files.
export const TEXT_RULES: [RegExp, string][] = [
  [/Kostenkurven nach Mitarbeiterzahl der $/, "Kostenkurven nach Mitarbeiterzahl das "], // precedes the link "Testbericht Sage Lohnabrechnung"
  [/Testberichten/g, "Software-Profilen"],
  [/Testbericht/g, "Software-Profil"],
  [/Aktion zum Zeitpunkt unserer Prüfung:/g, `Aktion bei unserer Preisprüfung im ${PRICE_MONTH}:`],
  [/Zum Zeitpunkt unserer Prüfung/g, `Bei unserer Preisprüfung im ${PRICE_MONTH}`],
  [/zum Zeitpunkt unserer Prüfung/g, `bei unserer Preisprüfung im ${PRICE_MONTH}`],
  [/; vor Veröffentlichung erneut prüfen\./g, "."],
  [/Hier sind die regulär durchgestrichenen Preise genannt/g, "Hier sind die regulären, durchgestrichenen Preise genannt"],
  [/beschreibt die Produktseite nicht eindeutig\. Fragen Sie vor dem Kauf nach\./g, "beschreibt die Produktseite nicht ausdrücklich. Lassen Sie sich das vor dem Kauf schriftlich bestätigen."],
  [/Erstellen nicht eindeutig beschrieben/g, "Erstellen auf der Produktseite nicht ausdrücklich beschrieben"],
  [/Auf der Preisseite nicht eindeutig angegeben/g, "Auf der Preisseite nicht ausdrücklich angegeben"],
  [/Details zum Mengenstaffel-Modell beim Anbieter erfragen\./g, "Details zum Mengenstaffel-Modell nennt die Produktseite nicht."],
  [
    /Die Zuordnung der E-Rechnungs-Funktionen zu den einzelnen Versionen geht aus der Preisseite nicht eindeutig hervor/g,
    "E-Rechnungen erstellen und übermitteln laut Anbieter erst ab Version M; die Version S kann sie nur empfangen",
  ],
];

// Exact replacements for single facts (software slug -> fact label -> new value).
const FACTS: Record<string, Record<string, string>> = {
  "sage-active": {
    "E-Rechnung": "Einlesen von XRechnung und ZUGFeRD in beiden Tarifen laut Anbieter; das Erstellen beschreibt die Produktseite nicht ausdrücklich",
    "Serverstandort / AVV":
      "Microsoft Azure, Rechenzentrum in Deutschland (laut Unterauftragsverarbeiter-Liste von Sage; die Produktseite nennt keinen Standort). AVV auf der Produktseite nicht erwähnt",
  },
  "sage-hr-suite": {
    "AVV / Serverstandort":
      "Gehostete Variante: Rechenzentrum der Microsoft GmbH in Deutschland laut Unterauftragsverarbeiter-Liste von Sage; die Produktseite nennt weder Standort noch AVV",
  },
  "sage-100": { AVV: "auf der Produktseite nicht erwähnt" },
  "sage-lohnabrechnung": { "Serverstandort / AVV": "auf der Produktseite nicht angegeben" },
  personio: { "Hosting / Datenschutz": "laut Anbieter in der EU gehostet und DSGVO-konform; den AVV nennt die Preisseite nicht" },
  "lexware-office": { "E-Rechnung": "Empfangen in allen Versionen; Erstellen und Übermitteln (ZUGFeRD, XRechnung) ab Version M laut Anbieter" },
};

// Same criterion, same evidence: Sage Active counts the Sage subprocessor list (source 36) as "Datenstandort öffentlich angegeben",
// so Sage HR Suite, whose profile cites the same list, does too (user approved 2026-11-14).
const CHECKS: Record<string, Record<string, { status: string; note: string }>> = {
  "sage-hr-suite": {
    "Datenstandort öffentlich angegeben": {
      status: "yes",
      note: "Gehostete Variante: Microsoft GmbH, Rechenzentrum in Deutschland (Unterauftragsverarbeiter-Liste von Sage)",
    },
  },
};

const NEW_SOURCES = [
  {
    number: 46,
    publisher: "IHK Köln",
    title: "BMF-Schreiben zur E-Rechnung vom 15.10.2025",
    url: "https://www.ihk.de/koeln/hauptnavigation/recht-steuern/steuern/bmf-schreiben-zur-e-rechnung-vom-15-10-2025-6774012",
    type: "kammer",
  },
  {
    number: 47,
    publisher: "IHK Hannover",
    title: "BMF veröffentlicht zweites Anwendungsschreiben zur E-Rechnung",
    url: "https://www.ihk.de/hannover/hauptnavigation/recht/aktuell3/bmf-veroeffentlicht-zweites-anwendungsschreiben-zur-e-rechnung-6797148",
    type: "kammer",
  },
  {
    number: 48,
    publisher: "Lexware",
    title: "E-Rechnung-Software: Funktionen je Version",
    url: "https://www.lexware.de/e-rechnung-software/",
    type: "anbieter",
  },
] as const;

const clean = (s: string) => TEXT_RULES.reduce((acc, [re, to]) => acc.replace(re, to), s);

function walk(v: any): [any, number] {
  if (typeof v === "string") {
    const out = clean(v);
    return [out, out === v ? 0 : 1];
  }
  if (Array.isArray(v)) {
    let n = 0;
    const arr = v.map((x) => {
      const [y, c] = walk(x);
      n += c;
      return y;
    });
    return [arr, n];
  }
  if (v && typeof v === "object") {
    let n = 0;
    const o: any = {};
    for (const [k, x] of Object.entries(v)) {
      if (["id", "_status", "slug", "url", "trackingUrl", "createdAt", "updatedAt"].includes(k)) {
        o[k] = x;
        continue;
      }
      const [y, c] = walk(x);
      o[k] = y;
      n += c;
    }
    return [o, n];
  }
  return [v, 0];
}

const payload = await getPayload({ config });

// 1. Affiliate status
const links = await payload.find({ collection: "affiliate-links", where: { isAffiliate: { equals: true } }, limit: 100, depth: 0, overrideAccess: true });
for (const l of links.docs as any[]) {
  await payload.update({ collection: "affiliate-links", id: l.id, data: { isAffiliate: false }, overrideAccess: true });
  console.log(`affiliate-links/${l.slug}: isAffiliate -> false (until programme approval)`);
}

// 5. Sources
const sourceIds: Record<number, number | string> = {};
for (const s of NEW_SOURCES) {
  const found = await payload.find({ collection: "sources", where: { number: { equals: s.number } }, limit: 1, depth: 0 });
  const doc: any = found.docs[0] ?? (await payload.create({ collection: "sources", data: { ...s, accessedAt: "2026-11-14T12:00:00.000Z" } as any }));
  sourceIds[s.number] = doc.id;
  console.log(`sources/${s.number}: ${found.docs[0] ? "exists" : "created"}`);
}
const addSources = async (collection: "beitraege" | "software", slug: string, numbers: number[]) => {
  const d: any = (await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: false })).docs[0];
  if (!d) return console.log(`${collection}/${slug}: not found`);
  const have = (d.sources ?? []).map((x: any) => (typeof x === "object" ? x.id : x));
  const next = [...have, ...numbers.map((n) => sourceIds[n]).filter((id) => !have.includes(id))];
  if (next.length !== have.length) {
    await payload.update({ collection, id: d.id, data: { sources: next } as any, draft: false, depth: 0 });
    console.log(`${collection}/${slug}: sources + ${numbers.join(", ")}`);
  }
};
await addSources("beitraege", "e-rechnung-2027-pflicht-unternehmen", [46, 47, 48]);
await addSources("software", "lexware-office", [48]);

// 6. Thin duplicate article -> draft (not deleted); next.config.ts redirects its URL to the E-Rechnung-2027 guide.
for (const slug of ["e-rechnung-fristen-bis-2028"]) {
  const d: any = (await payload.find({ collection: "beitraege", where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: false })).docs[0];
  if (d && d._status !== "draft") {
    await payload.update({ collection: "beitraege", id: d.id, data: { _status: "draft" } as any, draft: false, depth: 0 });
    console.log(`beitraege/${slug}: set to draft (redirected)`);
  }
}

// 2–4. Text rules + single facts
const FIELDS: Record<string, string[]> = {
  beitraege: ["lead", "takeaways", "body", "faqs", "description"],
  software: ["summary", "facts", "plans", "priceNote", "fits", "notFits", "verdict", "review", "checks", "trial"],
};
for (const [collection, fields] of Object.entries(FIELDS)) {
  const { docs } = await payload.find({ collection: collection as any, limit: 500, depth: 0, pagination: false, draft: false });
  for (const d of docs as any[]) {
    const data: any = {};
    let changes = 0;
    for (const f of fields) {
      if (d[f] === undefined || d[f] === null) continue;
      const [v, c] = walk(d[f]);
      if (c) {
        data[f] = v;
        changes += c;
      }
    }
    const facts = collection === "software" ? FACTS[d.slug] : undefined;
    if (facts) {
      const base = data.facts ?? d.facts ?? [];
      data.facts = base.map((f: any) => (facts[f.label] && f.value !== facts[f.label] ? (changes++, { ...f, value: facts[f.label] }) : f));
    }
    const checks = collection === "software" ? CHECKS[d.slug] : undefined;
    if (checks) {
      const base = data.checks ?? d.checks ?? [];
      data.checks = base.map((c: any) => {
        const want = checks[c.criterion];
        if (!want || (c.status === want.status && c.note === want.note)) return c;
        changes++;
        return { ...c, ...want };
      });
    }
    if (changes) {
      await payload.update({ collection: collection as any, id: d.id, data, draft: false, depth: 0 });
      console.log(`${collection}/${d.slug}: ${changes} change(s)`);
    }
  }
}
process.exit(0);
