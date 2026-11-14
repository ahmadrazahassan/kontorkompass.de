// Server-rendered SVG charts in brand colours. Each chart has a title, a takeaway, a source line
// and a data table for screen readers ("Daten als Tabelle").
import type { ReactNode } from "react";
import { formatEur } from "@/lib/format";

export const SERIES = ["#006BFF", "#004796", "#7AB3FF", "#0AE8F0", "#00254F", "#3D8FFF"];
const GRID = "#E3E6EB";
const AXIS = "#6B7383";

function Frame({ title, takeaway, source, children, table }: { title: string; takeaway?: string; source: string; children: ReactNode; table: ReactNode }) {
  return (
    <figure className="my-8 rounded-[12px] border border-line p-5 sm:p-6">
      <figcaption>
        <p className="t-h3 !text-[19px]">{title}</p>
        {takeaway && <p className="mt-1 text-[15px] text-ink-700">{takeaway}</p>}
      </figcaption>
      <div className="mt-5">{children}</div>
      <details className="mt-4 text-[14px]">
        <summary className="cursor-pointer text-ink-500">Daten als Tabelle</summary>
        <div className="mt-3 overflow-x-auto">{table}</div>
      </details>
      <p className="t-eyebrow mt-4">Quelle: {source}</p>
    </figure>
  );
}

const fmt = (v: number) => formatEur(v);

/* ---------------- Horizontal bar chart (optionally grouped) ---------------- */
export function BarChart({
  title,
  takeaway,
  source,
  categories,
  series,
  valueFormat = fmt,
}: {
  title: string;
  takeaway?: string;
  source: string;
  categories: string[];
  series: { name: string; values: (number | null)[] }[];
  valueFormat?: (v: number) => string;
}) {
  const max = Math.max(1, ...series.flatMap((s) => s.values.filter((v): v is number => v != null)));
  const barH = 18;
  const gap = 6;
  const groupGap = 18;
  const labelW = 170;
  const valueW = 90;
  const W = 720;
  const plotW = W - labelW - valueW;
  const groupH = series.length * barH + (series.length - 1) * gap;
  const H = categories.length * (groupH + groupGap) - groupGap + 4;
  return (
    <Frame
      title={title}
      takeaway={takeaway}
      source={source}
      table={
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Kategorie</th>
              {series.map((s) => (
                <th key={s.name} scope="col">{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((c, i) => (
              <tr key={c}>
                <td>{c}</td>
                {series.map((s) => (
                  <td key={s.name}>{s.values[i] == null ? "–" : valueFormat(s.values[i] as number)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      {series.length > 1 && <Legend items={series.map((s, i) => ({ label: s.name, color: SERIES[i % SERIES.length] }))} />}
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={title}>
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line key={t} x1={labelW + plotW * t} x2={labelW + plotW * t} y1={0} y2={H} stroke={GRID} strokeDasharray="3 3" />
        ))}
        {categories.map((c, ci) => {
          const y0 = ci * (groupH + groupGap);
          return (
            <g key={c}>
              <text x={labelW - 10} y={y0 + groupH / 2 + 5} textAnchor="end" fontSize="14" fill="#0E1420" fontFamily="var(--font-sans)">
                {c.length > 24 ? c.slice(0, 23) + "…" : c}
              </text>
              {series.map((s, si) => {
                const v = s.values[ci];
                const y = y0 + si * (barH + gap);
                return (
                  <g key={s.name}>
                    <rect x={labelW} y={y} width={plotW} height={barH} fill="#F4F5F7" />
                    {v != null && <rect x={labelW} y={y} width={Math.max(2, (v / max) * plotW)} height={barH} fill={SERIES[si % SERIES.length]} />}
                    <text x={W - 4} y={y + barH - 4} textAnchor="end" fontSize="13" fill={AXIS} fontFamily="var(--font-data)">
                      {v == null ? "–" : valueFormat(v)}
                    </text>
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

/* ---------------- Line chart ---------------- */
export function LineChart({
  title,
  takeaway,
  source,
  xLabel,
  xs,
  series,
}: {
  title: string;
  takeaway?: string;
  source: string;
  xLabel: string;
  xs: number[];
  series: { name: string; values: (number | null)[] }[];
}) {
  const W = 720;
  const H = 320;
  const pad = { l: 64, r: 16, t: 12, b: 44 };
  const pw = W - pad.l - pad.r;
  const ph = H - pad.t - pad.b;
  const max = niceMax(Math.max(1, ...series.flatMap((s) => s.values.filter((v): v is number => v != null))));
  const xPos = (i: number) => pad.l + (xs.length === 1 ? pw / 2 : (i / (xs.length - 1)) * pw);
  const yPos = (v: number) => pad.t + ph - (v / max) * ph;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max);
  return (
    <Frame
      title={title}
      takeaway={takeaway}
      source={source}
      table={
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{xLabel}</th>
              {series.map((s) => (
                <th key={s.name} scope="col">{s.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {xs.map((x, i) => (
              <tr key={x}>
                <td>{x}</td>
                {series.map((s) => (
                  <td key={s.name}>{s.values[i] == null ? "–" : fmt(s.values[i] as number)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <Legend items={series.map((s, i) => ({ label: s.name, color: SERIES[i % SERIES.length] }))} />
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={title}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.l} x2={W - pad.r} y1={yPos(t)} y2={yPos(t)} stroke={GRID} />
            <text x={pad.l - 8} y={yPos(t) + 4} textAnchor="end" fontSize="12" fill={AXIS} fontFamily="var(--font-data)">
              {formatEur(Math.round(t))}
            </text>
          </g>
        ))}
        {xs.map((x, i) => (
          <text key={x} x={xPos(i)} y={H - pad.b + 20} textAnchor="middle" fontSize="12" fill={AXIS} fontFamily="var(--font-data)">
            {x}
          </text>
        ))}
        <text x={pad.l + pw / 2} y={H - 4} textAnchor="middle" fontSize="12" fill={AXIS} fontFamily="var(--font-data)">
          {xLabel.toUpperCase()}
        </text>
        {series.map((s, si) => {
          const pts = s.values.map((v, i) => (v == null ? null : [xPos(i), yPos(v)] as const)).filter(Boolean) as [number, number][];
          const color = SERIES[si % SERIES.length];
          return (
            <g key={s.name}>
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
              {pts.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#fff" stroke={color} strokeWidth="2" />
              ))}
            </g>
          );
        })}
      </svg>
    </Frame>
  );
}

/* ---------------- Donut / pie chart ---------------- */
export function DonutChart({
  title,
  takeaway,
  source,
  slices,
  center,
  centerSub,
  valueFormat = fmt,
}: {
  title: string;
  takeaway?: string;
  source: string;
  slices: { label: string; value: number; color?: string }[];
  center?: string;
  centerSub?: string;
  valueFormat?: (v: number) => string;
}) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const R = 90;
  const r = 58;
  const C = 110;
  let angle = -Math.PI / 2;
  const arcs = slices
    .filter((s) => s.value > 0)
    .map((s, i) => {
      const frac = s.value / total;
      const a0 = angle;
      const a1 = angle + frac * Math.PI * 2;
      angle = a1;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const p = (rad: number, a: number) => [C + rad * Math.cos(a), C + rad * Math.sin(a)];
      const [x0, y0] = p(R, a0);
      const [x1, y1] = p(R, a1 - (frac === 1 ? 0.0001 : 0));
      const [x2, y2] = p(r, a1 - (frac === 1 ? 0.0001 : 0));
      const [x3, y3] = p(r, a0);
      const d = `M${x0} ${y0}A${R} ${R} 0 ${large} 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 ${large} 0 ${x3} ${y3}Z`;
      return { d, color: s.color ?? SERIES[i % SERIES.length], ...s, frac };
    });
  return (
    <Frame
      title={title}
      takeaway={takeaway}
      source={source}
      table={
        <table className="data-table">
          <tbody>
            {slices.map((s) => (
              <tr key={s.label}>
                <td>{s.label}</td>
                <td>{valueFormat(s.value)}</td>
                <td>{Math.round((s.value / total) * 100)} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    >
      <div className="grid items-center gap-6 sm:grid-cols-[220px_1fr]">
        <svg viewBox="0 0 220 220" className="mx-auto h-auto w-[200px]" role="img" aria-label={title}>
          {arcs.map((a) => (
            <path key={a.label} d={a.d} fill={a.color} stroke="#fff" strokeWidth="2" />
          ))}
          {center && (
            <text x={C} y={C + (centerSub ? 2 : 8)} textAnchor="middle" fontSize="26" fontWeight="500" fill="#0E1420" fontFamily="var(--font-data)">
              {center}
            </text>
          )}
          {centerSub && (
            <text x={C} y={C + 24} textAnchor="middle" fontSize="11" fill={AXIS} fontFamily="var(--font-data)">
              {centerSub.toUpperCase()}
            </text>
          )}
        </svg>
        <ul className="space-y-2.5 text-[15px]">
          {arcs.map((a) => (
            <li key={a.label} className="flex items-baseline justify-between gap-4 border-b border-line pb-2">
              <span className="flex items-center gap-2">
                <span aria-hidden className="inline-block h-3 w-3 shrink-0" style={{ background: a.color }} />
                {a.label}
              </span>
              <span className="tabular whitespace-nowrap font-data text-ink-700">
                {valueFormat(a.value)} · {Math.round(a.frac * 100)} %
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Frame>
  );
}

function Legend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-ink-700">
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-2">
          <span aria-hidden className="inline-block h-[3px] w-5" style={{ background: i.color }} />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

function niceMax(v: number) {
  const exp = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / exp;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * exp;
}
