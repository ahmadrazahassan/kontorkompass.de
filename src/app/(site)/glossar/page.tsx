import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageShell";
import { getGlossary } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Glossar",
  description: "Fachbegriffe rund um E-Rechnung, Buchhaltung und Business-Software kurz und präzise erklärt.",
  alternates: { canonical: "/glossar" },
};

export default async function Page() {
  const sorted = [...(await getGlossary())].sort((a, b) => a.term.localeCompare(b.term, "de"));
  const letters = [...new Set(sorted.map((t) => t.term[0].toUpperCase()))];
  return (
    <>
      <PageHeader title="Glossar" lead="Fachbegriffe kurz und präzise erklärt, mit Quellen." eyebrow="Wissen" crumbs={[{ label: "Glossar" }]} />
      <div className="container-page border-t border-line pb-24 pt-10">
        <nav aria-label="Alphabet" className="flex flex-wrap gap-2">
          {letters.map((l) => (
            <a key={l} href={`#${l}`} className="inline-flex h-10 w-10 items-center justify-center border border-ink-950/20 font-data no-underline hover:border-brand-500" style={{ borderRadius: 4 }}>
              {l}
            </a>
          ))}
        </nav>
        <div className="mt-10">
          {letters.map((l) => (
            <section key={l} id={l} className="grid gap-4 border-t border-line py-8 md:grid-cols-[120px_1fr]">
              <h2 className="t-stat !text-[48px] text-brand-500">{l}</h2>
              <ul className="space-y-6">
                {sorted
                  .filter((t) => t.term[0].toUpperCase() === l)
                  .map((t) => (
                    <li key={t.slug}>
                      <Link href={`/glossar/${t.slug}`} className="t-h3 no-underline hover:text-brand-500">
                        {t.term}
                      </Link>
                      <p className="mt-1 max-w-[64ch] text-ink-700">{t.short}</p>
                    </li>
                  ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
