import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowsLeftRight, Compass } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/content/PageShell";
import { AffiliateDisclosure, PriceBars } from "@/components/content/Blocks";
import { CompareBuilder, type CompareItem } from "@/components/software/CompareBuilder";
import { PartnerOffers } from "@/components/content/PartnerOffers";
import { getCategories, getSoftwareList } from "@/lib/cms";
import { formatDateShort, formatEur } from "@/lib/format";
import { checkScore, formatPoints } from "@/lib/pricing";
import { entryUnit } from "@/lib/compare";

export const metadata: Metadata = {
  title: "Business-Software im Überblick: Preise, Kosten und Vergleich",
  description: "Software-Profile zu Buchhaltung, Lohn, HR und ERP mit allen Tarifen in Euro, Kostenanalysen nach Teamgröße, zehn Prüfkriterien, Vergleichsfunktion und Software-Finder.",
  alternates: { canonical: "/software" },
};

export default async function Page() {
  const [SOFTWARE, CATEGORIES] = await Promise.all([getSoftwareList(), getCategories()]);
  const catName = (slug?: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? "";
  const items: CompareItem[] = SOFTWARE.map((s) => ({
    slug: s.slug,
    name: s.name,
    vendor: s.vendor,
    category: catName(s.categories[0]),
    categories: s.categories,
    entry: s.entryPrice == null ? "auf Anfrage" : s.entryPrice === 0 ? "kostenloser Tarif" : `ab ${formatEur(s.entryPrice)}`,
    unit: s.entryPrice ? entryUnit(s) : "",
    ...(() => {
      const c = s.checks?.length ? checkScore(s.checks) : null;
      return { score: c?.score ?? null, points: c ? formatPoints(c.points) : null, total: c?.total ?? null };
    })(),
    trial: s.trial,
    plans: s.plans.length,
    isAffiliate: s.isAffiliate,
  })).sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  const filters = CATEGORIES.filter((c) => SOFTWARE.some((s) => s.categories.includes(c.slug))).map((c) => ({ slug: c.slug, name: c.name }));
  const verified = SOFTWARE.map((s) => s.verified).sort().reverse()[0];

  return (
    <>
      <PageHeader
        title="Business-Software im Überblick."
        lead="Ausführliche Software-Profile mit allen Tarifen in Euro, Kostenanalysen nach Teamgröße und einheitlichen Prüfkriterien. Wählen Sie Produkte zum Vergleich oder lassen Sie sich vom Software-Finder helfen."
        eyebrow="Software"
        crumbs={[{ label: "Software" }]}
      />

      {/* Tools */}
      <div className="container-page grid gap-4 pb-12 md:grid-cols-2">
        <Link href="/software/finder" className="group flex items-start gap-5 bg-brand-700 p-7 text-white no-underline transition-colors hover:bg-brand-800" style={{ borderRadius: 14 }}>
          <Compass size={34} aria-hidden className="shrink-0 text-accent" />
          <span>
            <span className="block font-display text-[22px] font-semibold tracking-[-0.01em]">Software-Finder</span>
            <span className="mt-1 block text-[15px] text-white/75">Vier Fragen zu Bereich, Teamgröße, Budget und Anforderungen. Ergebnis mit Begründung.</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent">
              Finder starten <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
        <Link href="/software/vergleich" className="group flex items-start gap-5 border border-line bg-surface-1 p-7 no-underline transition-colors hover:border-brand-500" style={{ borderRadius: 14 }}>
          <ArrowsLeftRight size={34} aria-hidden className="shrink-0 text-brand-500" />
          <span>
            <span className="block font-display text-[22px] font-semibold tracking-[-0.01em]">Software-Vergleich</span>
            <span className="mt-1 block text-[15px] text-ink-700">Bis zu drei Produkte nebeneinander: Preise, Kosten nach Teamgröße und alle Kriterien.</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-brand-700">
              Vergleich öffnen <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
            </span>
          </span>
        </Link>
      </div>

      <div className="container-page border-t border-line pb-32 pt-10">
        <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <h2 className="t-h2">Alle Software-Profile</h2>
            <p className="mt-2 text-ink-700">Sortiert nach erfüllten Prüfkriterien. Preise laut Anbieter, zzgl. MwSt.</p>
          </div>
          <div className="max-w-xl">
            <AffiliateDisclosure />
          </div>
        </div>
        <CompareBuilder items={items} filters={filters} />
        <PriceBars
          title="Regulärer Einstiegspreis pro Monat (netto)"
          takeaway="Preise sind nur mit Blick auf Funktionsumfang, Nutzer- und Rechnungsmengen vergleichbar. Details stehen in den Software-Profilen."
          source="Anbieterangaben, zzgl. MwSt."
          items={SOFTWARE.filter((s) => s.entryPrice).map((s) => ({ label: s.name, value: s.entryPrice as number }))}
        />
      </div>
      <PartnerOffers />
    </>
  );
}
