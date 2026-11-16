import Link from "next/link";
import { getCategories, getSoftwareList } from "@/lib/cms";
import { formatEur } from "@/lib/format";
import { PARTNER_OFFERS } from "@/lib/partners";
import { Button } from "@/components/ui/Button";
import { PartnerLogo, vendorKey } from "@/components/ui/PartnerLogo";
import { AffiliateLinkNote } from "@/components/ui/Affiliate";

/**
 * Advertising block, always labelled "Anzeige" and kept apart from editorial lists.
 * Shows only software whose /go link is an active Werbelink; renders nothing otherwise.
 * It never changes profiles, criteria or the order of editorial lists (see /methodik and /transparenz).
 */
type Opts = { category?: string; limit?: number; exclude?: string };

/** Partner offers that would show for these options (also used to decide whether a page needs the Werbelink notice). */
export async function getPartnerOffers({ category, limit = 4, exclude }: Opts = {}) {
  const all = await getSoftwareList();
  return PARTNER_OFFERS.map((o) => ({ o, s: all.find((x) => x.slug === o.slug) }))
    .filter((x): x is { o: (typeof PARTNER_OFFERS)[number]; s: NonNullable<typeof x.s> } => Boolean(x.s?.isAffiliate && x.s.affiliateSlug))
    .filter(({ s }) => s.slug !== exclude && (!category || s.categories.includes(category)))
    .slice(0, limit);
}

export async function PartnerOffers({ category, limit = 4, exclude, compact = false }: Opts & { compact?: boolean }) {
  const [items, cats] = await Promise.all([getPartnerOffers({ category, limit, exclude }), getCategories()]);
  if (!items.length) return null;
  const catName = (slug?: string) => cats.find((c) => c.slug === slug)?.name ?? "";
  const cols = items.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : items.length === 3 ? "md:grid-cols-3" : items.length === 2 ? "md:grid-cols-2" : "";

  const block = (
    <>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="flex items-center gap-3">
            <span className="border border-ink-950/25 bg-white px-2 py-0.5 font-data text-[11px] uppercase tracking-wider text-ink-950" style={{ borderRadius: 4 }}>
              Anzeige
            </span>
            <span className="t-eyebrow">Partnerangebote</span>
          </p>
          <h2 id={compact ? undefined : "partner-title"} className={compact ? "t-h3 mt-3" : "t-h2 mt-3"}>
            Anbieter, mit denen wir zusammenarbeiten
          </h2>
        </div>
        <p className="max-w-[52ch] text-[14px] leading-relaxed text-ink-700">
          Diese Platzierung ist Werbung. Sie verändert weder unsere Profile noch die Prüfkriterien oder die Reihenfolge redaktioneller Listen.{" "}
          <Link href="/transparenz">So finanzieren wir uns</Link>
        </p>
      </div>

      <ul className={`mt-8 grid grid-cols-1 gap-4 ${cols}`}>
        {items.map(({ o, s }) => (
          <li key={s.slug} className="flex flex-col border border-line bg-white p-6" style={{ borderRadius: 14 }}>
            <div className="flex h-7 items-center justify-between gap-3">
              {vendorKey(s.slug) ? <PartnerLogo slug={s.slug} height={20} maxWidth={100} tile={false} /> : <span />}
              <span className="font-data text-[11px] uppercase tracking-wider text-ink-500">{catName(s.categories[0])}</span>
            </div>
            <h3 className="mt-5 font-display text-[22px] font-semibold leading-tight tracking-[-0.015em]">{s.name}</h3>
            <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-700">{o.pitch}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[14px]">
              <div>
                <dt className="text-ink-500">Einstieg</dt>
                <dd className="font-medium">{s.entryPrice == null ? "auf Anfrage" : s.entryPrice === 0 ? "kostenloser Tarif" : `ab ${formatEur(s.entryPrice)}`}</dd>
              </div>
              <div>
                <dt className="text-ink-500">Testphase</dt>
                <dd className="font-medium">{s.trial}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <Button href={`/go/${s.affiliateSlug}`} variant="primary" affiliate arrow>
                {s.ctaLabel}
              </Button>
              <Link href={`/software/${s.slug}`} className="text-[14.5px] font-medium text-brand-700 no-underline hover:underline">
                Zum Software-Profil
              </Link>
            </div>
            <AffiliateLinkNote className="mt-3" />
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[13px] text-ink-500">
        * Werbelink: Wenn Sie über einen solchen Link einen Vertrag abschließen, erhalten wir gegebenenfalls eine Provision. Für Sie entstehen keine Mehrkosten. Preise laut
        Anbieter, zzgl. MwSt.
      </p>
    </>
  );

  if (compact) {
    return (
      <aside aria-label="Anzeige: Partnerangebote" className="not-prose my-12 rounded-[14px] border border-line bg-surface-1 p-6 sm:p-8">
        {block}
      </aside>
    );
  }
  return (
    <section aria-labelledby="partner-title" className="section border-t border-line bg-surface-1">
      <div className="container-page">{block}</div>
    </section>
  );
}
