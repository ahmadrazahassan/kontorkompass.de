import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/content/PageShell";
import { GuideCard, SoftwareTable } from "@/components/content/Blocks";
import { getCategories, getCategory, getDocs, getSoftwareList } from "@/lib/cms";
import { Button } from "@/components/ui/Button";

type Props = { params: Promise<{ kategorie: string }> };

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ kategorie: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { kategorie } = await params;
  const c = await getCategory(kategorie);
  if (!c) return {};
  return { title: `${c.name}: Ratgeber & Software`, description: c.intro, alternates: { canonical: `/ratgeber/kategorie/${c.slug}` } };
}

export default async function Page({ params }: Props) {
  const { kategorie } = await params;
  const c = await getCategory(kategorie);
  if (!c) notFound();
  const docs = (await getDocs()).filter((d) => d.category === c.slug);
  const software = (await getSoftwareList()).filter((s) => s.categories.includes(c.slug));
  return (
    <>
      <PageHeader title={c.name} lead={c.intro} eyebrow="Themenwelt" crumbs={[{ label: "Ratgeber", href: "/ratgeber" }, { label: c.name }]} />
      <div className="container-page border-t border-line py-12">
        {docs.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {docs.map((d) => (
              <GuideCard key={d.slug} doc={d} />
            ))}
          </div>
        ) : (
          <div className="max-w-xl">
            <p className="t-h3">Für dieses Thema erarbeiten wir derzeit unsere ersten Ratgeber.</p>
            <p className="mt-3 text-ink-700">Über unseren Newsletter erfahren Sie, sobald sie erscheinen.</p>
            <div className="mt-6">
              <Button href="/newsletter" variant="ink" size="sm">
                Newsletter abonnieren
              </Button>
            </div>
          </div>
        )}
      </div>
      {software.length > 0 && (
        <section className="section border-t border-line">
          <div className="container-page">
            <h2 className="t-h2">Software in dieser Themenwelt</h2>
            <div className="mt-8">
              <SoftwareTable items={software} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
