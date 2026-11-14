import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowsLeftRight, Check, CircleHalf, Minus, Question, X, Compass } from "@phosphor-icons/react/dist/ssr";
import { Breadcrumbs } from "@/components/content/Blocks";
import { LineChart } from "@/components/charts/Charts";
import { Button } from "@/components/ui/Button";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { getCategories, getSoftwareList } from "@/lib/cms";
import { formatDateShort, formatEur } from "@/lib/format";
import { SCENARIO_POINTS, checkScore } from "@/lib/pricing";
import { BASIS_LABEL, POPULAR_COMPARISONS, cheapestPaid, criteriaOrder, entryUnit, priceRange, statusOf } from "@/lib/compare";
import type { Check as CheckT, Software } from "@/content/data";

type SP = Promise<Record<string, string | string[] | undefined>>;

const ICON: Record<CheckT["status"], { label: string; color: string; Icon: typeof Check }> = {
  yes: { label: "erfüllt", color: "#13795B", Icon: Check },
  partial: { label: "teilweise", color: "#B25E09", Icon: CircleHalf },
  no: { label: "nicht enthalten", color: "#C4314B", Icon: X },
  unknown: { label: "nicht öffentlich angegeben", color: "#6B7383", Icon: Question },
  na: { label: "nicht relevant", color: "#ADB3BD", Icon: Minus },
};

async function pick(searchParams: SP) {
  const sp = await searchParams;
  const all = await getSoftwareList();
  const raw = [
    ...String(sp.p ?? "").split(","),
    ...["p1", "p2", "p3"].map((k) => String(sp[k] ?? "")),
  ]
    .map((x) => x.trim())
    .filter(Boolean);
  const slugs = [...new Set(raw)].filter((s) => all.some((x) => x.slug === s)).slice(0, 3);
  return { all, chosen: slugs.map((s) => all.find((x) => x.slug === s) as Software) };
}

export async function generateMetadata({ searchParams }: { searchParams: SP }): Promise<Metadata> {
  const { chosen } = await pick(searchParams);
  if (chosen.length >= 2) {
    const names = chosen.map((s) => s.name).join(" vs. ");
    // Every product combination is its own URL. Keep them out of the index (follow links) so they don't
    // compete with the profiles and the main comparison page; the short title still works when shared.
    return {
      title: chosen.length > 2 ? `${names} im Vergleich` : `${names}: Preise und Funktionen im Vergleich`,
      description: `${names} im direkten Vergleich: Tarife in Euro, Kosten nach Teamgröße, zehn Prüfkriterien und die Einschätzung der Redaktion.`,
      robots: { index: false, follow: true },
    };
  }
  return {
    title: "Software-Vergleich: Business-Software direkt gegenüberstellen",
    description: "Bis zu drei Programme für Buchhaltung, Lohn, HR und ERP nebeneinander vergleichen: Preise, Kosten nach Teamgröße und Prüfkriterien.",
    alternates: { canonical: "/software/vergleich" },
  };
}

export default async function Page({ searchParams }: { searchParams: SP }) {
  const { all, chosen } = await pick(searchParams);
  const CATEGORIES = await getCategories();
  const catName = (slug?: string) => CATEGORIES.find((c) => c.slug === slug)?.name ?? "";
  const ready = chosen.length >= 2;

  const sharedCat = ready ? chosen[0].categories.find((c) => chosen.every((s) => s.categories.includes(c))) : undefined;
  const bases = new Set(chosen.map((s) => s.scenarioBasis ?? "users"));
  const criteria = criteriaOrder(chosen);
  const scores = chosen.map((s) => (s.checks?.length ? checkScore(s.checks).score : null));
  const bestScore = Math.max(...scores.map((x) => x ?? -1));
  // Products whose price does not depend on headcount in our data are left out of headcount highlights.
  const scalable = (s: Software) => (s.scenarioBasis ?? "users") !== "none";
  const cost10 = chosen.map((s) => (scalable(s) ? cheapestPaid(s, 10)?.total ?? null : null));
  const minCost10 = Math.min(...cost10.filter((x): x is number => x != null));
  const cols = `repeat(${Math.max(chosen.length, 1)}, minmax(240px, 1fr))`;

  return (
    <>
      {/* Header */}
      <div className="container-page pt-8 lg:pt-12">
        <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Software", href: "/software" }, { label: "Vergleich" }]} />
        <div className="mt-10 grid gap-10 pb-10 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:pb-14">
          <div>
            <p className="t-eyebrow mb-4 flex items-center gap-2">
              <ArrowsLeftRight size={16} aria-hidden className="text-brand-500" /> Software-Vergleich
            </p>
            <h1 className="t-h1">{ready ? chosen.map((s) => s.name).join(" vs. ") : "Software direkt vergleichen."}</h1>
            <p className="t-lead mt-6 max-w-[58ch]">
              {ready
                ? "Preise, Kosten nach Teamgröße und alle zehn Prüfkriterien nebeneinander. Alle Werte stammen aus den veröffentlichten Angaben der Anbieter."
                : "Wählen Sie zwei oder drei Programme. Wir stellen Preise, Kosten nach Teamgröße und unsere zehn Prüfkriterien nebeneinander."}
            </p>
          </div>

          {/* Picker: plain GET form, works without JavaScript */}
          <form action="/software/vergleich" method="get" className="border border-line bg-surface-1 p-5" style={{ borderRadius: 14 }}>
            <p className="font-data text-[12px] uppercase tracking-[0.08em] text-ink-500">Produkte wählen</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <label key={i} className="block">
                  <span className="sr-only">Produkt {i + 1}</span>
                  <select
                    name={`p${i + 1}`}
                    defaultValue={chosen[i]?.slug ?? ""}
                    className="h-11 w-full border border-ink-950/15 bg-white px-3 text-[15px] outline-none focus:border-brand-500"
                    style={{ borderRadius: 6 }}
                  >
                    <option value="">{i < 2 ? `Produkt ${i + 1} wählen` : "Optional: Produkt 3"}</option>
                    {all.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
            <button type="submit" className="btn btn-primary btn-sm mt-3 w-full">
              <span className="btn-label" data-text="Vergleichen">
                <span>Vergleichen</span>
              </span>
            </button>
          </form>
        </div>
      </div>

      {!ready && <Popular />}

      {ready && (
        <div className="border-t border-line">
          <div className="container-page pb-24 pt-10">
            {!sharedCat && (
              <p className="mb-8 border-l-2 border-warning bg-[#fff7ed] px-4 py-3 text-[15px] text-ink-700">
                Die gewählten Produkte decken unterschiedliche Bereiche ab. Preise und Kriterien sind deshalb nur eingeschränkt vergleichbar.
              </p>
            )}

            {/* Product header cards */}
            <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
              <div className="grid gap-3" style={{ gridTemplateColumns: cols }}>
                {chosen.map((s, i) => (
                  <div key={s.slug} className="flex flex-col border border-line bg-white p-5" style={{ borderRadius: 14 }}>
                    <div className="flex h-7 items-center justify-between">
                      <PartnerLogo slug={s.slug} height={20} maxWidth={100} tile={false} />
                      <span className="font-data text-[11px] uppercase tracking-wider text-ink-500">{catName(s.categories[0])}</span>
                    </div>
                    <p className="mt-4 font-display text-[22px] font-semibold leading-tight tracking-[-0.015em]">{s.name}</p>
                    <p className="text-[13px] text-ink-500">{s.vendor}</p>
                    <div className="mt-4 flex items-baseline gap-1.5">
                      <span className="font-data text-[40px] font-medium leading-none">{scores[i] ?? "–"}</span>
                      <span className="font-data text-[14px] text-ink-500">/ 100 Kriterienwert</span>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <Button href={`/software/${s.slug}`} variant="outline" size="sm">
                        Software-Profil
                      </Button>
                      <Link
                        href={`/software/vergleich?p=${chosen.filter((x) => x.slug !== s.slug).map((x) => x.slug).join(",")}`}
                        className="inline-flex h-10 items-center px-2 text-[14px] text-ink-500 no-underline hover:text-danger"
                        aria-label={`${s.name} aus dem Vergleich entfernen`}
                      >
                        Entfernen
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                {
                  k: "Höchster Kriterienwert",
                  v: chosen.filter((_, i) => scores[i] === bestScore).map((s) => s.name).join(", "),
                  d: `${bestScore} von 100 Punkten`,
                },
                {
                  k: "Günstigster Einstieg",
                  v: (() => {
                    const priced = chosen.filter((s) => (s.entryPrice ?? 0) > 0);
                    const m = Math.min(...priced.map((s) => s.entryPrice as number));
                    return priced.filter((s) => s.entryPrice === m).map((s) => s.name).join(", ") || "–";
                  })(),
                  d: "kleinster bezahlter Tarif laut Anbieter",
                },
                {
                  k: "Günstigster bei 10 Personen*",
                  v: chosen.filter((_, i) => cost10[i] === minCost10).map((s) => s.name).join(", ") || "–",
                  d: Number.isFinite(minCost10)
                    ? `${formatEur(minCost10)} pro Monat netto, Tarif ${chosen.map((s) => cheapestPaid(s, 10)).find((c) => c?.total === minCost10)?.plan ?? ""}`
                    : "keine Preisangaben",
                },
              ].map((h) => (
                <div key={h.k} className="bg-ink-950 p-5 text-white" style={{ borderRadius: 14 }}>
                  <p className="font-data text-[11.5px] uppercase tracking-[0.08em] text-accent">{h.k}</p>
                  <p className="mt-2 font-display text-[20px] font-medium leading-snug">{h.v}</p>
                  <p className="mt-1 text-[13px] text-white/60">{h.d}</p>
                </div>
              ))}
            </div>

            {/* At a glance */}
            <Block id="ueberblick" title="Auf einen Blick">
              <CompareTable
                chosen={chosen}
                rows={[
                  ["Bereich", (s) => s.categories.map(catName).filter(Boolean).slice(0, 2).join(", ")],
                  ["Einstiegspreis", (s) => (s.entryPrice == null ? "auf Anfrage" : s.entryPrice === 0 ? "kostenloser Tarif" : `ab ${formatEur(s.entryPrice)} ${entryUnit(s)}`)],
                  ["Preisspanne", (s) => { const r = priceRange(s); return r ? `${formatEur(r.min)} – ${formatEur(r.max)}` : "–"; }],
                  ["Tarife", (s) => String(s.plans.length)],
                  ["Preisbasis", (s) => BASIS_LABEL[s.scenarioBasis ?? "users"]],
                  ["Testphase", (s) => s.trial],
                ]}
              />
            </Block>

            {/* Cost curve */}
            <Block id="kosten" title="Kosten nach Teamgröße" lead="Monatliche Kosten im jeweils günstigsten bezahlten Tarif, netto. Berechnet ausschließlich aus veröffentlichten Preisbestandteilen.">
              {bases.size > 1 && (
                <p className="mb-4 text-[14px] text-ink-500">
                  Hinweis: Die Produkte rechnen nach unterschiedlichen Größen ab ({[...bases].map((b) => BASIS_LABEL[b]).join(", ")}). Die x-Achse zeigt deshalb „Personen“.
                </p>
              )}
              <LineChart
                title="Monatliche Kosten im günstigsten bezahlten Tarif"
                takeaway={
                  Number.isFinite(minCost10)
                    ? `Bei 10 Personen ist ${chosen.filter((_, i) => cost10[i] === minCost10).map((s) => s.name).join(" und ")} am günstigsten (${formatEur(minCost10)} pro Monat).`
                    : undefined
                }
                source="Anbieterpreise, eigene Berechnung"
                xLabel="Personen"
                xs={SCENARIO_POINTS}
                series={chosen.map((s) => ({ name: s.name, values: SCENARIO_POINTS.map((n) => cheapestPaid(s, n)?.total ?? null) }))}
              />
              <div className="table-wrap mt-6">
                <table className="data-table">
                  <caption className="sr-only">Günstigster bezahlter Tarif je Teamgröße</caption>
                  <thead>
                    <tr>
                      <th scope="col">Personen</th>
                      {chosen.map((s) => (
                        <th key={s.slug} scope="col">{s.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 5, 10, 25, 50].map((n) => {
                      const row = chosen.map((s) => cheapestPaid(s, n));
                      const min = Math.min(...row.map((r, i) => (scalable(chosen[i]) ? r?.total ?? Infinity : Infinity)));
                      return (
                        <tr key={n}>
                          <td className="font-data">{n}</td>
                          {row.map((r, i) => (
                            <td key={chosen[i].slug}>
                              {r ? (
                                <>
                                  <span className={`font-data ${r.total === min ? "font-semibold text-brand-700" : ""}`}>{formatEur(r.total)}</span>
                                  <span className="block text-[12.5px] text-ink-500">
                                    {r.plan}
                                    {!scalable(chosen[i]) && " · keine personenabhängigen Preise erfasst"}
                                  </span>
                                </>
                              ) : (
                                "auf Anfrage"
                              )}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Block>

            {/* Criteria matrix */}
            <Block id="kriterien" title="Prüfkriterien im Detail" lead="Dieselben zehn Kriterien für jedes Produkt. Bewertet wird, was der Anbieter öffentlich belegt.">
              <div className="table-wrap">
                <table className="data-table">
                  <caption className="sr-only">Prüfkriterien im Vergleich</caption>
                  <thead>
                    <tr>
                      <th scope="col" className="sticky left-0 z-10">Kriterium</th>
                      {chosen.map((s) => (
                        <th key={s.slug} scope="col">{s.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {criteria.map((c) => (
                      <tr key={c}>
                        <th scope="row" className="sticky left-0 z-10 !bg-white !text-[14.5px] !font-medium !normal-case !tracking-normal text-ink-950" style={{ fontFamily: "var(--font-sans)", whiteSpace: "normal", minWidth: 200 }}>
                          {c}
                        </th>
                        {chosen.map((s) => {
                          const st = statusOf(s, c);
                          const m = ICON[st?.status ?? "unknown"];
                          return (
                            <td key={s.slug} className="min-w-[200px]">
                              <span className="inline-flex items-center gap-2 text-[14px] font-medium" style={{ color: m.color }}>
                                <m.Icon size={18} weight="bold" aria-hidden /> {m.label}
                              </span>
                              {st?.note && <span className="mt-1 block text-[13px] leading-snug text-ink-500">{st.note}</span>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                    <tr>
                      <th scope="row" className="sticky left-0 z-10 !bg-surface-1 !text-[14.5px] !normal-case !tracking-normal text-ink-950" style={{ fontFamily: "var(--font-sans)" }}>
                        Kriterienwert
                      </th>
                      {chosen.map((s, i) => (
                        <td key={s.slug} className="bg-surface-1 font-data text-[18px]">
                          {scores[i] ?? "–"} <span className="text-[13px] text-ink-500">/ 100</span>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </Block>

            {/* Verdicts */}
            <Block id="fazit" title="Einschätzung der Redaktion">
              <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(260px, 1fr))` }}>
                {chosen.map((s) => (
                  <article key={s.slug} className="flex flex-col border border-line p-6" style={{ borderRadius: 14 }}>
                    <PartnerLogo slug={s.slug} height={18} maxWidth={90} tile={false} />
                    <h3 className="t-h3 mt-4">{s.name}</h3>
                    {s.verdict && <p className="mt-3 text-[15px] leading-relaxed text-ink-700">{s.verdict}</p>}
                    {s.fits.length > 0 && (
                      <>
                        <p className="mt-5 font-data text-[11.5px] uppercase tracking-[0.08em] text-success">Passt gut zu</p>
                        <ul className="mt-2 space-y-1.5 text-[14.5px] text-ink-700">
                          {s.fits.slice(0, 2).map((f) => (
                            <li key={f} className="flex gap-2"><Check size={16} aria-hidden className="mt-1 shrink-0 text-success" />{f}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    {s.notFits.length > 0 && (
                      <>
                        <p className="mt-5 font-data text-[11.5px] uppercase tracking-[0.08em] text-danger">Weniger geeignet für</p>
                        <ul className="mt-2 space-y-1.5 text-[14.5px] text-ink-700">
                          {s.notFits.slice(0, 2).map((f) => (
                            <li key={f} className="flex gap-2"><X size={16} aria-hidden className="mt-1 shrink-0 text-danger" />{f}</li>
                          ))}
                        </ul>
                      </>
                    )}
                    <div className="mt-auto pt-6">
                      <Link href={`/software/${s.slug}`} className="link-arrow">Zum vollständigen Software-Profil →</Link>
                    </div>
                  </article>
                ))}
              </div>
            </Block>

            <p className="mt-10 text-[13px] text-ink-500">
              * Nur Produkte, deren Preise nach Nutzenden oder Beschäftigten gestaffelt erfasst sind. Alle Preise laut Anbieter, zzgl. MwSt. Kosten sind Modellrechnungen aus veröffentlichten Preisbestandteilen und ersetzen kein Angebot. Kriterienwert: erfüllte Kriterien, teilweise erfüllte zählen zur Hälfte.{" "}
              <Link href="/methodik" className="text-brand-700">Methodik</Link>
            </p>
          </div>
          <Popular title="Weitere Vergleiche" />
        </div>
      )}
    </>
  );
}

function Block({ id, title, lead, children }: { id: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="mt-16 scroll-mt-32">
      <h2 id={`${id}-h`} className="t-h2">{title}</h2>
      {lead && <p className="mt-3 max-w-[70ch] text-ink-700">{lead}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

function CompareTable({ chosen, rows }: { chosen: Software[]; rows: [string, (s: Software) => string][] }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">Überblick</caption>
        <thead>
          <tr>
            <th scope="col" className="sticky left-0 z-10">Merkmal</th>
            {chosen.map((s) => (
              <th key={s.slug} scope="col">{s.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([label, fn]) => (
            <tr key={label}>
              <th scope="row" className="sticky left-0 z-10 !bg-white !text-[14.5px] !font-medium !normal-case !tracking-normal text-ink-950" style={{ fontFamily: "var(--font-sans)" }}>
                {label}
              </th>
              {chosen.map((s) => (
                <td key={s.slug} className="min-w-[200px]">{fn(s)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function Popular({ title = "Beliebte Vergleiche" }: { title?: string }) {
  const all = await getSoftwareList();
  const name = (slug: string) => all.find((s) => s.slug === slug)?.name ?? slug;
  return (
    <section className="border-t border-line bg-surface-1">
      <div className="container-page py-16">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="t-h2">{title}</h2>
          <Link href="/software/finder" className="link-arrow inline-flex items-center gap-2">
            <Compass size={18} aria-hidden /> Unsicher? Zum Software-Finder
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_COMPARISONS.map((c) => (
            <li key={c.title}>
              <Link href={`/software/vergleich?p=${c.slugs.join(",")}`} className="group flex h-full flex-col border border-line bg-white p-6 no-underline transition-colors hover:border-brand-500" style={{ borderRadius: 14 }}>
                <p className="font-data text-[11.5px] uppercase tracking-[0.08em] text-ink-500">{c.title}</p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {c.slugs.map((s) => (
                    <PartnerLogo key={s} slug={s} height={16} maxWidth={80} />
                  ))}
                </div>
                <p className="mt-4 flex-1 font-display text-[18px] font-semibold leading-snug group-hover:text-brand-700">{c.slugs.map(name).join(" vs. ")}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-brand-700">
                  Vergleich öffnen <ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
