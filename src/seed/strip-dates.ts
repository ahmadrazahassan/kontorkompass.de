// One-off cleanup: removes "Stand <date>" price-check notes from CMS content (user request 2026-11-11).
// Keeps factual dates (deadlines, court rulings, source publication dates). Run: pnpm exec payload run src/seed/strip-dates.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from "payload";
import config from "../../payload.config";

const D = String.raw`\d{2}\.\d{2}\.\d{4}`;
const RULES: [RegExp, string][] = [
  [new RegExp(String.raw`\s*\(Stand:? ${D}\)`, "g"), ""], // "(Stand 06.11.2026)"
  [new RegExp(String.raw`\(Stand:? ${D},\s*`, "g"), "("], // "(Stand 06.11.2026, regulär …)"
  [new RegExp(String.raw`,\s*Stand:? ${D}`, "g"), ""], // "…, Stand 06.11.2026"
  [new RegExp(String.raw`(^|\s)Stand:? ${D}[.,]?\s*`, "g"), "$1"], // "Stand 06.11.2026. Die Preise …"
  [/\s*\(Stand November 2026\)/g, ""],
  [/,\s*Stand November 2026/g, ""],
  [/MwSt\.\./g, "MwSt."],
  [/Zum Stichtag/g, "Bei unserer Preisprüfung im November 2026"],
  [/zum Stichtag/g, "bei unserer Preisprüfung im November 2026"],
  [/\s+\./g, "."],
];

const clean = (s: string) => RULES.reduce((acc, [re, to]) => acc.replace(re, to), s).replace(/^\s+/, (m) => m);

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
const FIELDS: Record<string, string[]> = {
  beitraege: ["lead", "takeaways", "body", "faqs", "description"],
  software: ["summary", "facts", "plans", "priceNote", "fits", "notFits", "verdict", "review", "checks", "trial"],
  sources: ["title"],
  glossar: ["short", "body"],
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
    if (changes) {
      await payload.update({ collection: collection as any, id: d.id, data, draft: false, depth: 0 });
      console.log(`${collection}/${d.slug ?? d.number ?? d.id}: ${changes} text(s) cleaned`);
    }
  }
}
process.exit(0);
