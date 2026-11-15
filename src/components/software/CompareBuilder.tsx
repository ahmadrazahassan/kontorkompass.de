"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Check, X } from "@phosphor-icons/react";
import { PartnerLogo } from "@/components/ui/PartnerLogo";

export type CompareItem = {
  slug: string;
  name: string;
  vendor: string;
  category: string;
  categories: string[];
  entry: string;
  unit: string;
  score: number | null;
  trial: string;
  plans: number;
};

const MAX = 3;

export function CompareBuilder({ items, filters }: { items: CompareItem[]; filters: { slug: string; name: string }[] }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [filter, setFilter] = useState<string>("alle");
  const toggle = (slug: string) =>
    setPicked((p) => (p.includes(slug) ? p.filter((x) => x !== slug) : p.length >= MAX ? p : [...p, slug]));
  const shown = filter === "alle" ? items : items.filter((i) => i.categories.includes(filter));
  const href = `/software/vergleich?p=${picked.join(",")}`;

  return (
    <>
      {/* Category filter */}
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Nach Bereich filtern">
        {[{ slug: "alle", name: "Alle Bereiche" }, ...filters].map((f) => {
          const on = filter === f.slug;
          return (
            <button
              key={f.slug}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(f.slug)}
              className={`border px-3.5 py-2 text-[14.5px] transition-colors ${on ? "border-ink-950 bg-ink-950 text-white" : "border-ink-950/15 bg-white text-ink-700 hover:border-ink-950/40"}`}
              style={{ borderRadius: 6 }}
            >
              {f.name}
              <span className={`ml-2 font-data text-[12px] ${on ? "text-white/60" : "text-ink-500"}`}>
                {f.slug === "alle" ? items.length : items.filter((i) => i.categories.includes(f.slug)).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Rows */}
      <ul className="mt-6 divide-y divide-line border-y border-line">
        {shown.map((s) => {
          const on = picked.includes(s.slug);
          const full = !on && picked.length >= MAX;
          return (
            <li key={s.slug} className={`grid items-center gap-x-6 gap-y-4 py-6 transition-colors md:grid-cols-[150px_1.4fr_1fr_0.8fr_auto] ${on ? "bg-brand-50/60" : ""}`}>
              <div className="flex items-center md:pl-2">
                <PartnerLogo slug={s.slug} height={22} maxWidth={120} tile={false} />
              </div>
              <div>
                <p className="font-data text-[11.5px] uppercase tracking-[0.08em] text-ink-500">{s.category}</p>
                <Link href={`/software/${s.slug}`} className="mt-1 inline-flex items-center gap-1.5 font-display text-[21px] font-semibold tracking-[-0.015em] no-underline hover:text-brand-700">
                  {s.name} <ArrowUpRight size={16} aria-hidden className="text-ink-500" />
                </Link>
                <p className="text-[13.5px] text-ink-500">
                  {s.vendor} · {s.plans} Tarife · {s.trial}
                </p>
              </div>
              <div>
                <p className="font-data text-[11.5px] uppercase tracking-[0.08em] text-ink-500">Einstieg</p>
                <p className="mt-1 text-[16px] font-medium">
                  {s.entry} {s.unit && <span className="text-[13px] font-normal text-ink-500">{s.unit}</span>}
                </p>
              </div>
              <div>
                <p className="font-data text-[11.5px] uppercase tracking-[0.08em] text-ink-500">Kriterienwert</p>
                <p className="mt-1 font-data text-[22px] leading-none">
                  {s.score ?? "–"}
                  <span className="text-[13px] text-ink-500"> / 100</span>
                </p>
              </div>
              <div className="flex gap-2 md:justify-end md:pr-2">
                <button
                  type="button"
                  onClick={() => toggle(s.slug)}
                  disabled={full}
                  aria-pressed={on}
                  className={`inline-flex h-10 items-center gap-2 border px-3.5 text-[14.5px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${on ? "border-brand-500 bg-brand-500 text-white" : "border-ink-950/20 bg-white text-ink-950 hover:border-brand-500"}`}
                  style={{ borderRadius: 6 }}
                  title={full ? "Maximal drei Produkte" : undefined}
                >
                  <span aria-hidden className={`grid h-4 w-4 place-items-center border ${on ? "border-white bg-white text-brand-500" : "border-ink-950/40"}`} style={{ borderRadius: 3 }}>
                    {on && <Check size={12} weight="bold" />}
                  </span>
                  Vergleichen
                </button>
                <Link href={`/software/${s.slug}`} className="btn btn-outline btn-sm">
                  <span className="btn-label" data-text="Profil">
                    <span>Profil</span>
                  </span>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Tray */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink-950/10 bg-ink-950 text-white shadow-[0_-12px_32px_-12px_rgb(14_20_32_/_0.4)] transition-transform duration-300 ${picked.length ? "translate-y-0" : "translate-y-full"}`}
        aria-live="polite"
      >
        <div className="container-page flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 font-data text-[12px] uppercase tracking-[0.08em] text-white/55">
              Vergleich {picked.length}/{MAX}
            </span>
            {picked.map((slug) => {
              const it = items.find((i) => i.slug === slug)!;
              return (
                <button
                  key={slug}
                  type="button"
                  onClick={() => toggle(slug)}
                  className="inline-flex items-center gap-2 border border-white/20 px-3 py-1.5 text-[14px] hover:border-white/50"
                  style={{ borderRadius: 6 }}
                  aria-label={`${it.name} entfernen`}
                >
                  {it.name} <X size={14} aria-hidden />
                </button>
              );
            })}
            {picked.length < 2 && <span className="text-[14px] text-white/55">Wählen Sie mindestens zwei Produkte.</span>}
          </div>
          {picked.length >= 2 ? (
            <Link href={href} className="btn btn-light btn-md shrink-0">
              <span className="btn-label" data-text="Jetzt vergleichen">
                <span>Jetzt vergleichen</span>
              </span>
              <ArrowRight aria-hidden className="btn-arrow" />
            </Link>
          ) : (
            <button type="button" onClick={() => setPicked([])} className="shrink-0 text-[14px] text-white/60 hover:text-white">
              Auswahl leeren
            </button>
          )}
        </div>
      </div>
    </>
  );
}
