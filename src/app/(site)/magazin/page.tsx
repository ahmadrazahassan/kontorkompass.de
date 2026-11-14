import type { Metadata } from "next";
import { PageHeader } from "@/components/content/PageShell";
import { GuideCard } from "@/components/content/Blocks";
import { getDocs } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Magazin",
  description: "Analysen, Updates und Praxiswissen rund um Business-Software in Deutschland.",
  alternates: { canonical: "/magazin" },
};

export default async function Page() {
  const items = await getDocs("magazin");
  return (
    <>
      <PageHeader title="Magazin" lead="Analysen, Updates und Praxiswissen rund um Business-Software in Deutschland." eyebrow="Wissen" crumbs={[{ label: "Magazin" }]} />
      <div className="container-page border-t border-line py-12 pb-24">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {items.map((d) => (
            <GuideCard key={d.slug} doc={d} />
          ))}
        </div>
      </div>
    </>
  );
}
