// One-off CMS fixes after the Sage affiliate review (2026-11-15). Safe to re-run (every step is idempotent).
// Run: pnpm exec payload run src/seed/review-fixes.ts   (writes to the database in DATABASE_URL, i.e. Supabase)
//  1. New topic "Digitalisierung & Datenschutz" for articles that fit none of the six business areas.
//  2. Articles moved to the topic that matches their subject.
//  3. The Sage Active profile linked to the retired article /magazin/e-rechnung-fristen-bis-2028 (redirected);
//     the link now points to the E-Rechnung-2027 guide with matching link text.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPayload } from "payload";
import config from "../../payload.config";

export const NEW_CATEGORY = {
  slug: "digitalisierung-datenschutz",
  name: "Digitalisierung & Datenschutz",
  icon: "Cloud" as const,
  description: "KI, Cloud-Software, DSGVO und Bürokratieabbau",
  intro:
    "Digitalisierung betrifft jeden Fachbereich: Cloud-Software, KI-Funktionen und digitale Abläufe sollen Zeit sparen, werfen aber Fragen zu Datenschutz und Auftragsverarbeitung auf. Hier finden Sie Beiträge zu Zahlen, Pflichten und einem sinnvollen Einstieg.",
  order: 6,
};

const MOVES: Record<string, string> = {
  "ki-im-mittelstand-huerden-einstieg": "digitalisierung-datenschutz",
  "cloud-software-datenschutz-avv-dsgvo": "digitalisierung-datenschutz",
  "buerokratie-mittelstand-zeit-sparen-software": "digitalisierung-datenschutz",
  "zahlungsverzug-kunden-mahnwesen-automatisieren": "rechnungsstellung-e-rechnung",
};

const OLD_URL = "/magazin/e-rechnung-fristen-bis-2028";
const NEW_URL = "/ratgeber/e-rechnung-2027-pflicht-unternehmen";
const NEW_TEXT = "unserem Ratgeber zur E-Rechnung ab 2027";

/** Points every link to the retired article at the guide and replaces its text. Returns the number of links changed. */
function relink(node: any): number {
  if (!node || typeof node !== "object") return 0;
  if (Array.isArray(node)) return node.reduce((n, x) => n + relink(x), 0);
  let n = 0;
  if (node.type === "link" && node.fields?.url === OLD_URL) {
    node.fields.url = NEW_URL;
    const first = (node.children ?? []).find((c: any) => c.type === "text");
    if (first) {
      first.text = NEW_TEXT;
      node.children = [first];
    }
    n++;
  }
  for (const k of Object.keys(node)) if (k !== "fields") n += relink(node[k]);
  return n;
}

const payload = await getPayload({ config });
const catId = async (slug: string) => (await payload.find({ collection: "categories", where: { slug: { equals: slug } }, limit: 1, depth: 0 })).docs[0]?.id;

// 1. Topic
if (!(await catId(NEW_CATEGORY.slug))) {
  await payload.create({ collection: "categories", data: NEW_CATEGORY });
  console.log(`categories/${NEW_CATEGORY.slug}: created`);
}

// 2. Moves
for (const [slug, target] of Object.entries(MOVES)) {
  const d: any = (await payload.find({ collection: "beitraege", where: { slug: { equals: slug } }, limit: 1, depth: 0, draft: false })).docs[0];
  const id = await catId(target);
  if (!d || !id) {
    console.log(`beitraege/${slug}: skipped (doc or category missing)`);
    continue;
  }
  if (d.category !== id) {
    await payload.update({ collection: "beitraege", id: d.id, data: { category: id }, draft: false, depth: 0 });
    console.log(`beitraege/${slug}: category -> ${target}`);
  }
}

// 3. Links (software reviews and article bodies)
for (const [collection, field] of [["software", "review"], ["beitraege", "body"]] as const) {
  const { docs } = await payload.find({ collection, limit: 200, depth: 0, pagination: false, draft: false });
  for (const d of docs as any[]) {
    if (!d[field]) continue;
    const copy = JSON.parse(JSON.stringify(d[field]));
    const n = relink(copy);
    if (n) {
      await payload.update({ collection, id: d.id, data: { [field]: copy }, draft: false, depth: 0 });
      console.log(`${collection}/${d.slug}: ${n} link(s) -> ${NEW_URL}`);
    }
  }
}
process.exit(0);
