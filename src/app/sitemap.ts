import type { MetadataRoute } from "next";
import { getCategories, getDocs, getGlossary, getSoftwareList } from "@/lib/cms";
import { SITE } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [CATEGORIES, DOCS, SOFTWARE, GLOSSARY] = await Promise.all([getCategories(), getDocs(), getSoftwareList(), getGlossary()]);
  const u = (p: string, d?: string) => ({ url: `${SITE.url}${p}`, lastModified: d ? new Date(d) : new Date("2026-11-06") });
  return [
    u("/"),
    u("/ratgeber"),
    u("/magazin"),
    u("/software"),
    u("/glossar"),
    u("/marktdaten"),
    ...["/ueber-uns", "/methodik", "/transparenz", "/kontakt", "/newsletter", "/impressum", "/datenschutz", "/cookie-einstellungen"].map((p) => u(p)),
    ...CATEGORIES.map((c) => u(`/ratgeber/kategorie/${c.slug}`)),
    ...DOCS.map((d) => u(`/${d.kind}/${d.slug}`, d.updated)),
    ...SOFTWARE.map((s) => u(`/software/${s.slug}`, s.verified)),
    ...GLOSSARY.map((t) => u(`/glossar/${t.slug}`)),
  ];
}
