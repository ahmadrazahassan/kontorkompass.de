import type { Plan, Software } from "@/content/data";

export const VAT = 0.19;
const r2 = (n: number) => Math.round(n * 100) / 100;

export type CostBreakdown = { base: number; extraUsers: number; extraEmployees: number; minimumTopUp: number; total: number };

/** Monthly net cost of a plan for `n` users or employees, computed only from published price components. */
export function planCost(plan: Plan, n: number, basis: Software["scenarioBasis"] = "users", billing: "monthly" | "annual" = "monthly"): CostBreakdown | null {
  const price = billing === "annual" && plan.annualMonthly != null ? plan.annualMonthly : plan.monthlyNet;
  if (price == null) return null;
  let base = price;
  if (plan.unit === "perUser" && basis === "users") base = price * n;
  if (plan.unit === "perEmployee" && basis === "employees") base = price * n;
  const extraUsers =
    basis === "users" && plan.unit !== "perUser" && plan.includedUsers != null && plan.extraUserMonthly != null
      ? Math.max(0, n - plan.includedUsers) * plan.extraUserMonthly
      : 0;
  const extraEmployees =
    basis === "employees" && plan.unit !== "perEmployee" && plan.includedEmployees != null && plan.extraEmployeeMonthly != null
      ? Math.max(0, n - plan.includedEmployees) * plan.extraEmployeeMonthly
      : 0;
  const subtotal = base + extraUsers + extraEmployees;
  const minimumTopUp = plan.minMonthly != null && subtotal < plan.minMonthly ? plan.minMonthly - subtotal : 0;
  return { base: r2(base), extraUsers: r2(extraUsers), extraEmployees: r2(extraEmployees), minimumTopUp: r2(minimumTopUp), total: r2(subtotal + minimumTopUp) };
}

/** First-year cost including a time-limited promotion, if the vendor published one. */
export function firstYearCost(plan: Plan, n: number, basis: Software["scenarioBasis"]): number | null {
  const regular = planCost(plan, n, basis)?.total;
  if (regular == null) return null;
  if (plan.promoMonthly != null && plan.promoMonths) {
    const promoBase = planCost({ ...plan, monthlyNet: plan.promoMonthly }, n, basis)!.total;
    return r2(promoBase * plan.promoMonths + regular * (12 - plan.promoMonths));
  }
  return r2(regular * 12);
}

export const SCENARIO_POINTS = [1, 3, 5, 10, 15, 25, 50];

export function pricedPlans(s: Software) {
  return s.plans.filter((p) => p.monthlyNet != null);
}

export function basisLabel(basis: Software["scenarioBasis"], n?: number) {
  if (basis === "employees") return n === 1 ? "Beschäftigte" : "Beschäftigte";
  if (basis === "users") return n === 1 ? "Nutzer/in" : "Nutzende";
  return "";
}

export function checkScore(checks: NonNullable<Software["checks"]>) {
  const rel = checks.filter((c) => c.status !== "na");
  const yes = rel.filter((c) => c.status === "yes").length;
  const partial = rel.filter((c) => c.status === "partial").length;
  const no = rel.filter((c) => c.status === "no").length;
  const unknown = rel.filter((c) => c.status === "unknown").length;
  const score = rel.length ? Math.round(((yes + partial * 0.5) / rel.length) * 100) : 0;
  return { yes, partial, no, unknown, total: rel.length, score };
}
