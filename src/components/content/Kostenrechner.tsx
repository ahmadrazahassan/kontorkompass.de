"use client";

import { useState } from "react";
import { formatEur } from "@/lib/format";

type Plan = {
  name: string;
  baseMonthly: number;
  includedUsers: number;
  extraUser: number;
  includedEmployees: number;
  extraEmployee: number;
  includedInvoices: number;
  extraInvoice: number;
};

// Sage Active, regular prices zzgl. MwSt., sage.com, verified 06.11.2026
const PLANS: Plan[] = [
  { name: "Starter", baseMonthly: 25, includedUsers: 5, extraUser: 5, includedEmployees: 0, extraEmployee: 0, includedInvoices: 300, extraInvoice: 0.05 },
  { name: "Essentials", baseMonthly: 49, includedUsers: 10, extraUser: 10, includedEmployees: 2, extraEmployee: 3, includedInvoices: 500, extraInvoice: 0.05 },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

export function monthlyCost(p: Plan, users: number, employees: number, invoices: number) {
  const u = Math.max(0, users - p.includedUsers) * p.extraUser;
  const e = Math.max(0, employees - p.includedEmployees) * p.extraEmployee;
  const i = Math.max(0, invoices - p.includedInvoices) * p.extraInvoice;
  return round2(p.baseMonthly + u + e + i);
}

export function Kostenrechner() {
  const [users, setUsers] = useState(3);
  const [employees, setEmployees] = useState(2);
  const [invoices, setInvoices] = useState(150);
  const [gross, setGross] = useState(false);
  const factor = gross ? 1.19 : 1;

  const num = (v: string) => Math.max(0, Math.min(9999, Number.parseInt(v || "0", 10) || 0));
  const field = "mt-1 h-12 w-full border border-line bg-white px-3 text-[16px] tabular-nums";

  return (
    <section aria-labelledby="kr" className="my-8 rounded-[12px] border border-line p-6">
      <h3 id="kr" className="t-h3 !text-[20px]">Kostenrechner Sage Active</h3>
      <p className="mt-1 text-[15px] text-ink-700">Reguläre Preise ohne Aktionsrabatt. Der Tarif Starter enthält keine Lohnabrechnung.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        <label className="text-[14px] font-medium">
          Nutzende
          <input className={field} style={{ borderRadius: 6 }} inputMode="numeric" value={users} onChange={(e) => setUsers(num(e.target.value))} />
        </label>
        <label className="text-[14px] font-medium">
          Beschäftigte (Lohn)
          <input className={field} style={{ borderRadius: 6 }} inputMode="numeric" value={employees} onChange={(e) => setEmployees(num(e.target.value))} />
        </label>
        <label className="text-[14px] font-medium">
          Rechnungen pro Monat
          <input className={field} style={{ borderRadius: 6 }} inputMode="numeric" value={invoices} onChange={(e) => setInvoices(num(e.target.value))} />
        </label>
      </div>
      <fieldset className="mt-5 flex gap-2" aria-label="Preisanzeige">
        {[
          [false, "zzgl. MwSt."],
          [true, "inkl. MwSt. (19 %)"],
        ].map(([val, label]) => (
          <button
            key={String(label)}
            type="button"
            aria-pressed={gross === val}
            onClick={() => setGross(val as boolean)}
            className="h-10 px-4 text-[14px] font-medium"
            style={{
              borderRadius: 6,
              background: gross === val ? "#0e1420" : "transparent",
              color: gross === val ? "#fff" : "#0e1420",
              boxShadow: gross === val ? "none" : "inset 0 0 0 1px rgb(14 20 32 / 0.2)",
            }}
          >
            {label as string}
          </button>
        ))}
      </fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {PLANS.map((p) => {
          const m = monthlyCost(p, users, employees, invoices) * factor;
          return (
            <div key={p.name} className="rounded-[12px] bg-surface-1 p-5" aria-live="polite">
              <p className="t-eyebrow">Sage Active {p.name}</p>
              <p className="t-stat mt-2 !text-[44px] tabular">{formatEur(round2(m))}</p>
              <p className="text-[14px] text-ink-500">pro Monat · {formatEur(round2(m * 12))} pro Jahr</p>
              {p.name === "Starter" && employees > 0 && <p className="mt-2 text-[13px] text-ink-500">Lohnabrechnung nicht enthalten.</p>}
            </div>
          );
        })}
      </div>
      <p className="t-eyebrow mt-5">Quelle: sage.com/de-de/produkte/sage-active · Angaben ohne Gewähr</p>
    </section>
  );
}
