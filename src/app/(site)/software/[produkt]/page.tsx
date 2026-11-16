import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Minus, Question, CircleHalf, X } from "@phosphor-icons/react/dist/ssr";
import { AffiliateDisclosure, Breadcrumbs, SourcesList, StandStamp } from "@/components/content/Blocks";
import { Kostenrechner } from "@/components/content/Kostenrechner";
import { RichBody } from "@/components/content/RichBody";
import { BarChart, DonutChart, LineChart } from "@/components/charts/Charts";
import { Button } from "@/components/ui/Button";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { AffiliateBadge, AffiliateLinkNote } from "@/components/ui/Affiliate";
import { getSoftware, getSoftwareList } from "@/lib/cms";
import { formatEur, formatMonthYear } from "@/lib/format";
import { DEFAULT_OG_IMAGE, SITE } from "@/lib/site";
import { SCENARIO_POINTS, VAT, basisLabel, checkScore, criteriaLabel, firstYearCost, formatPoints, planCost, pricedPlans } from "@/lib/pricing";
import type { Check as CheckT, Software } from "@/content/data";

type Props = { params: Promise<{ produkt: string }> };

export async function generateStaticParams() {
  return (await getSoftwareList()).map((s) => ({ produkt: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { produkt } = await params;
  const s = await getSoftware(produkt);
  if (!s) return {};
  const title = `${s.name}: Preise, Kosten & Funktionen im Überblick`;
  const description = `${s.name} im Überblick: alle Tarife${s.entryPrice ? ` ab ${formatEur(s.entryPrice)} zzgl. MwSt.` : ""}, Kostenanalyse nach Teamgröße, Prüfkriterien, Stärken, Grenzen und Alternativen.`;
  return {
    title,
    description,
    alternates: { canonical: `/software/${s.slug}` },
    openGraph: { type: "website", locale: "de_DE", siteName: SITE.name, title, description, url: `/software/${s.slug}`, images: [DEFAULT_OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [SITE.shareImage] },
  };
}

const STATUS: Record<CheckT["status"], { label: string; color: string; Icon: typeof Check }> = {
  yes: { label: "erfüllt", color: "#13795B", Icon: Check },
  partial: { label: "teilweise", color: "#B25E09", Icon: CircleHalf },
  no: { label: "nicht enthalten", color: "#C4314B", Icon: X },
  unknown: { label: "nicht öffentlich angegeben", color: "#6B7383", Icon: Question },
  na: { label: "nicht relevant", color: "#ADB3BD", Icon: Minus },
};

const NAV = [
  ["eindruck", "Eindruck"],
  ["profil", "Profil"],
  ["preise", "Preise"],
  ["kosten", "Kostenanalyse"],
  ["kriterien", "Prüfkriterien"],
  ["eignung", "Für wen"],
  ["alternativen", "Alternativen"],
] as const;

export default async function Page({ params }: Props) {
  const { produkt } = await params;
  const s = await getSoftware(produkt);
  if (!s) notFound();
  const ALL = await getSoftwareList();
  const basis = s.scenarioBasis ?? "users";
  const plans = pricedPlans(s);
  const score = s.checks?.length ? checkScore(s.checks) : null;
  const alternatives = s.alternatives.map((a) => ALL.find((x) => x.slug === a)).filter(Boolean) as Software[];
  const unitWord = basisLabel(basis);
  const scenarioRows = [1, 5, 10, 25];

  // Reference scenario for the cost breakdown: 10 people on the richest plan that has extra components
  const refN = 10;
  const refPlan =
    [...plans].reverse().find((p) => {
      const c = planCost(p, refN, basis);
      return c && [c.extraUsers, c.extraEmployees, c.minimumTopUp].some((v) => v > 0);
    }) ?? null;
  const refCost = refPlan ? planCost(refPlan, refN, basis) : null;

  const ld = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: s.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "de-DE",
    offers: plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.monthlyNet,
      priceCurrency: "EUR",
      priceSpecification: { "@type": "UnitPriceSpecification", price: p.monthlyNet, priceCurrency: "EUR", valueAddedTaxIncluded: false, unitText: "MONTH" },
    })),
    url: `${SITE.url}/software/${s.slug}`,
  };

  const cta = (cls = "") => (
    <Button href={`/go/${s.affiliateSlug}`} variant="primary" affiliate={s.isAffiliate} external={!s.isAffiliate} arrow className={cls}>
      {s.ctaLabel}
    </Button>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />

      {/* Header */}
      <div className="container-page pt-8 lg:pt-12">
        <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Software", href: "/software" }, { label: s.name }]} />
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <PartnerLogo slug={s.slug} height={30} maxWidth={170} />
              {s.isAffiliate && <AffiliateBadge />}
            </div>
            <p className="t-eyebrow mt-6">Software-Profil · {s.vendor}</p>
            <h1 className="t-h1 mt-3">{s.name}: Preise, Kosten und Funktionen im Überblick</h1>
            <p className="t-lead mt-5 max-w-[62ch]">{s.summary}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {cta()}
              <Button href="#kosten" variant="outline">
                Kosten berechnen
              </Button>
            </div>
            {/* Short form: the full Werbelink notice (AffiliateDisclosure) follows right below the header. */}
            {s.isAffiliate && <AffiliateLinkNote className="mt-3" />}
          </div>
          {score && (
            <div className="panel p-6">
              <p className="t-eyebrow">Prüfkriterien</p>
              <p className="mt-3 flex items-baseline gap-2">
                <span className="t-stat !text-[56px] text-brand-700">{formatPoints(score.points)}</span>
                <span className="font-data text-[18px] text-ink-500">/ {score.total} Kriterien erfüllt</span>
              </p>
              <div className="mt-3 flex h-2 overflow-hidden bg-surface-2" style={{ borderRadius: 4 }} aria-hidden>
                <span style={{ width: `${(score.yes / score.total) * 100}%`, background: STATUS.yes.color }} />
                <span style={{ width: `${(score.partial / score.total) * 100}%`, background: STATUS.partial.color }} />
                <span style={{ width: `${(score.no / score.total) * 100}%`, background: STATUS.no.color }} />
              </div>
              <p className="mt-3 text-[14px] text-ink-700">
                {[
                  `${score.yes} erfüllt`,
                  score.partial ? `${score.partial} teilweise (zählen halb)` : "",
                  score.no ? `${score.no} nicht enthalten` : "",
                  score.unknown ? `${score.unknown} nicht öffentlich angegeben` : "",
                ]
                  .filter(Boolean)
                  .join(", ")}
                . Kein Gesamturteil über die Software.{" "}
                <a href="#kriterien">Details</a>
              </p>
              <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4 text-[14px]">
                <div>
                  <dt className="text-ink-500">Einstieg</dt>
                  <dd className="font-medium">{s.entryPrice == null ? "auf Anfrage" : s.entryPrice === 0 ? "kostenlos" : `ab ${formatEur(s.entryPrice)}`}</dd>
                </div>
                <div>
                  <dt className="text-ink-500">Testphase</dt>
                  <dd className="font-medium">{s.trial}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
        {s.isAffiliate && (
          <div className="mt-8 max-w-3xl">
            <AffiliateDisclosure />
          </div>
        )}
        <nav aria-label="Abschnitte" className="sticky top-16 z-30 -mx-4 mt-10 overflow-x-auto border-y border-line bg-white/95 px-4 backdrop-blur md:top-[72px]">
          <ul className="flex gap-6 whitespace-nowrap py-3 text-[14px] font-medium">
            {NAV.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} className="text-ink-700 no-underline hover:text-brand-500">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-page pb-24 pt-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-16">
            {/* Verdict */}
            <section id="eindruck" aria-labelledby="eindruck-h" className="scroll-mt-36">
              <div className="rounded-[12px] border-l-[3px] border-brand-500 bg-surface-1 p-6">
                <h2 id="eindruck-h" className="t-h3">Unser Eindruck in Kürze</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-700">{s.verdict ?? s.summary}</p>
              </div>
              <div className="table-wrap mt-8">
                <table className="data-table kv">
                  <caption className="sr-only">{s.name} auf einen Blick</caption>
                  <tbody>
                    {s.facts.map(([k, v]) => (
                      <tr key={k}>
                        <th scope="row" className="w-[34%] !bg-transparent !normal-case !tracking-normal !text-[15px] text-ink-950" style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}>
                          {k}
                        </th>
                        <td>{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Review */}
            {s.review ? (
              <section id="profil" aria-label="Profil" className="scroll-mt-36">
                <div className="prose-de">
                  <RichBody data={s.review as never} />
                </div>
              </section>
            ) : null}

            {/* Prices */}
            <section id="preise" aria-labelledby="preise-h" className="scroll-mt-36">
              <h2 id="preise-h" className="t-h2">Alle Tarife und Preise im Detail</h2>
              <p className="mt-2 text-ink-700">
                Reguläre Preise laut Anbieter, in Euro zzgl. 19 % MwSt. Brutto-Werte sind von uns berechnet.
                {s.verified ? ` Preise geprüft: ${formatMonthYear(s.verified)}.` : ""}
              </p>
              <div className="table-wrap mt-6">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th scope="col">Tarif</th>
                      <th scope="col">Netto / Monat</th>
                      <th scope="col">Brutto / Monat</th>
                      <th scope="col">Bei Jahreszahlung</th>
                      <th scope="col">Abrechnung und Inhalt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.plans.map((p) => (
                      <tr key={p.name}>
                        <th scope="row" className="!bg-transparent !normal-case !tracking-normal !text-[16px] text-ink-950" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                          {p.name}
                        </th>
                        <td className="whitespace-nowrap">
                          {p.monthlyNet == null ? "auf Anfrage" : formatEur(p.monthlyNet)}
                          {p.unit === "perUser" && <span className="block text-[13px] text-ink-500">pro Nutzer</span>}
                          {p.unit === "perEmployee" && <span className="block text-[13px] text-ink-500">pro Beschäftigte</span>}
                        </td>
                        <td className="whitespace-nowrap">{p.monthlyNet == null ? "–" : formatEur(Math.round(p.monthlyNet * (1 + VAT) * 100) / 100)}</td>
                        <td className="whitespace-nowrap">{p.annualMonthly != null ? `${formatEur(p.annualMonthly)} / Monat` : "–"}</td>
                        <td>
                          <span className="block">{p.billing}</span>
                          <span className="mt-1 block text-[14px] text-ink-500">{p.includes}</span>
                          {p.promo && <span className="mt-1 block text-[13px] text-brand-700">{p.promo}</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {s.priceNote && <p className="mt-3 text-[14px] text-ink-500">{s.priceNote}</p>}

              {plans.length > 0 && (
                <BarChart
                  title="Tarife im Preisvergleich"
                  takeaway="Regulärer Monatspreis netto je Tarif, dazu der Preis bei Jahreszahlung und ein laufender Aktionspreis, soweit der Anbieter sie nennt."
                  source={`${s.vendor}, Preisangaben des Anbieters`}
                  categories={plans.map((p) => p.name)}
                  series={[
                    { name: "Regulär (monatlich)", values: plans.map((p) => p.monthlyNet) },
                    ...(plans.some((p) => p.annualMonthly != null) ? [{ name: "Bei Jahreszahlung", values: plans.map((p) => p.annualMonthly ?? null) }] : []),
                    ...(plans.some((p) => p.promoMonthly != null) ? [{ name: "Aktionspreis", values: plans.map((p) => p.promoMonthly ?? null) }] : []),
                  ]}
                />
              )}
            </section>

            {/* Cost analysis */}
            <section id="kosten" aria-labelledby="kosten-h" className="scroll-mt-36">
              <h2 id="kosten-h" className="t-h2">Kostenanalyse: Was zahlen Sie wirklich?</h2>
              <p className="mt-2 max-w-[66ch] text-ink-700">
                {basis === "none"
                  ? "Die Tarife haben laut Preisseite einen festen Monatspreis. Zusatzkosten je Nutzende nennt der Anbieter dort nicht."
                  : `Die Kosten steigen mit der Zahl der ${unitWord}. Unsere Berechnung nutzt ausschließlich die veröffentlichten Preisbestandteile: Grundpreis, inklusive ${unitWord}, Aufpreise und Mindestbeträge.`}
              </p>

              {basis !== "none" && plans.length > 0 && (
                <>
                  <LineChart
                    title={`Monatliche Kosten nach Anzahl ${unitWord}`}
                    takeaway="Netto pro Monat bei regulären Preisen. Jede Linie ist ein Tarif."
                    source={`${s.vendor}, Preisangaben; eigene Berechnung`}
                    xLabel={`Anzahl ${unitWord}`}
                    xs={SCENARIO_POINTS}
                    series={plans.map((p) => ({ name: p.name, values: SCENARIO_POINTS.map((n) => planCost(p, n, basis)?.total ?? null) }))}
                  />
                  <div className="table-wrap">
                    <table className="data-table">
                      <caption className="sr-only">Kostenbeispiele</caption>
                      <thead>
                        <tr>
                          <th scope="col">Tarif</th>
                          {scenarioRows.map((n) => (
                            <th key={n} scope="col">
                              {n} {basisLabel(basis, n)}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {plans.map((p) => (
                          <tr key={p.name}>
                            <th scope="row" className="!bg-transparent !normal-case !tracking-normal !text-[15px] text-ink-950" style={{ fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                              {p.name}
                            </th>
                            {scenarioRows.map((n) => {
                              const c = planCost(p, n, basis);
                              const y = firstYearCost(p, n, basis);
                              return (
                                <td key={n} className="whitespace-nowrap">
                                  {c ? formatEur(c.total) : "–"}
                                  <span className="block text-[12px] text-ink-500">{c ? `${formatEur(Math.round(c.total * 12 * 100) / 100)} / Jahr` : ""}</span>
                                  {y != null && c && y !== Math.round(c.total * 12 * 100) / 100 && (
                                    <span className="block text-[12px] text-brand-700">1. Jahr mit Aktion: {formatEur(y)}</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-[13px] text-ink-500">Netto pro Monat, darunter Jahressumme. Eigene Berechnung aus den Anbieterpreisen, ohne weitere Zusatzmodule.</p>
                </>
              )}

              {refPlan && refCost && (
                <DonutChart
                  title={`Kostenaufteilung: ${refPlan.name} mit ${refN} ${basisLabel(basis, refN)}`}
                  takeaway={`So setzt sich der Monatspreis von ${formatEur(refCost.total)} netto zusammen.`}
                  source={`${s.vendor}, Preisangaben; eigene Berechnung`}
                  center={formatEur(refCost.total)}
                  centerSub="pro Monat"
                  slices={[
                    { label: "Grundpreis", value: refCost.base, color: "#006BFF" },
                    { label: "Weitere Nutzende", value: refCost.extraUsers, color: "#004796" },
                    { label: "Weitere Beschäftigte", value: refCost.extraEmployees, color: "#7AB3FF" },
                    { label: "Aufschlag bis Mindestbetrag", value: refCost.minimumTopUp, color: "#0AE8F0" },
                  ]}
                />
              )}

              {s.slug === "sage-active" && <Kostenrechner />}
            </section>

            {/* Criteria */}
            {score && s.checks && (
              <section id="kriterien" aria-labelledby="kriterien-h" className="scroll-mt-36">
                <h2 id="kriterien-h" className="t-h2">Prüfkriterien im Detail</h2>
                <p className="mt-2 max-w-[66ch] text-ink-700">
                  Wir prüfen jede Software anhand derselben Kriterien und werten nur öffentlich belegte Angaben aus. „Nicht öffentlich angegeben“ heißt nicht, dass eine
                  Funktion fehlt, sondern dass wir sie nicht belegen konnten. <Link href="/methodik">Zur Methodik</Link>
                </p>
                <DonutChart
                  title="Ergebnis der Prüfkriterien"
                  takeaway={`${criteriaLabel(score)}: erfüllt zählt voll, teilweise zur Hälfte. ${score.unknown ? `${score.unknown} nicht öffentlich angegeben.` : ""}`.trim()}
                  source="Eigene Auswertung der Anbieterangaben"
                  center={formatPoints(score.points)}
                  centerSub={`von ${score.total}`}
                  valueFormat={(v) => `${v} ${v === 1 ? "Kriterium" : "Kriterien"}`}
                  slices={[
                    { label: "erfüllt", value: score.yes, color: STATUS.yes.color },
                    { label: "teilweise", value: score.partial, color: STATUS.partial.color },
                    { label: "nicht enthalten", value: score.no, color: STATUS.no.color },
                    { label: "nicht öffentlich angegeben", value: score.unknown, color: "#C5CBD3" },
                  ]}
                />
                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">Kriterium</th>
                        <th scope="col">Ergebnis</th>
                        <th scope="col">Beleg</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.checks.map((c) => {
                        const st = STATUS[c.status];
                        return (
                          <tr key={c.criterion}>
                            <td className="font-medium">{c.criterion}</td>
                            <td className="whitespace-nowrap">
                              <span className="inline-flex items-center gap-1.5" style={{ color: st.color }}>
                                <st.Icon size={18} weight="bold" aria-hidden />
                                {st.label}
                              </span>
                            </td>
                            <td className="text-[14px] text-ink-700">{c.note ?? ""}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Fit */}
            <section id="eignung" aria-labelledby="eignung-h" className="scroll-mt-36 grid gap-8 md:grid-cols-2">
              <div className="rounded-[12px] border border-line p-6">
                <h2 id="eignung-h" className="t-h3 flex items-center gap-2">
                  <Check size={22} weight="bold" className="text-success" aria-hidden /> Geeignet für
                </h2>
                <ul className="mt-4 list-[square] space-y-2 pl-5 text-ink-700 marker:text-success">
                  {s.fits.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[12px] border border-line p-6">
                <h2 className="t-h3 flex items-center gap-2">
                  <X size={22} weight="bold" className="text-danger" aria-hidden /> Weniger geeignet für
                </h2>
                <ul className="mt-4 list-[square] space-y-2 pl-5 text-ink-700 marker:text-danger">
                  {s.notFits.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Alternatives */}
            <section id="alternativen" aria-labelledby="alt-h" className="scroll-mt-36">
              <h2 id="alt-h" className="t-h2">Alternativen</h2>
              {alternatives.length > 0 && (
                <BarChart
                  title="Einstiegspreis im Vergleich"
                  takeaway="Günstigster bezahlter Tarif laut Anbieter, netto pro Monat. Die Preismodelle unterscheiden sich (pauschal, pro Nutzer, pro Beschäftigte)."
                  source="Preisangaben der Anbieter; eigene Darstellung"
                  categories={[s, ...alternatives].map((x) => x.name)}
                  series={[{ name: "Einstiegspreis", values: [s, ...alternatives].map((x) => (x.entryPrice && x.entryPrice > 0 ? x.entryPrice : x.plans.find((p) => (p.monthlyNet ?? 0) > 0)?.monthlyNet ?? null)) }]}
                />
              )}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {alternatives.map((a) => (
                  <Link key={a.slug} href={`/software/${a.slug}`} className="card flex flex-col gap-4 border border-line p-5 no-underline hover:border-brand-500" style={{ borderRadius: 12 }}>
                    <span className="flex min-h-6 flex-wrap items-center justify-between gap-3">
                      <PartnerLogo slug={a.slug} height={22} maxWidth={130} tile={false} />
                      {a.isAffiliate && <AffiliateBadge />}
                    </span>
                    <span>
                      <span className="card-title t-h3 block !text-[19px]">{a.name}</span>
                      <span className="mt-1 block text-[14px] text-ink-700">{a.summary}</span>
                    </span>
                    <span className="link-arrow mt-auto">Zum Software-Profil →</span>
                  </Link>
                ))}
              </div>
              {alternatives.length > 0 && (
                <div className="mt-6 flex flex-col gap-4 bg-ink-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between" style={{ borderRadius: 14 }}>
                  <p>
                    <span className="block font-display text-[19px] font-semibold">{s.name} direkt vergleichen</span>
                    <span className="mt-1 block text-[14.5px] text-white/70">Preise, Kosten nach Teamgröße und alle zehn Kriterien nebeneinander.</span>
                  </p>
                  <Button href={`/software/vergleich?p=${[s, ...alternatives].slice(0, 3).map((x) => x.slug).join(",")}`} variant="light" arrow>
                    {`Mit ${alternatives.slice(0, 2).map((x) => x.name).join(" und ")} vergleichen`}
                  </Button>
                </div>
              )}
            </section>

            <SourcesList ids={s.sourceIds} />
            <StandStamp date={s.verified} />
          </div>

          {/* Sticky aside */}
          <aside className="hidden lg:block">
            <div className="sticky top-36 space-y-4">
              <div className="panel p-6">
                <PartnerLogo slug={s.slug} height={22} maxWidth={130} tile={false} />
                {s.isAffiliate && <AffiliateBadge className="mt-4" />}
                <p className="t-h3 mt-4 !text-[19px]">{s.name}</p>
                <dl className="mt-4 space-y-3 text-[15px]">
                  <div>
                    <dt className="text-ink-500">Anbieter</dt>
                    <dd className="font-medium">{s.vendor}</dd>
                  </div>
                  <div>
                    <dt className="text-ink-500">Einstieg</dt>
                    <dd className="font-medium">
                      {s.entryPrice == null ? "auf Anfrage" : s.entryPrice === 0 ? "kostenloser Tarif" : `ab ${formatEur(s.entryPrice)} zzgl. MwSt.`}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-ink-500">Testphase</dt>
                    <dd className="font-medium">{s.trial}</dd>
                  </div>
                </dl>
                <div className="mt-6">{cta("w-full")}</div>
                {s.isAffiliate && <AffiliateLinkNote className="mt-3" />}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
