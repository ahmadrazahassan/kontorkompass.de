// One-off CMS fix (2026-11-15): the Sage Active profile told readers to get written confirmation that
// E-Rechnungen can be created. Sage lists Sage Active among its E-Rechnung solutions
// (https://www.sage.com/de-de/e-rechnung/loesungen/, "erstellen, versenden und verarbeiten"), while the
// product page describes reading them in detail. The new wording states exactly that. Safe to re-run.
// Run: pnpm exec payload run src/seed/sage-erechnung-fix.ts   (writes to the database in DATABASE_URL, i.e. Supabase)
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from "payload";
import config from "../../payload.config";
import TEXTS from "./sage-erechnung-texts.json";

const payload = await getPayload({ config });
const doc: any = (await payload.find({ collection: "software", where: { slug: { equals: "sage-active" } }, limit: 1, depth: 0, draft: false })).docs[0];
if (!doc) {
  console.log("software/sage-active: not found");
  process.exit(1);
}

const data: Record<string, unknown> = {};
let total = 0;
for (const [key, value] of Object.entries(doc)) {
  if (["id", "createdAt", "updatedAt", "_status"].includes(key) || value == null) continue;
  let json = JSON.stringify(value);
  let n = 0;
  for (const [from, to] of TEXTS as [string, string][]) {
    // Compare in JSON form, so quotes inside the texts match the stored encoding.
    const a = JSON.stringify(from).slice(1, -1);
    const b = JSON.stringify(to).slice(1, -1);
    const parts = json.split(a);
    if (parts.length > 1) {
      n += parts.length - 1;
      json = parts.join(b);
    }
  }
  if (n) {
    data[key] = JSON.parse(json);
    total += n;
    console.log(`software/sage-active.${key}: ${n} passage(s) replaced`);
  }
}
if (total) {
  // Copy of the document before the change, kept outside the repository.
  const { writeFileSync } = await import("node:fs");
  writeFileSync("../sage-active.backup-before-erechnung-fix.json", JSON.stringify(doc, null, 2));
}
if (total) await payload.update({ collection: "software", id: doc.id, data, draft: false, depth: 0 });
else console.log("software/sage-active: nothing to replace (already fixed?)");
process.exit(0);
