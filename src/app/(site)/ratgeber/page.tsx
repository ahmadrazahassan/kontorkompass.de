import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageShell";
import { GuideCard } from "@/components/content/Blocks";
import { Icon } from "@/components/ui/Icons";
import { getDocs, getTopicCategories } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Ratgeber",
  description: "Praxisnahe Leitfäden zu Pflichten, Prozessen und Software, mit Quellen und Rechenbeispielen.",
  alternates: { canonical: "/ratgeber" },
};

export default async function Page() {
  const [CATEGORIES, guides] = await Promise.all([getTopicCategories(), getDocs("ratgeber")]);
  return (
    <>
      <PageHeader title="Ratgeber" lead="Praxisnahe Leitfäden zu Pflichten, Prozessen und Software: mit Quellen, Rechenbeispielen und Checklisten." eyebrow="Wissen" crumbs={[{ label: "Ratgeber" }]} />
      <div className="container-page">
        <div className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/ratgeber/kategorie/${c.slug}`} className="group block border-b border-r border-line p-6 no-underline hover:bg-surface-1">
              <Icon name={c.icon} size={26} className="text-brand-700" />
              <h2 className="t-h3 mt-5 !text-[19px]">{c.name}</h2>
              <p className="mt-1 text-[15px] text-ink-700">{c.description}</p>
            </Link>
          ))}
        </div>
      </div>
      <section className="section">
        <div className="container-page">
          <h2 className="t-h2">Alle Ratgeber</h2>
          <div className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.slug} doc={g} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
