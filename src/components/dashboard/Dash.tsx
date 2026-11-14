// Dashboard building blocks (bento cards, highlight bars, gauge, heat grid, split bars).
// Server-rendered SVG/HTML, brand colours, no external chart library.
import type { ReactNode } from "react";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

const de = (n: number, d = 0) => new Intl.NumberFormat("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n);
export const pct = (n: number, d = 0) => `${de(n, d)} %`;

type Tone = "light" | "white" | "blue" | "ink";
const TONES: Record<Tone, { bg: string; fg: string; sub: string; line: string }> = {
  light: { bg: "#F4F5F7", fg: "#0E1420", sub: "#6B7383", line: "#E3E6EB" },
  white: { bg: "#FFFFFF", fg: "#0E1420", sub: "#6B7383", line: "#E3E6EB" },
  blue: { bg: "#006BFF", fg: "#FFFFFF", sub: "rgb(255 255 255 / 0.72)", line: "rgb(255 255 255 / 0.22)" },
  ink: { bg: "#0E1420", fg: "#FFFFFF", sub: "rgb(255 255 255 / 0.62)", line: "rgb(255 255 255 / 0.14)" },
};

/** Bento card with title, optional link arrow and a source line. */
export function Card({
  title,
  sub,
  tone = "white",
  href,
  source,
  sourceUrl,
  className = "",
  children,
}: {
  title: string;
  sub?: string;
  tone?: Tone;
  href?: string;
  source?: string;
  sourceUrl?: string;
  className?: string;
  children: ReactNode;
}) {
  const t = TONES[tone];
  return (
    <section className={`relative flex flex-col p-6 ${className}`} style={{ background: t.bg, color: t.fg, borderRadius: 20, border: tone === "white" ? `1px solid ${t.line}` : undefined }}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[19px] font-medium leading-tight tracking-[-0.01em]">{title}</h3>
          {sub && (
            <p className="mt-1 text-[13px]" style={{ color: t.sub }}>
              {sub}
            </p>
          )}
        </div>
        {href && (
          <a
            href={href}
            aria-label={`Mehr zu ${title}`}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center no-underline transition-colors"
            style={{ borderRadius: 10, background: tone === "white" || tone === "light" ? "#F4F5F7" : "rgb(255 255 255 / 0.14)", color: t.fg }}
          >
            <ArrowUpRight size={18} weight="regular" aria-hidden />
          </a>
        )}
      </header>
      <div className="mt-5 flex-1">{children}</div>
      {source && (
        <p className="mt-5 font-data text-[11px] uppercase tracking-[0.06em]" style={{ color: t.sub }}>
          Quelle:{" "}
          {sourceUrl ? (
            <a href={sourceUrl} target="_blank" rel="noopener nofollow" style={{ color: "inherit" }}>
              {source}
            </a>
          ) : (
            source
          )}
        </p>
      )}
    </section>
  );
}

/** Big number with a light secondary part, e.g. 26 % (the "%" softer), like the reference dashboards. */
export function BigNumber({ value, unit, tone = "white", size = 56 }: { value: string; unit?: string; tone?: Tone; size?: number }) {
  const t = TONES[tone];
  return (
    <p className="font-data font-medium leading-none tracking-[-0.03em]" style={{ fontSize: size }}>
      {value}
      {unit && <span style={{ color: t.sub }}>{unit}</span>}
    </p>
  );
}

/** Vertical bars, one highlighted bar with a value tag; others light (optionally hatched). */
export function HighlightBars({
  data,
  highlight,
  format = (v: number) => pct(v),
  height = 220,
  hatchOthers = false,
  tone = "white",
  ariaLabel,
}: {
  data: { label: string; value: number }[];
  highlight: number;
  format?: (v: number) => string;
  height?: number;
  hatchOthers?: boolean;
  tone?: Tone;
  ariaLabel: string;
}) {
  const t = TONES[tone];
  const W = 100 * data.length;
  const H = height;
  const top = 34;
  const bottom = 26;
  const max = Math.max(...data.map((d) => d.value)) * 1.08;
  const bw = 54;
  const id = `hatch-${ariaLabel.replace(/\W/g, "").slice(0, 12)}`;
  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${ariaLabel}: ${data.map((d) => `${d.label} ${format(d.value)}`).join(", ")}`}>
        <defs>
          <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="8" height="8" fill={tone === "white" || tone === "light" ? "#ECEEF1" : "rgb(255 255 255 / 0.12)"} />
            <line x1="0" y1="0" x2="0" y2="8" stroke={tone === "white" || tone === "light" ? "#C5CBD3" : "rgb(255 255 255 / 0.3)"} strokeWidth="3" />
          </pattern>
        </defs>
        {data.map((d, i) => {
          const h = ((H - top - bottom) * d.value) / max;
          const x = i * 100 + (100 - bw) / 2;
          const y = H - bottom - h;
          const on = i === highlight;
          return (
            <g key={d.label}>
              <rect
                x={x}
                y={y}
                width={bw}
                height={h}
                rx="10"
                fill={on ? (tone === "blue" ? "#FFFFFF" : "#006BFF") : hatchOthers ? `url(#${id})` : tone === "white" || tone === "light" ? "#E8EBF0" : "rgb(255 255 255 / 0.18)"}
              />
              {on && (
                <g>
                  <rect x={x - 12} y={y - 30} width={bw + 24} height={22} rx="6" fill={tone === "blue" ? "#0E1420" : "#0E1420"} />
                  <text x={x + bw / 2} y={y - 15} textAnchor="middle" fontSize="13" fill="#fff" fontFamily="var(--font-data)">
                    {format(d.value)}
                  </text>
                </g>
              )}
              {!on && (
                <text x={x + bw / 2} y={y - 8} textAnchor="middle" fontSize="12" fill={t.sub} fontFamily="var(--font-data)">
                  {format(d.value)}
                </text>
              )}
              <text x={x + bw / 2} y={H - 6} textAnchor="middle" fontSize="12" fill={t.sub} fontFamily="var(--font-sans)">
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

/** Semicircle gauge (0–100). */
export function Gauge({ value, label, tone = "white", size = 220 }: { value: number; label?: string; tone?: Tone; size?: number }) {
  const t = TONES[tone];
  const r = 80;
  const c = Math.PI * r;
  const frac = Math.max(0, Math.min(1, value / 100));
  return (
    <svg viewBox="0 0 200 116" width={size} className="mx-auto block h-auto max-w-full" role="img" aria-label={`${label ?? "Wert"}: ${pct(value)}`}>
      <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke={tone === "blue" ? "rgb(255 255 255 / 0.25)" : "#E8EBF0"} strokeWidth="16" strokeLinecap="round" />
      <path
        d="M20 100 A80 80 0 0 1 180 100"
        fill="none"
        stroke={tone === "blue" ? "#FFFFFF" : "#006BFF"}
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={`${c * frac} ${c}`}
      />
      <text x="100" y="88" textAnchor="middle" fontSize="34" fontWeight="500" fill={t.fg} fontFamily="var(--font-data)">
        {de(value)}
        <tspan fontSize="20" fill={t.sub}>
          {" "}%
        </tspan>
      </text>
      {label && (
        <text x="100" y="110" textAnchor="middle" fontSize="11" fill={t.sub} fontFamily="var(--font-data)" letterSpacing="0.06em">
          {label.toUpperCase()}
        </text>
      )}
    </svg>
  );
}

/** Horizontal ranked list with progress bars. */
export function RankBars({ data, format = (v: number) => pct(v), max = 100, tone = "white", accentFirst = true }: { data: { label: string; value: number }[]; format?: (v: number) => string; max?: number; tone?: Tone; accentFirst?: boolean }) {
  const t = TONES[tone];
  return (
    <ul className="space-y-3.5">
      {data.map((d, i) => (
        <li key={d.label}>
          <div className="flex items-baseline justify-between gap-4 text-[14px]">
            <span>{d.label}</span>
            <span className="font-data tabular-nums" style={{ color: t.sub }}>
              {format(d.value)}
            </span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden" style={{ background: tone === "white" || tone === "light" ? "#ECEEF1" : "rgb(255 255 255 / 0.15)", borderRadius: 4 }}>
            <div
              className="h-full"
              style={{ width: `${(d.value / max) * 100}%`, borderRadius: 4, background: accentFirst && i === 0 ? "#006BFF" : tone === "blue" ? "#FFFFFF" : "#7AB3FF" }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Heat grid: rows × columns of rounded squares, colour intensity by value (like a calendar heatmap). */
export function HeatGrid({
  cols,
  rows,
  format = (v: number) => pct(v),
  ariaLabel,
  invert = false,
  log = false,
}: {
  cols: string[];
  rows: { label: string; values: (number | null)[] }[];
  format?: (v: number) => string;
  ariaLabel: string;
  invert?: boolean;
  /** Logarithmic colour scale, useful when values span several orders of magnitude (e.g. prices). */
  log?: boolean;
}) {
  const tf = (v: number) => (log ? Math.log10(Math.max(v, 1)) : v);
  const all = rows.flatMap((r) => r.values.filter((v): v is number => v != null)).map(tf);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const shade = (raw: number) => {
    const v = tf(raw);
    let f = max === min ? 1 : (v - min) / (max - min);
    if (invert) f = 1 - f;
    // from light blue tint to brand blue
    const steps = ["#EBF3FF", "#D6E7FF", "#ADCFFF", "#7AB3FF", "#3D8FFF", "#006BFF", "#004796"];
    return steps[Math.min(steps.length - 1, Math.floor(f * (steps.length - 0.001)))];
  };
  const dark = (bg: string) => ["#3D8FFF", "#006BFF", "#004796"].includes(bg);
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate" style={{ borderSpacing: 6 }} aria-label={ariaLabel}>
        <thead>
          <tr>
            <th className="w-[38%]" />
            {cols.map((c) => (
              <th key={c} scope="col" className="pb-1 text-center font-data text-[11px] font-medium uppercase tracking-[0.06em] text-ink-500">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label}>
              <th scope="row" className="pr-2 text-left text-[14px] font-normal text-ink-950">
                {r.label}
              </th>
              {r.values.map((v, i) => {
                if (v == null)
                  return (
                    <td key={i} className="h-11 text-center font-data text-[12px] text-ink-500" style={{ borderRadius: 8, background: "repeating-linear-gradient(45deg,#F4F5F7 0 6px,#ECEEF1 6px 12px)" }}>
                      –
                    </td>
                  );
                const bg = shade(v);
                return (
                  <td key={i} className="h-11 min-w-[64px] text-center font-data text-[13px] tabular-nums" style={{ background: bg, color: dark(bg) ? "#FFFFFF" : "#0E1420", borderRadius: 8 }}>
                    {format(v)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 100 % split bars (e.g. SME vs. large enterprises). */
export function SplitBars({ data, labels }: { data: { label: string; a: number; b: number }[]; labels: [string, string] }) {
  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-5 text-[13px] text-ink-700">
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3" style={{ background: "#006BFF", borderRadius: 3 }} aria-hidden /> {labels[0]}
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block h-3 w-3" style={{ background: "repeating-linear-gradient(45deg,#ECEEF1 0 3px,#C5CBD3 3px 5px)", borderRadius: 3 }} aria-hidden /> {labels[1]}
        </li>
      </ul>
      <ul className="space-y-4">
        {data.map((d) => (
          <li key={d.label}>
            <div className="mb-1.5 flex justify-between text-[14px]">
              <span>{d.label}</span>
              <span className="font-data tabular-nums text-ink-500">
                {pct(d.a, 1)} / {pct(d.b, 1)}
              </span>
            </div>
            <div className="flex h-9 overflow-hidden" style={{ borderRadius: 8 }} role="img" aria-label={`${d.label}: ${labels[0]} ${pct(d.a, 1)}, ${labels[1]} ${pct(d.b, 1)}`}>
              <div className="flex items-center px-3 font-data text-[12px] text-white" style={{ width: `${d.a}%`, background: "#006BFF", minWidth: d.a > 4 ? undefined : 6 }}>
                {d.a >= 12 ? pct(d.a, 1) : ""}
              </div>
              <div className="flex flex-1 items-center justify-end px-3 font-data text-[12px] text-ink-700" style={{ background: "repeating-linear-gradient(45deg,#ECEEF1 0 6px,#DDE1E7 6px 10px)" }}>
                {d.b >= 12 ? pct(d.b, 1) : ""}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small stacked "dot" mini-legend rows for a breakdown inside a hero card. */
export function MiniStats({ items, tone = "white" }: { items: { label: string; value: string }[]; tone?: Tone }) {
  const t = TONES[tone];
  return (
    <dl className="grid grid-cols-3 gap-3">
      {items.map((i, k) => (
        <div key={i.label}>
          <dt className="flex items-center gap-1.5 text-[12px]" style={{ color: t.sub }}>
            <span aria-hidden className="inline-block h-2 w-2" style={{ background: ["#FFFFFF", "#ADCFFF", "#0AE8F0"][k % 3], borderRadius: 2 }} />
            {i.label}
          </dt>
          <dd className="mt-1 font-data text-[22px] font-medium tabular-nums">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}
