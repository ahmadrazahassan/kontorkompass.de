"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowCounterClockwise, Check, CircleHalf, Question, X, ArrowsLeftRight } from "@phosphor-icons/react";
import type { Check as CheckT, Software } from "@/content/data";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { AffiliateBadge } from "@/components/ui/Affiliate";
import { planCost } from "@/lib/pricing";

export type FinderItem = Pick<Software, "slug" | "name" | "vendor" | "categories" | "plans" | "scenarioBasis" | "checks" | "trial" | "verdict" | "isAffiliate">;

const AREAS = [
  { id: "buchhaltung", label: "Buchhaltung und Rechnungen", hint: "Belege, Rechnungen, E-Rechnung, USt", cats: ["buchhaltung-finanzen", "rechnungsstellung-e-rechnung"] },
  { id: "lohn", label: "Lohnabrechnung", hint: "Gehälter, Meldungen, Minijobs", cats: ["lohn-gehalt"] },
  { id: "hr", label: "Personal und HR", hint: "Personalakte, Bewerbungen, Onboarding", cats: ["hr-personal"] },
  { id: "erp", label: "ERP und Warenwirtschaft", hint: "Aufträge, Lager, Einkauf, Produktion", cats: ["erp-warenwirtschaft"] },
  { id: "zeit", label: "Zeiterfassung", hint: "Arbeitszeiten, Überstunden, Abwesenheiten", cats: ["zeiterfassung"] },
];
const TEAMS = [
  { label: "Nur ich", n: 1 },
  { label: "2 bis 5 Personen", n: 5 },
  { label: "6 bis 15 Personen", n: 15 },
  { label: "16 bis 50 Personen", n: 50 },
  { label: "Mehr als 50", n: 50, note: "gerechnet mit 50" },
];
const BUDGETS = [
  { label: "bis 30 €", v: 30 },
  { label: "bis 100 €", v: 100 },
  { label: "bis 300 €", v: 300 },
  { label: "bis 1.000 €", v: 1000 },
  { label: "Noch offen", v: null },
];
const NEEDS = [
  { id: "datev", label: "Export für das Steuerbüro (DATEV)", crit: "Export oder Schnittstelle für das Steuerbüro (DATEV)" },
  { id: "einv", label: "E-Rechnung (XRechnung, ZUGFeRD)", crit: "E-Rechnung (XRechnung / ZUGFeRD)" },
  { id: "trial", label: "Kostenlose Testphase", crit: "Kostenlose Testphase" },
  { id: "term", label: "Monatlich kündbar", crit: "Kurze Vertragslaufzeit (monatlich kündbar)" },
  { id: "data", label: "Datenstandort angegeben", crit: "Datenstandort öffentlich angegeben" },
  { id: "payroll", label: "Lohnabrechnung enthalten", crit: "Lohnabrechnung enthalten oder zubuchbar" },
  { id: "mobile", label: "Mobile App", crit: "Mobile Nutzung (App) laut Anbieter" },
  { id: "api", label: "Schnittstelle (API)", crit: "Programmierschnittstelle (API) laut Anbieter" },
];

const VALUE: Record<CheckT["status"], number> = { yes: 1, partial: 0.5, no: 0, unknown: 0, na: 0 };
const ICON: Record<CheckT["status"], { label: string; color: string; Icon: typeof Check }> = {
  yes: { label: "erfüllt", color: "#13795B", Icon: Check },
  partial: { label: "teilweise", color: "#B25E09", Icon: CircleHalf },
  no: { label: "nicht enthalten", color: "#C4314B", Icon: X },
  unknown: { label: "nicht belegt", color: "#6B7383", Icon: Question },
  na: { label: "nicht relevant", color: "#ADB3BD", Icon: Question },
};
const eur = (n: number) => new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

function cheapest(s: FinderItem, n: number) {
  let best: { plan: string; total: number } | null = null;
  for (const p of s.plans) {
    if (p.monthlyNet == null || p.monthlyNet <= 0) continue;
    const c = planCost(p, n, s.scenarioBasis ?? "users");
    if (c && (!best || c.total < best.total)) best = { plan: p.name, total: c.total };
  }
  return best;
}

export function SoftwareFinder({ items, verified }: { items: FinderItem[]; verified: string }) {
  const [step, setStep] = useState(0);
  const [area, setArea] = useState<(typeof AREAS)[number] | null>(null);
  const [team, setTeam] = useState<(typeof TEAMS)[number] | null>(null);
  const [budget, setBudget] = useState<(typeof BUDGETS)[number] | null>(null);
  const [needs, setNeeds] = useState<string[]>([]);

  const results = useMemo(() => {
    if (!area || !team || !budget) return [];
    return items
      .filter((s) => s.categories.some((c) => area.cats.includes(c)))
      .map((s) => {
        const rel = (s.checks ?? []).filter((c) => c.status !== "na");
        const quality = rel.length ? rel.reduce((a, c) => a + VALUE[c.status], 0) / rel.length : 0;
        const needRows = NEEDS.filter((n) => needs.includes(n.id)).map((n) => ({ ...n, check: s.checks?.find((c) => c.criterion === n.crit) }));
        const needFit = needRows.length ? needRows.reduce((a, r) => a + VALUE[r.check?.status ?? "unknown"], 0) / needRows.length : null;
        const cost = cheapest(s, team.n);
        const budgetFit = cost == null ? 0.5 : budget.v == null ? 1 : cost.total <= budget.v ? 1 : Math.max(0, 1 - (cost.total - budget.v) / budget.v);
        const match = needFit == null ? 0.6 * budgetFit + 0.4 * quality : 0.5 * needFit + 0.3 * budgetFit + 0.2 * quality;
        return { s, cost, needRows, needFit, budgetFit, quality, match: Math.round(match * 100) };
      })
      .sort((a, b) => b.match - a.match);
  }, [items, area, team, budget, needs]);

  const restart = () => {
    setStep(0);
    setArea(null);
    setTeam(null);
    setBudget(null);
    setNeeds([]);
  };

  const STEPS = ["Bereich", "Teamgröße", "Budget", "Anforderungen"];

  if (step === 4) {
    const top3 = results.slice(0, 3).map((r) => r.s.slug);
    return (
      <div>
        {/* Answer summary */}
        <div className="flex flex-col gap-4 border border-line bg-surface-1 p-5 md:flex-row md:items-center md:justify-between" style={{ borderRadius: 14 }}>
          <dl className="flex flex-wrap gap-x-8 gap-y-3 text-[14.5px]">
            {[
              ["Bereich", area?.label],
              ["Team", team ? `${team.label}${team.note ? ` (${team.note})` : ""}` : ""],
              ["Budget", budget ? `${budget.label}${budget.v ? " pro Monat" : ""}` : ""],
              ["Anforderungen", needs.length ? `${needs.length} gewählt` : "keine"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="font-data text-[11px] uppercase tracking-[0.08em] text-ink-500">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => setStep(3)} className="btn btn-outline btn-sm">
              <span className="btn-label" data-text="Anpassen"><span>Anpassen</span></span>
            </button>
            <button type="button" onClick={restart} className="inline-flex h-10 items-center gap-2 px-3 text-[14.5px] text-ink-700 hover:text-ink-950">
              <ArrowCounterClockwise size={16} aria-hidden /> Neu starten
            </button>
          </div>
        </div>

        {results.length === 0 ? (
          <p className="mt-10 text-ink-700">Für diesen Bereich haben wir noch keine Software-Profile. Schauen Sie in unsere <Link href="/ratgeber">Ratgeber</Link>.</p>
        ) : (
          <>
            <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <h2 className="t-h2">{results.length} passende {results.length === 1 ? "Lösung" : "Lösungen"}</h2>
              {top3.length >= 2 && (
                <Link href={`/software/vergleich?p=${top3.join(",")}`} className="btn btn-ink btn-sm">
                  <ArrowsLeftRight size={16} aria-hidden />
                  <span className="btn-label" data-text={`Top ${top3.length} vergleichen`}><span>{`Top ${top3.length} vergleichen`}</span></span>
                </Link>
              )}
            </div>
            <ol className="mt-6 space-y-4">
              {results.map((r, i) => (
                <li key={r.s.slug} className={`grid gap-6 border bg-white p-6 md:grid-cols-[1.1fr_1fr] md:p-8 ${i === 0 ? "border-brand-500 shadow-[var(--shadow-overlay)]" : "border-line"}`} style={{ borderRadius: 16 }}>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-data text-[13px] text-ink-500">{String(i + 1).padStart(2, "0")}</span>
                      <PartnerLogo slug={r.s.slug} height={20} maxWidth={100} tile={false} />
                      {i === 0 && (
                        <span className="border border-brand-500/30 bg-brand-50 px-2 py-0.5 font-data text-[11px] uppercase tracking-wider text-brand-700" style={{ borderRadius: 4 }}>
                          Beste Passung
                        </span>
                      )}
                      {r.s.isAffiliate && <AffiliateBadge />}
                    </div>
                    <h3 className="mt-4 font-display text-[26px] font-semibold leading-tight tracking-[-0.015em]">{r.s.name}</h3>
                    <p className="text-[14px] text-ink-500">{r.s.vendor}</p>
                    {r.s.verdict && <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-ink-700">{r.s.verdict}</p>}
                    <p className="mt-5 text-[15px]">
                      {r.cost ? (
                        <>
                          <span className="font-data text-[22px] font-medium">{eur(r.cost.total)}</span>
                          <span className="text-ink-500">
                            {" "}pro Monat netto im Tarif „{r.cost.plan}“
                            {(r.s.scenarioBasis ?? "users") === "none" ? " (keine personenabhängigen Preise erfasst)" : ` für ${team?.n} ${team?.n === 1 ? "Person" : "Personen"}`}
                          </span>
                        </>
                      ) : (
                        <span className="text-ink-500">Preis auf Anfrage</span>
                      )}
                    </p>
                    {r.cost && needs.length > 0 && <p className="mt-1 text-[13px] text-ink-500">Einzelne Anforderungen können einen höheren Tarif erfordern. Details im Software-Profil.</p>}
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Link href={`/software/${r.s.slug}`} className="btn btn-primary btn-sm">
                        <span className="btn-label" data-text="Zum Software-Profil"><span>Zum Software-Profil</span></span>
                        <ArrowRight aria-hidden className="btn-arrow" />
                      </Link>
                    </div>
                  </div>

                  <div className="md:border-l md:border-line md:pl-8">
                    <div className="flex items-baseline justify-between">
                      <p className="font-data text-[11.5px] uppercase tracking-[0.08em] text-ink-500">Passung</p>
                      <p className="font-data text-[40px] font-medium leading-none text-brand-700">{r.match} %</p>
                    </div>
                    <div className="mt-4 space-y-3">
                      {[
                        r.needFit != null ? ["Anforderungen", r.needFit] : null,
                        ["Budget", r.budgetFit],
                        ["Kriterienwert", r.quality],
                      ]
                        .filter(Boolean)
                        .map((row) => {
                          const [k, v] = row as [string, number];
                          return (
                            <div key={k}>
                              <div className="flex justify-between text-[13px] text-ink-700">
                                <span>{k}</span>
                                <span className="font-data">{Math.round(v * 100)} %</span>
                              </div>
                              <div className="mt-1 h-1.5 bg-ink-950/[0.07]" style={{ borderRadius: 1 }}>
                                <div className="h-full bg-brand-500" style={{ width: `${v * 100}%`, borderRadius: 1 }} />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    {r.needRows.length > 0 && (
                      <ul className="mt-6 space-y-2 border-t border-line pt-5">
                        {r.needRows.map((n) => {
                          const st = n.check?.status ?? "unknown";
                          const m = ICON[st];
                          return (
                            <li key={n.id} className="flex items-start gap-2.5 text-[14px]">
                              <m.Icon size={17} weight="bold" aria-hidden className="mt-0.5 shrink-0" style={{ color: m.color }} />
                              <span>
                                {n.label}: <span style={{ color: m.color }}>{m.label}</span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-8 max-w-[80ch] text-[13px] leading-relaxed text-ink-500">
              So rechnen wir: Mit gewählten Anforderungen zählen Anforderungen 50 %, Budget 30 % und Kriterienwert 20 %; ohne Anforderungen Budget 60 % und Kriterienwert 40 %. Kosten im günstigsten bezahlten Tarif laut Anbieter, zzgl. MwSt. Das Ergebnis ist eine Orientierung auf Basis öffentlicher Angaben, keine Beratung. Werbelinks beeinflussen das Ergebnis nicht.
            </p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="border border-line bg-white p-6 shadow-[0_24px_60px_-30px_rgb(14_20_32_/_0.25)] sm:p-10" style={{ borderRadius: 20 }}>
      {/* Progress */}
      <div className="flex items-center justify-between">
        <p className="font-data text-[12px] uppercase tracking-[0.08em] text-ink-500">
          Schritt {step + 1} von 4 · {STEPS[step]}
        </p>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 text-[14px] text-ink-700 hover:text-ink-950">
            <ArrowLeft size={15} aria-hidden /> Zurück
          </button>
        )}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden>
        {STEPS.map((s, i) => (
          <span key={s} className={`h-1 ${i <= step ? "bg-brand-500" : "bg-ink-950/10"}`} style={{ borderRadius: 1 }} />
        ))}
      </div>

      {step === 0 && (
        <Step title="Wofür suchen Sie Software?">
          <div className="grid gap-3 sm:grid-cols-2">
            {AREAS.map((a) => (
              <Option key={a.id} active={area?.id === a.id} onClick={() => { setArea(a); setStep(1); }} title={a.label} hint={a.hint} />
            ))}
          </div>
        </Step>
      )}
      {step === 1 && (
        <Step title="Wie viele Personen arbeiten mit der Software?" hint="Je nach Produkt zählen Nutzende oder Beschäftigte.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEAMS.map((t) => (
              <Option key={t.label} active={team?.label === t.label} onClick={() => { setTeam(t); setStep(2); }} title={t.label} />
            ))}
          </div>
        </Step>
      )}
      {step === 2 && (
        <Step title="Welches monatliche Budget haben Sie?" hint="Netto, also zzgl. MwSt.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BUDGETS.map((b) => (
              <Option key={b.label} active={budget?.label === b.label} onClick={() => { setBudget(b); setStep(3); }} title={b.label} />
            ))}
          </div>
        </Step>
      )}
      {step === 3 && (
        <Step title="Was ist Ihnen wichtig?" hint="Mehrfachauswahl möglich. Sie können den Schritt auch überspringen.">
          <div className="grid gap-3 sm:grid-cols-2">
            {NEEDS.map((n) => {
              const on = needs.includes(n.id);
              return (
                <button
                  key={n.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setNeeds((x) => (on ? x.filter((y) => y !== n.id) : [...x, n.id]))}
                  className={`flex items-center gap-3 border p-4 text-left text-[15.5px] transition-colors ${on ? "border-brand-500 bg-brand-50" : "border-line hover:border-ink-950/30"}`}
                  style={{ borderRadius: 10 }}
                >
                  <span aria-hidden className={`grid h-5 w-5 shrink-0 place-items-center border ${on ? "border-brand-500 bg-brand-500 text-white" : "border-ink-950/30"}`} style={{ borderRadius: 4 }}>
                    {on && <Check size={13} weight="bold" />}
                  </span>
                  {n.label}
                </button>
              );
            })}
          </div>
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => setStep(4)} className="btn btn-primary btn-md">
              <span className="btn-label" data-text="Ergebnis anzeigen"><span>Ergebnis anzeigen</span></span>
              <ArrowRight aria-hidden className="btn-arrow" />
            </button>
          </div>
        </Step>
      )}
    </div>
  );
}

function Step({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="mt-8">
      <legend className="font-display text-[clamp(24px,3vw,32px)] font-medium leading-tight tracking-[-0.015em]">{title}</legend>
      {hint && <p className="mt-2 text-ink-500">{hint}</p>}
      <div className="mt-7">{children}</div>
    </fieldset>
  );
}

function Option({ title, hint, active, onClick }: { title: string; hint?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex items-center justify-between gap-4 border p-5 text-left transition-colors ${active ? "border-brand-500 bg-brand-50" : "border-line hover:border-brand-500"}`}
      style={{ borderRadius: 10 }}
    >
      <span>
        <span className="block text-[16.5px] font-medium">{title}</span>
        {hint && <span className="mt-0.5 block text-[14px] text-ink-500">{hint}</span>}
      </span>
      <ArrowRight size={18} aria-hidden className="shrink-0 text-ink-500 transition-transform group-hover:translate-x-1 group-hover:text-brand-500" />
    </button>
  );
}
