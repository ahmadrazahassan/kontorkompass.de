import "server-only";
import { getPayload } from "payload";
import config from "@payload-config";
import { cache } from "react";
import type { Category, Doc, GlossaryTerm, Software, Source } from "@/content/data";
import { slugify } from "@/lib/format";

export const getCms = cache(async () => getPayload({ config }));

/* eslint-disable @typescript-eslint/no-explicit-any */
const iso = (d?: string | null) => (d ? new Date(d).toISOString().slice(0, 10) : "");
const rel = <T,>(v: any): T | null => (v && typeof v === "object" ? (v as T) : null);

function mapSource(s: any, index = 0): Source {
  return { id: s.number ?? index + 1, publisher: s.publisher, title: s.title, url: s.url, accessed: iso(s.accessedAt) };
}

function mapCategory(c: any): Category {
  return { slug: c.slug, name: c.name, icon: c.icon, description: c.description, intro: c.intro };
}

function lexicalToc(body: any): { id: string; label: string }[] {
  const out: { id: string; label: string }[] = [];
  const walk = (nodes: any[]) => {
    for (const n of nodes ?? []) {
      if (n.type === "heading" && n.tag === "h2") {
        const text = (n.children ?? []).map((c: any) => c.text ?? "").join("");
        if (text) out.push({ id: slugify(text), label: text });
      }
    }
  };
  walk(body?.root?.children ?? []);
  return out;
}

function mapDoc(d: any): Doc & { body?: any; legacyBody?: string | null; cover?: { src: string; alt: string; aiGenerated: boolean } | null } {
  const cat = rel<any>(d.category);
  const sources = (d.sources ?? []).map(rel).filter(Boolean) as any[];
  const toc = d.legacyBody
    ? (d.legacyToc ?? []).map((t: any) => ({ id: t.anchor, label: t.label }))
    : lexicalToc(d.body);
  return {
    slug: d.slug,
    kind: d.kind,
    title: d.title,
    seoTitle: d.seoTitle || d.title,
    description: d.description,
    lead: d.lead,
    category: cat?.slug ?? "",
    readingMinutes: d.readingMinutes ?? 5,
    published: iso(d.publishedAt ?? d.createdAt),
    updated: iso(d.lastVerifiedAt ?? d.updatedAt),
    hasAffiliate: Boolean(d.hasAffiliate),
    legalDisclaimer: Boolean(d.legalDisclaimer),
    takeaways: (d.takeaways ?? []).map((t: any) => t.text),
    toc,
    sourceIds: sources.map((s, i) => s.number ?? i + 1),
    faqs: (d.faqs ?? []).map((f: any) => ({ q: f.q, a: f.a })),
    coverSeed: d.coverSeed ?? 1,
    body: d.body,
    legacyBody: d.legacyBody ?? null,
    // An image uploaded in the CMS ("Titelbild") overrides the curated brief image.
    cover: (() => {
      const m = rel<any>(d.heroImage);
      return m?.url ? { src: m.url as string, alt: (m.alt as string) ?? "", aiGenerated: /KI/i.test(m.credit ?? "") } : null;
    })(),
  };
}

function mapSoftware(s: any): Software {
  const link = rel<any>(s.affiliateLink);
  return {
    slug: s.slug,
    name: s.name,
    vendor: s.vendor,
    categories: (s.categories ?? []).map((c: any) => rel<any>(c)?.slug).filter(Boolean),
    summary: s.summary,
    affiliateSlug: link?.slug ?? "",
    isAffiliate: Boolean(link?.isAffiliate),
    ctaLabel: s.ctaLabel,
    facts: (s.facts ?? []).map((f: any) => [f.label, f.value] as [string, string]),
    plans: (s.plans ?? []).map((p: any) => ({
      name: p.name,
      monthlyNet: p.monthlyNet ?? null,
      billing: p.billing,
      includes: p.includes,
      promo: p.promo ?? undefined,
      unit: p.unit ?? "flat",
      includedUsers: p.includedUsers ?? null,
      extraUserMonthly: p.extraUserMonthly ?? null,
      includedEmployees: p.includedEmployees ?? null,
      extraEmployeeMonthly: p.extraEmployeeMonthly ?? null,
      minMonthly: p.minMonthly ?? null,
      annualMonthly: p.annualMonthly ?? null,
      promoMonthly: p.promoMonthly ?? null,
      promoMonths: p.promoMonths ?? null,
    })),
    scenarioBasis: s.scenarioBasis ?? "users",
    verdict: s.verdict ?? undefined,
    review: s.review ?? undefined,
    checks: (s.checks ?? []).map((x: any) => ({ criterion: x.criterion, status: x.status, note: x.note ?? undefined })),
    priceNote: s.priceNote ?? undefined,
    fits: (s.fits ?? []).map((x: any) => x.text),
    notFits: (s.notFits ?? []).map((x: any) => x.text),
    alternatives: (s.alternatives ?? []).map((a: any) => rel<any>(a)?.slug).filter(Boolean),
    sourceIds: (s.sources ?? []).map(rel).filter(Boolean).map((x: any, i: number) => x.number ?? i + 1),
    verified: iso(s.verified),
    trial: s.trial,
    entryPrice: s.entryPrice ?? null,
  };
}

/* ---------- queries ---------- */
export const getCategories = cache(async (): Promise<Category[]> => {
  const p = await getCms();
  const r = await p.find({ collection: "categories", limit: 100, sort: "order", depth: 0, pagination: false });
  return r.docs.map(mapCategory);
});
export const getCategory = async (slug: string) => (await getCategories()).find((c) => c.slug === slug);

/** Topics with at least one published article. Navigation and topic lists use these, so a software-only category (e.g. CRM) never shows as an empty topic. */
export const getTopicCategories = cache(async (): Promise<Category[]> => {
  const [cats, docs] = await Promise.all([getCategories(), getDocs()]);
  return cats.filter((c) => docs.some((d) => d.category === c.slug));
});

export type DocWithBody = ReturnType<typeof mapDoc>;

export const getDocs = cache(async (kind?: "ratgeber" | "magazin"): Promise<DocWithBody[]> => {
  const p = await getCms();
  const r = await p.find({
    collection: "beitraege",
    limit: 200,
    depth: 1,
    pagination: false,
    sort: "-publishedAt",
    // The local API bypasses access control, so filter drafts explicitly (unpublished entries must not appear in lists or the sitemap).
    where: kind ? { and: [{ kind: { equals: kind } }, { _status: { equals: "published" } }] } : { _status: { equals: "published" } },
  });
  return r.docs.map(mapDoc);
});

export const getDoc = async (kind: "ratgeber" | "magazin", slug: string) => (await getDocs(kind)).find((d) => d.slug === slug) ?? null;

export const getSoftwareList = cache(async (): Promise<Software[]> => {
  const p = await getCms();
  const r = await p.find({ collection: "software", limit: 200, depth: 2, pagination: false, sort: "name" });
  return r.docs.map(mapSoftware);
});
export const getSoftware = async (slug: string) => (await getSoftwareList()).find((s) => s.slug === slug) ?? null;

export const getGlossary = cache(async (): Promise<(GlossaryTerm & { sourceIds: number[] })[]> => {
  const p = await getCms();
  const r = await p.find({ collection: "glossar", limit: 500, depth: 1, pagination: false, sort: "term" });
  return r.docs.map((t: any) => ({
    slug: t.slug,
    term: t.term,
    short: t.short,
    body: (t.body ?? []).map((b: any) => b.text),
    sourceIds: (t.sources ?? []).map(rel).filter(Boolean).map((x: any, i: number) => x.number ?? i + 1),
  }));
});
export const getTerm = async (slug: string) => (await getGlossary()).find((t) => t.slug === slug) ?? null;

export const getSourcesByNumber = cache(async (nums: number[]): Promise<Source[]> => {
  const p = await getCms();
  const r = await p.find({ collection: "sources", limit: 500, depth: 0, pagination: false, sort: "number" });
  return r.docs.filter((s: any) => nums.includes(s.number)).map((s: any, i: number) => mapSource(s, i));
});

/** True only while at least one partner programme is really active (isAffiliate + active in the CMS). Drives the "Werbelinks" notice in articles. */
export const hasActiveAffiliateLinks = cache(async (): Promise<boolean> => {
  const p = await getCms();
  const r = await p.count({ collection: "affiliate-links", where: { isAffiliate: { equals: true }, active: { equals: true } }, overrideAccess: true });
  return r.totalDocs > 0;
});

/** IDs of software whose /go link is an active Werbelink (for the article notice). */
export const getAffiliateSoftwareIds = cache(async (): Promise<Set<string>> => {
  const p = await getCms();
  const r = await p.find({ collection: "software", limit: 200, depth: 1, pagination: false, overrideAccess: true });
  return new Set(r.docs.filter((s: any) => typeof s.affiliateLink === "object" && s.affiliateLink?.isAffiliate && s.affiliateLink?.active !== false).map((s: any) => String(s.id)));
});

/** Software IDs referenced by "Passende Software" boxes in an article body. */
export function softwareBoxIds(body: unknown): string[] {
  const ids: string[] = [];
  JSON.stringify(body ?? {}, (_k, v) => {
    if (v && typeof v === "object" && v.blockType === "affiliateCta" && v.software != null) ids.push(String(typeof v.software === "object" ? v.software.id : v.software));
    return v;
  });
  return ids;
}

/** Partner names with an active Werbelink, for the Transparenz page. */
export const getActivePartners = cache(async (): Promise<string[]> => {
  const p = await getCms();
  const r = await p.find({ collection: "affiliate-links", where: { isAffiliate: { equals: true }, active: { equals: true } }, limit: 100, depth: 0, overrideAccess: true });
  return [...new Set(r.docs.map((d: any) => String(d.partner)))].sort((a, b) => a.localeCompare(b, "de"));
});

export async function getAffiliateTarget(slug: string) {
  const p = await getCms();
  const r = await p.find({ collection: "affiliate-links", where: { slug: { equals: slug }, active: { equals: true } }, limit: 1, depth: 0, overrideAccess: true });
  return r.docs[0] as any | undefined;
}
