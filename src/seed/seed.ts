// Loads the launch content (categories, sources, glossary, software, first two articles) into Payload.
// Run: pnpm seed        (skips if content already exists; pass --force to wipe and reload)
import { getPayload } from "payload";
import config from "../../payload.config";
import { CATEGORIES, DOCS, GLOSSARY, SOFTWARE, SOURCES_ERECHNUNG } from "../content/data";
import { AFFILIATE_LINKS } from "../lib/affiliate";

const force = process.argv.includes("--force");
const payload = await getPayload({ config });

const existing = await payload.count({ collection: "beitraege" });
if (existing.totalDocs > 0 && !force) {
  console.log("Content already present. Use --force to wipe and reload.");
  process.exit(0);
}
if (force) {
  for (const c of ["beitraege", "software", "glossar", "sources", "categories", "affiliate-links"] as const) {
    await payload.delete({ collection: c, where: { id: { exists: true } }, overrideAccess: true });
  }
}

const day = (s: string) => new Date(`${s}T12:00:00.000Z`).toISOString();

// Affiliate links
const linkIds: Record<string, number | string> = {};
for (const l of Object.values(AFFILIATE_LINKS)) {
  const d = await payload.create({
    collection: "affiliate-links",
    data: { slug: l.slug, partner: l.partner, trackingUrl: l.trackingUrl, isAffiliate: l.isAffiliate, network: l.isAffiliate ? "Impact (nach Freigabe)" : undefined, active: true },
  });
  linkIds[l.slug] = d.id;
}

// Categories
const catIds: Record<string, number | string> = {};
for (const [i, c] of CATEGORIES.entries()) {
  const d = await payload.create({
    collection: "categories",
    data: { name: c.name, slug: c.slug, icon: c.icon as never, description: c.description, intro: c.intro, order: i },
  });
  catIds[c.slug] = d.id;
}

// Sources (numbered as cited in the articles)
const srcIds: Record<number, number | string> = {};
for (const s of SOURCES_ERECHNUNG) {
  const type = /Sage|Lexware|sevdesk/.test(s.publisher) ? "anbieter" : /IHK/.test(s.publisher) ? "kammer" : "presse";
  const d = await payload.create({
    collection: "sources",
    data: { number: s.id, publisher: s.publisher, title: s.title, url: s.url, accessedAt: day(s.accessed), type },
  });
  srcIds[s.id] = d.id;
}

// Glossary
for (const t of GLOSSARY) {
  await payload.create({
    collection: "glossar",
    data: { term: t.term, slug: t.slug, short: t.short, body: t.body.map((text) => ({ text })), sources: t.sourceIds.map((n) => srcIds[n]) as never },
  });
}

// Software (alternatives in a second pass)
const swIds: Record<string, number | string> = {};
for (const s of SOFTWARE) {
  const d = await payload.create({
    collection: "software",
    data: {
      name: s.name,
      slug: s.slug,
      vendor: s.vendor,
      categories: s.categories.map((c) => catIds[c]) as never,
      summary: s.summary,
      affiliateLink: linkIds[s.affiliateSlug] as never,
      ctaLabel: s.ctaLabel,
      trial: s.trial,
      entryPrice: s.entryPrice ?? undefined,
      facts: s.facts.map(([label, value]) => ({ label, value })),
      plans: s.plans.map((p) => ({ name: p.name, monthlyNet: p.monthlyNet ?? undefined, billing: p.billing, includes: p.includes, promo: p.promo })),
      priceNote: s.priceNote,
      fits: s.fits.map((text) => ({ text })),
      notFits: s.notFits.map((text) => ({ text })),
      sources: s.sourceIds.map((n) => srcIds[n]) as never,
      verified: day(s.verified),
    },
  });
  swIds[s.slug] = d.id;
}
for (const s of SOFTWARE) {
  await payload.update({ collection: "software", id: swIds[s.slug], data: { alternatives: s.alternatives.map((a) => swIds[a]) as never } });
}

// Articles (bodies still live in code; see legacyBody)
const legacy: Record<string, "e-rechnung-2027" | "fristen"> = {
  "e-rechnung-2027-pflicht-unternehmen": "e-rechnung-2027",
  "e-rechnung-fristen-bis-2028": "fristen",
};
for (const d of DOCS) {
  await payload.create({
    collection: "beitraege",
    draft: false,
    data: {
      _status: "published",
      title: d.title,
      slug: d.slug,
      kind: d.kind,
      category: catIds[d.category] as never,
      lead: d.lead,
      takeaways: d.takeaways.map((text) => ({ text })),
      legacyBody: legacy[d.slug],
      legacyToc: d.toc.map((t) => ({ anchor: t.id, label: t.label })),
      faqs: d.faqs,
      sources: d.sourceIds.map((n) => srcIds[n]) as never,
      lastVerifiedAt: day(d.updated),
      legalDisclaimer: d.legalDisclaimer,
      hasAffiliate: d.hasAffiliate,
      seoTitle: d.seoTitle,
      description: d.description,
      readingMinutes: d.readingMinutes,
      coverSeed: d.coverSeed,
      publishedAt: day(d.published),
    },
  });
}

console.log("Seed complete.");
process.exit(0);
