import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Blocks";
import { SoftwareFinder, type FinderItem } from "@/components/software/SoftwareFinder";
import { getSoftwareList } from "@/lib/cms";
import { formatDateShort } from "@/lib/format";

export const metadata: Metadata = {
  title: "Software-Finder: Welche Business-Software passt zu Ihrem Unternehmen?",
  description: "Vier Fragen zu Bereich, Teamgröße, Budget und Anforderungen: Der Software-Finder zeigt passende Lösungen für Buchhaltung, Lohn, HR und ERP mit transparenter Begründung.",
  alternates: { canonical: "/software/finder" },
};

export default async function Page() {
  const SOFTWARE = await getSoftwareList();
  const items: FinderItem[] = SOFTWARE.map(({ slug, name, vendor, categories, plans, scenarioBasis, checks, trial, verdict, isAffiliate }) => ({
    slug,
    name,
    vendor,
    categories,
    plans,
    scenarioBasis,
    checks,
    trial,
    verdict,
    isAffiliate,
  }));
  const verified = SOFTWARE.map((s) => s.verified).sort().reverse()[0];

  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[520px]"
        style={{
          backgroundColor: "#F4F5F7",
          backgroundImage: "linear-gradient(rgb(14 20 32 / 0.04) 1px, transparent 1px), linear-gradient(90deg, rgb(14 20 32 / 0.04) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="container-page pb-24 pt-8 lg:pt-12">
        <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Software", href: "/software" }, { label: "Software-Finder" }]} />
        <div className="mx-auto mt-10 max-w-[880px]">
          <p className="t-eyebrow">Software-Finder</p>
          <h1 className="t-h1 mt-4 max-w-[20ch]">Welche Software passt zu Ihrem Unternehmen?</h1>
          <p className="t-lead mt-5 max-w-[60ch]">
            Vier kurze Fragen. Das Ergebnis basiert auf unseren Software-Profilen: veröffentlichte Preise, Ihre Teamgröße und zehn einheitliche Prüfkriterien. Jede Empfehlung zeigt, warum sie passt.
          </p>
          <div className="mt-10">
            <SoftwareFinder items={items} verified="" />
          </div>
          <p className="mt-8 text-[14px] text-ink-500">
            Lieber selbst vergleichen? <Link href="/software/vergleich" className="text-brand-700">Zum Software-Vergleich</Link> oder <Link href="/software" className="text-brand-700">alle Software-Profile</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
