// Shared helpers and sources for the pain-point article batch (Magazin).
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Payload } from "payload";
import { doc } from "./lexical";

export const TODAY = "2026-11-09";
export const day = (s: string) => new Date(`${s}T12:00:00.000Z`).toISOString();

export const EXTRA_SOURCES = [
  { number: 21, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 288 BGB: Verzugszinsen und sonstiger Verzugsschaden", url: "https://www.gesetze-im-internet.de/bgb/__288.html", type: "behoerde" },
  { number: 22, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 286 BGB: Verzug des Schuldners", url: "https://www.gesetze-im-internet.de/bgb/__286.html", type: "behoerde" },
  { number: 23, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 3 BUrlG: Dauer des Urlaubs", url: "https://www.gesetze-im-internet.de/burlg/__3.html", type: "behoerde" },
  { number: 24, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 2 NachwG: Nachweispflicht", url: "https://www.gesetze-im-internet.de/nachwg/__2.html", type: "behoerde" },
  { number: 25, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 28a SGB IV: Meldepflicht", url: "https://www.gesetze-im-internet.de/sgb_4/__28a.html", type: "behoerde" },
  { number: 26, publisher: "Amt für Veröffentlichungen der EU (EUR-Lex)", title: "Verordnung (EU) 2016/679 (DSGVO), Art. 28 Auftragsverarbeiter", url: "https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:32016R0679", type: "behoerde" },
  { number: 27, publisher: "ifo Institut", title: "Bürokratie in Deutschland kostet jährlich 146 Milliarden Euro an Wirtschaftsleistung (14.11.2024)", url: "https://www.ifo.de/pressemitteilung/2024-11-14/buerokratie-deutschland-kostet-jaehrlich-146-milliarden-euro", type: "studie" },
  { number: 28, publisher: "RSM Ebner Stolz", title: "Handlungsbedarf E-Rechnung bei Mehrheit der Unternehmen (08.07.2026)", url: "https://www.ebnerstolz.de/de/unser-angebot/leistungen/steuerberatung/umsatzsteuer/handlungsbedarf-e-rechnung-bei-mehrheit-der-unternehmen-109084.html", type: "presse" },
  { number: 29, publisher: "Sage GmbH (Anbieterblog)", title: "E-Rechnung Pflicht 2027: Take-aways vom E-Rechnungsgipfel 2026 (14.07.2026)", url: "https://www.sage.com/de-de/blog/e-rechnung-pflicht-2027/", type: "anbieter" },
  { number: 30, publisher: "Statistisches Bundesamt (Destatis)", title: "Unternehmen mit Nutzung von KI nach Beschäftigtengrößenklassen 2025", url: "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/IKT-in-Unternehmen-IKT-Branche/Tabellen/ikti-unternehmen-kuenstliche-intelligenz.html", type: "behoerde" },
  { number: 31, publisher: "Statistisches Bundesamt (Destatis)", title: "Pressemitteilung Nr. 444: Jedes fünfte Unternehmen nutzt künstliche Intelligenz (25.11.2024)", url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/2024/11/PD24_444_52911.html", type: "behoerde" },
  { number: 32, publisher: "Statistisches Bundesamt (Destatis)", title: "Pressemitteilung Nr. 416: Jedes zweite Unternehmen nutzt kostenpflichtige Cloud-Services (24.11.2025)", url: "https://www.destatis.de/DE/Presse/Pressemitteilungen/2025/11/PD25_416_52911.html", type: "behoerde" },
  { number: 33, publisher: "Statistisches Bundesamt (Destatis)", title: "Anteile kleiner und mittlerer Unternehmen an ausgewählten Merkmalen 2024", url: "https://www.destatis.de/DE/Themen/Branchen-Unternehmen/Unternehmen/Kleine-Unternehmen-Mittlere-Unternehmen/Tabellen/wirtschaftsabschnitte-insgesamt.html", type: "behoerde" },
  { number: 34, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 3 ArbZG: Arbeitszeit der Arbeitnehmer", url: "https://www.gesetze-im-internet.de/arbzg/__3.html", type: "behoerde" },
  { number: 35, publisher: "Bundesministerium der Justiz (gesetze-im-internet.de)", title: "§ 16 ArbZG: Aushang und Arbeitszeitnachweise", url: "https://www.gesetze-im-internet.de/arbzg/__16.html", type: "behoerde" },
];

export type Article = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  readingMinutes: number;
  lead: string;
  sourceNumbers: number[];
  seed: number;
  hasAffiliate: boolean;
  takeaways: string[];
  faqs: { q: string; a: string }[];
  body: (ctx: { sw: (slug: string) => Promise<any> }) => Promise<any[]>;
};

export async function ensureSources(payload: Payload) {
  for (const s of EXTRA_SOURCES) {
    const found = await payload.find({ collection: "sources", where: { number: { equals: s.number } }, limit: 1, depth: 0 });
    if (!found.docs.length) await payload.create({ collection: "sources", data: { ...s, type: s.type as never, accessedAt: day(TODAY) } });
  }
}

export async function loadArticles(payload: Payload, articles: Article[]) {
  const first = async (collection: any, where: any) => (await payload.find({ collection, where, limit: 1, depth: 0 })).docs[0] as any;
  const sw = async (slug: string) => (await first("software", { slug: { equals: slug } })).id;
  for (const a of articles) {
    if (await first("beitraege", { slug: { equals: a.slug } })) {
      console.log("exists:", a.slug);
      continue;
    }
    const cat = await first("categories", { slug: { equals: a.category } });
    const sources = [];
    for (const n of a.sourceNumbers) {
      const s = await first("sources", { number: { equals: n } });
      if (!s) throw new Error(`source ${n} missing`);
      sources.push(s.id);
    }
    await payload.create({
      collection: "beitraege",
      draft: false,
      data: {
        _status: "published",
        title: a.title,
        slug: a.slug,
        kind: "magazin",
        category: cat.id,
        lead: a.lead,
        takeaways: a.takeaways.map((text) => ({ text })),
        body: doc(await a.body({ sw })) as never,
        faqs: a.faqs,
        sources: sources as never,
        lastVerifiedAt: day(TODAY),
        legalDisclaimer: true,
        hasAffiliate: a.hasAffiliate,
        seoTitle: a.seoTitle,
        description: a.description,
        readingMinutes: a.readingMinutes,
        coverSeed: a.seed,
        publishedAt: day(TODAY),
      },
    });
    console.log("created:", a.slug);
  }
}
