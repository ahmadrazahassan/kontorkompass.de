import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageShell";
import { getDocs, getGlossary, getSoftwareList } from "@/lib/cms";

export const metadata: Metadata = { title: "Suche", robots: { index: false, follow: true } };

type Hit = { href: string; title: string; kind: string; text: string };

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const [DOCS, SOFTWARE, GLOSSARY] = await Promise.all([getDocs(), getSoftwareList(), getGlossary()]);
  const query = q.trim().toLowerCase();
  const all: Hit[] = [
    ...DOCS.map((d) => ({ href: `/${d.kind}/${d.slug}`, title: d.title, kind: d.kind === "ratgeber" ? "Ratgeber" : "Magazin", text: `${d.description} ${d.lead}` })),
    ...SOFTWARE.map((s) => ({ href: `/software/${s.slug}`, title: s.name, kind: "Software", text: s.summary })),
    ...GLOSSARY.map((t) => ({ href: `/glossar/${t.slug}`, title: t.term, kind: "Glossar", text: t.short })),
  ];
  const hits = query ? all.filter((h) => `${h.title} ${h.text}`.toLowerCase().includes(query)) : [];

  return (
    <>
      <PageHeader title="Suche" crumbs={[{ label: "Suche" }]} />
      <div className="container-page border-t border-line pb-24 pt-10">
        <form action="/suche" role="search" className="flex max-w-xl gap-3">
          <label htmlFor="q" className="sr-only">Suchbegriff</label>
          <input id="q" name="q" defaultValue={q} placeholder="Wonach suchen Sie? Zum Beispiel: E-Rechnung" className="h-12 flex-1 border border-line px-4 text-[16px]" style={{ borderRadius: 6 }} />
          <button className="btn btn-primary btn-md" type="submit">
            <span className="btn-label" data-text="Suchen"><span>Suchen</span></span>
          </button>
        </form>
        <div className="mt-10 max-w-3xl">
          {query && hits.length === 0 && <p className="text-ink-700">Keine Treffer für „{q}“. Versuchen Sie einen allgemeineren Begriff.</p>}
          <ul className="divide-y divide-line">
            {hits.map((h) => (
              <li key={h.href} className="py-5">
                <p className="t-eyebrow">{h.kind}</p>
                <Link href={h.href} className="t-h3 mt-1 block no-underline hover:text-brand-500">{h.title}</Link>
                <p className="mt-1 line-clamp-2 text-ink-700">{h.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
