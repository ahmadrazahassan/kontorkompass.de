import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/content/PageShell";
import { SourcesList } from "@/components/content/Blocks";
import { getGlossary, getTerm } from "@/lib/cms";

type Props = { params: Promise<{ begriff: string }> };

export async function generateStaticParams() {
  return (await getGlossary()).map((t) => ({ begriff: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { begriff } = await params;
  const t = await getTerm(begriff);
  if (!t) return {};
  return { title: `${t.term}: Definition & Erklärung`, description: t.short, alternates: { canonical: `/glossar/${t.slug}` } };
}

export default async function Page({ params }: Props) {
  const { begriff } = await params;
  const t = await getTerm(begriff);
  if (!t) notFound();
  const related = (await getGlossary()).filter((x) => x.slug !== t.slug).slice(0, 4);
  return (
    <>
      <PageHeader title={t.term} eyebrow="Glossar" crumbs={[{ label: "Glossar", href: "/glossar" }, { label: t.term }]} />
      <div className="container-page border-t border-line pb-24 pt-10">
        <div className="prose-de max-w-[720px]">
          <p className="t-lead !text-ink-950">
            <strong>{t.short}</strong>
          </p>
          {t.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p>
            Mehr dazu im Ratgeber <Link href="/ratgeber/e-rechnung-2027-pflicht-unternehmen">E-Rechnung ab 2027</Link>.
          </p>
          <SourcesList ids={t.sourceIds} />
          <h2 className="t-h3" style={{ marginTop: "2em" }}>Verwandte Begriffe</h2>
          <ul className="!list-none !pl-0 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug} className="!m-0">
                <Link href={`/glossar/${r.slug}`} className="inline-block border border-ink-950/20 px-4 py-2 !text-ink-950 no-underline hover:border-brand-500" style={{ borderRadius: 4 }}>
                  {r.term}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
