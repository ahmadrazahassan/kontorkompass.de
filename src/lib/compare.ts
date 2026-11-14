// Shared logic for the comparison page and the Software-Finder. Only published vendor data is used.
import type { Check, Software } from "@/content/data";
import { planCost } from "./pricing";

export const STATUS: Record<Check["status"], { color: string; label: string; short: string; value: number }> = {
  yes: { color: "#006BFF", label: "erfüllt", short: "Ja", value: 1 },
  partial: { color: "#7AB3FF", label: "teilweise", short: "Teilweise", value: 0.5 },
  no: { color: "#3D4656", label: "nicht erfüllt", short: "Nein", value: 0 },
  unknown: { color: "#E3E6EB", label: "nicht belegt", short: "Nicht belegt", value: 0 },
  na: { color: "transparent", label: "nicht relevant", short: "n. r.", value: 0 },
};

export const UNIT_LABEL: Record<string, string> = { perUser: "je Nutzer", perEmployee: "je Mitarbeitende", flat: "pauschal" };

export const BASIS_LABEL: Record<NonNullable<Software["scenarioBasis"]>, string> = {
  users: "Nutzende",
  employees: "Beschäftigte",
  none: "Personenzahl nicht preisrelevant",
};

/** Cheapest paid plan for n people (free plans excluded: they are rarely comparable in scope). */
export function cheapestPaid(s: Software, n: number) {
  const basis = s.scenarioBasis ?? "users";
  let best: { plan: string; total: number } | null = null;
  for (const p of s.plans) {
    if (p.monthlyNet == null || p.monthlyNet <= 0) continue;
    const c = planCost(p, n, basis);
    if (c && (!best || c.total < best.total)) best = { plan: p.name, total: c.total };
  }
  return best;
}

export function priceRange(s: Software) {
  const v = s.plans.map((p) => p.monthlyNet).filter((x): x is number => typeof x === "number" && x > 0);
  return v.length ? { min: Math.min(...v), max: Math.max(...v) } : null;
}

export function entryUnit(s: Software) {
  const plan = s.plans.find((p) => p.monthlyNet === s.entryPrice) ?? s.plans.find((p) => p.monthlyNet != null);
  return plan?.unit ? UNIT_LABEL[plan.unit] : "";
}

/** Criteria in a stable order: the order used by the first product that has them all. */
export function criteriaOrder(items: Software[]) {
  const out: string[] = [];
  for (const s of items) for (const c of s.checks ?? []) if (!out.includes(c.criterion)) out.push(c.criterion);
  return out;
}

export const statusOf = (s: Software, criterion: string) => s.checks?.find((c) => c.criterion === criterion);

/** Ready-made comparisons within one category. Products in alphabetical order, so no vendor is always listed first. */
export const POPULAR_COMPARISONS = [
  { title: "Buchhaltung für kleine Unternehmen", slugs: ["lexware-office", "sage-active", "sevdesk"] },
  { title: "Lohnabrechnung und HR", slugs: ["personio", "sage-lohnabrechnung"] },
  { title: "ERP für den Mittelstand", slugs: ["sage-100", "weclapp"] },
  { title: "HR-Software", slugs: ["personio", "sage-hr-suite"] },
];
