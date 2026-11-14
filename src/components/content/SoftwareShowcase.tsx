import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Check, Software } from "@/content/data";
import { getCategories } from "@/lib/cms";
import { formatDateShort, formatEur } from "@/lib/format";
import { checkScore } from "@/lib/pricing";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { Button } from "@/components/ui/Button";

/* ---------- helpers ---------- */
const MAX = 200; // right end of the price scale in € per month
const TICKS = [0, 10, 25, 50, 100, 200];
// Log scale, so 7,90 € and 56 € are both readable on one axis.
const pos = (p: number) => Math.log10(1 + Math.min(p, MAX)) / Math.log10(1 + MAX);

const UNIT: Record<string, string> = { perUser: "je Nutzer", perEmployee: "je Mitarbeitende", flat: "pauschal" };

const STATUS: Record<Check["status"], { color: string; label: string }> = {
  yes: { color: "#006BFF", label: "erfüllt" },
  partial: { color: "#7AB3FF", label: "teilweise" },
  no: { color: "#3D4656", label: "nicht erfüllt" },
  unknown: { color: "#E3E6EB", label: "nicht belegt" },
  na: { color: "transparent", label: "nicht relevant" },
};

function entry(s: Software) {
  const priced = s.plans.filter((p) => typeof p.monthlyNet === "number") as (Software["plans"][number] & { monthlyNet: number })[];
  const plan = priced.find((p) => p.monthlyNet === s.entryPrice) ?? priced[0];
  const prices = priced.map((p) => p.monthlyNet);
  return {
    unit: plan?.unit ? UNIT[plan.unit] : "",
    min: prices.length ? Math.min(...prices) : null,
    max: prices.length ? Math.max(...prices) : null,
    plans: s.plans.length,
  };
}

/* ---------- section ---------- */
export async function SoftwareShowcase({ items }: { items: Software[] }) {
  const CATEGORIES = await getCategories();
  const catName = (slug?: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? "";
  const verified = items.map((i) => i.verified).sort().reverse()[0];

  const rows = items
    .map((s) => ({ s, e: entry(s), score: s.checks?.length ? checkScore(s.checks) : null }))
    .sort((a, b) => (b.score?.score ?? 0) - (a.score?.score ?? 0));
  const best = rows[0]?.score?.score;

  const axis = items
    .filter((s) => s.entryPrice !== null)
    .map((s) => ({ s, price: s.entryPrice as number, x: pos(s.entryPrice as number), unit: entry(s).unit }))
    .sort((a, b) => a.price - b.price);

  return (
    <section className="section" aria-labelledby="sw-title">
      <div className="container-page">
        {/* Header */}
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <p className="t-eyebrow">Software-Profile</p>
            <h2 id="sw-title" className="t-h1 mt-4 max-w-[18ch]">
              Preise und Prüfkriterien auf einen Blick.
            </h2>
            <p className="t-lead mt-5 max-w-[56ch]">Jedes Produkt prüfen wir anhand derselben zehn Kriterien und rechnen die veröffentlichten Preise nach. Der Kriterienwert zeigt auf einen Blick, wie viele Anforderungen ein Produkt belegbar erfüllt.</p>
          </div>
          <div className="flex flex-col items-start gap-6 lg:items-end">
            <dl className="grid w-full grid-cols-3 border-y border-line lg:max-w-[460px]">
              {[
                [String(items.length), "Software-Profile"],
                ["10", "Kriterien je Produkt"],
                ["€", "Preise netto in Euro"],
              ].map(([v, l], i) => (
                <div key={l} className={`py-4 ${i ? "border-l border-line pl-4" : ""}`}>
                  <dt className="sr-only">{l}</dt>
                  <dd>
                    <span className="block font-data text-[22px] font-medium leading-none">{v}</span>
                    <span className="mt-1.5 block text-[13px] text-ink-500">{l}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              <Button href="/software/finder" variant="ink" arrow>
                Software-Finder starten
              </Button>
              <Button href="/software/vergleich" variant="outline">
                Produkte vergleichen
              </Button>
            </div>
          </div>
        </div>

        {/* Price spectrum */}
        <figure
          className="relative mt-14 overflow-hidden border border-line p-6 sm:p-8"
          style={{
            borderRadius: 20,
            backgroundColor: "#FBFCFD",
            backgroundImage: "linear-gradient(rgb(14 20 32 / 0.045) 1px, transparent 1px), linear-gradient(90deg, rgb(14 20 32 / 0.045) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          <figcaption className="flex flex-wrap items-baseline justify-between gap-3">
            <span className="font-display text-[20px] font-semibold tracking-[-0.01em]">Einstiegspreise im Vergleich</span>
            <span className="font-data text-[12px] uppercase tracking-[0.08em] text-ink-500">€ pro Monat, zzgl. MwSt., log. Skala</span>
          </figcaption>

          {/* Dot plot: one row per product, so labels never collide */}
          <div className="mt-8">
            {axis.map(({ s, price, x, unit }) => {
              const right = x > 0.78;
              return (
                <Link
                  key={s.slug}
                  href={`/software/${s.slug}`}
                  className="group grid grid-cols-[112px_1fr] items-center gap-4 no-underline sm:grid-cols-[170px_1fr]"
                >
                  <span className="truncate py-2.5 text-[14px] font-medium text-ink-950 group-hover:text-brand-700">{s.name}</span>
                  <span className="relative block h-11">
                    {TICKS.map((t) => (
                      <span key={t} aria-hidden className="absolute inset-y-0 w-px bg-ink-950/[0.07]" style={{ left: `${pos(t) * 100}%` }} />
                    ))}
                    <span aria-hidden className="absolute top-1/2 h-px w-full -translate-y-1/2 bg-ink-950/10" />
                    <span
                      aria-hidden
                      className="absolute left-0 top-1/2 h-[6px] -translate-y-1/2 bg-brand-500/20 transition-colors group-hover:bg-brand-500/35"
                      style={{ width: `${x * 100}%`, borderRadius: 1 }}
                    />
                    <span
                      aria-hidden
                      className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 border-2 border-white bg-brand-500 shadow-[0_0_0_1px_#006BFF] transition-transform group-hover:scale-125"
                      style={{ left: `${x * 100}%` }}
                    />
                    <span
                      className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap font-data text-[13px] text-ink-950"
                      style={right ? { right: `${(1 - x) * 100}%`, marginRight: 14 } : { left: `${x * 100}%`, marginLeft: 14 }}
                    >
                      {price === 0 ? "0 €" : formatEur(price)}
                      {unit && price > 0 ? <span className="ml-1.5 hidden text-[11.5px] text-ink-500 sm:inline">{unit}</span> : null}
                    </span>
                  </span>
                </Link>
              );
            })}
            <div className="grid grid-cols-[112px_1fr] gap-4 border-t border-ink-950 pt-2 sm:grid-cols-[170px_1fr]" aria-hidden>
              <span />
              <span className="relative block h-5">
                {TICKS.map((t) => (
                  <span
                    key={t}
                    className={`absolute font-data text-[11.5px] text-ink-500 ${t === 10 || t === 100 ? "hidden sm:inline" : ""}`}
                    style={t === 0 ? { left: 0 } : t === MAX ? { right: 0 } : { left: `${pos(t) * 100}%`, transform: "translateX(-50%)" }}
                  >
                    {t === MAX ? `${t} €` : t}
                  </span>
                ))}
              </span>
            </div>
          </div>
          <p className="mt-6 text-[13px] text-ink-500">Einstiegspreise haben unterschiedliche Preismodelle (pauschal, je Nutzer oder je Mitarbeitende). Gesamtkosten nach Teamgröße zeigt jedes Software-Profil.</p>
        </figure>

        {/* Product cards */}
        <ul className="-mx-4 mt-6 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 xl:grid-cols-4" aria-label="Software-Profile">
          {rows.map(({ s, e, score }) => (
            <li key={s.slug} className="w-[84%] shrink-0 snap-start sm:w-auto">
              <Link
                href={`/software/${s.slug}`}
                className="group relative flex h-full flex-col border border-line bg-white p-6 no-underline transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-brand-500 hover:shadow-[var(--shadow-overlay)]"
                style={{ borderRadius: 14 }}
              >
                <div className="flex h-7 items-center justify-between gap-3">
                  <PartnerLogo slug={s.slug} height={20} maxWidth={100} tile={false} />
                  {score && score.score === best && (
                    <span className="border border-brand-500/30 bg-brand-50 px-2 py-0.5 font-data text-[11px] uppercase tracking-wider text-brand-700" style={{ borderRadius: 4 }}>
                      Höchster Wert
                    </span>
                  )}
                </div>

                <p className="mt-6 font-data text-[11.5px] uppercase tracking-[0.08em] text-ink-500">{catName(s.categories[0])}</p>
                <h3 className="mt-1 font-display text-[22px] font-semibold leading-tight tracking-[-0.015em] group-hover:text-brand-700">{s.name}</h3>

                {/* Criteria */}
                {score && s.checks && (
                  <div className="mt-6">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-data text-[44px] font-medium leading-none tracking-[-0.02em]">{score.score}</span>
                      <span className="font-data text-[15px] text-ink-500">/ 100</span>
                    </div>
                    <p className="mt-1 text-[13px] text-ink-500">
                      {score.yes} von {score.total} Kriterien erfüllt{score.partial ? `, ${score.partial} teilweise` : ""}
                    </p>
                    <div className="mt-3 grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${s.checks.filter((c) => c.status !== "na").length}, 1fr)` }} role="img" aria-label={`Prüfkriterien: ${score.yes} erfüllt, ${score.partial} teilweise, ${score.no} nicht erfüllt, ${score.unknown} nicht belegt`}>
                      {s.checks
                        .filter((c) => c.status !== "na")
                        .map((c) => (
                          <span key={c.criterion} title={`${c.criterion}: ${STATUS[c.status].label}`} className="h-2.5" style={{ background: STATUS[c.status].color, borderRadius: 1 }} />
                        ))}
                    </div>
                  </div>
                )}

                <dl className="mt-6 flex-1 space-y-2.5 border-t border-line pt-5 text-[14px]">
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Einstieg</dt>
                    <dd className="text-right font-medium">
                      {s.entryPrice === null ? "auf Anfrage" : s.entryPrice === 0 ? "kostenlos" : `ab ${formatEur(s.entryPrice)}`}
                      {s.entryPrice ? <span className="block text-[12px] font-normal text-ink-500">{e.unit}</span> : null}
                    </dd>
                  </div>
                  {e.min !== null && e.max !== null && e.max !== e.min && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-500">Spanne</dt>
                      <dd className="font-data">
                        {formatEur(e.min)} – {formatEur(e.max)}
                      </dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-4">
                    <dt className="text-ink-500">Tarife</dt>
                    <dd className="font-data">{e.plans}</dd>
                  </div>
                </dl>

                <span className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[14.5px] font-medium text-brand-700">
                  Zum Software-Profil
                  <ArrowUpRight size={18} aria-hidden className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Legend + note */}
        <div className="mt-6 flex flex-col gap-4 text-[13px] text-ink-500 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {(["yes", "partial", "no", "unknown"] as const).map((k) => (
              <li key={k} className="inline-flex items-center gap-2">
                <span aria-hidden className="inline-block h-2.5 w-5" style={{ background: STATUS[k].color, borderRadius: 1 }} />
                Kriterium {STATUS[k].label}
              </li>
            ))}
          </ul>
          <p>
            Preise laut Anbieter, zzgl. MwSt. Wert: erfüllte Kriterien, teilweise erfüllte zählen zur Hälfte.{" "}
            <Link href="/methodik" className="inline-flex items-center gap-1 text-brand-700 no-underline hover:underline">
              Zur Methodik <ArrowRight size={13} aria-hidden />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
