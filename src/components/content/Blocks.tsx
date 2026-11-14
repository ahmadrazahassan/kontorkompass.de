import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarCheck, Info, WarningCircle, BookOpenText } from "@phosphor-icons/react/dist/ssr";
import type { Doc, Software } from "@/content/data";
import { getCategories, getSourcesByNumber, hasActiveAffiliateLinks } from "@/lib/cms";
import { formatDate, formatDateShort, formatEur, formatMonthYear } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Thumbnail } from "@/components/ui/Thumbnail";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { checkScore } from "@/lib/pricing";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`t-eyebrow ${className}`}>{children}</p>;
}

export function SectionHeading({ eyebrow, title, lead, action }: { eyebrow: string; title: string; lead?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="max-w-2xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="t-h2 mt-3">{title}</h2>
        <div aria-hidden className="mt-5 h-3 w-24 border-b-2 border-l-2 border-ink-950/25" />
        {lead && <p className="t-lead mt-5">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Brotkrumen" className="t-eyebrow flex flex-wrap items-center gap-2">
      {items.map((it, i) => (
        <span key={i} className="flex items-center gap-2">
          {it.href ? (
            <Link href={it.href} className="no-underline hover:text-ink-950">
              {it.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-ink-950">
              {it.label}
            </span>
          )}
          {i < items.length - 1 && <span aria-hidden>/</span>}
        </span>
      ))}
    </nav>
  );
}

/** Renders nothing while no partner programme is active, so plain editorial links are never labelled as ads. */
export async function AffiliateDisclosure() {
  if (!(await hasActiveAffiliateLinks())) return null;
  return (
    <aside className="flex gap-3 rounded-[12px] bg-surface-1 p-4 text-[14px] leading-relaxed text-ink-700">
      <Info size={20} weight="regular" aria-hidden className="mt-0.5 shrink-0 text-brand-700" />
      <p>
        <strong className="font-medium text-ink-950">Hinweis:</strong> Dieser Beitrag enthält Werbelinks (mit * gekennzeichnet). Wenn Sie über einen solchen Link
        einen Vertrag abschließen, erhalten wir gegebenenfalls eine Provision. Für Sie entstehen keine Mehrkosten. Unsere Inhalte und Einschätzungen bleiben davon
        unabhängig. <Link href="/transparenz">So finanzieren wir uns</Link>
      </p>
    </aside>
  );
}

export function Callout({ kind = "info", title, children }: { kind?: "info" | "tip" | "warn" | "legal"; title: string; children: ReactNode }) {
  const styles = {
    info: "bg-brand-50 border-brand-500",
    tip: "bg-brand-50 border-brand-700",
    warn: "bg-[#fdf3e6] border-warning",
    legal: "bg-surface-1 border-ink-950",
  }[kind];
  return (
    <aside className={`my-8 rounded-[12px] border-l-[3px] p-5 ${styles}`}>
      <p className="mb-1 flex items-center gap-2 font-medium text-ink-950">
        {kind === "warn" ? <WarningCircle size={20} weight="regular" aria-hidden /> : <Info size={20} weight="regular" aria-hidden />}
        {title}
      </p>
      <div className="text-[16px] leading-relaxed text-ink-700 [&>p+p]:mt-2">{children}</div>
    </aside>
  );
}

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="kurz" className="rounded-[12px] border-l-[3px] border-brand-500 bg-surface-1 p-6">
      <h2 id="kurz" className="t-h3">
        Das Wichtigste in Kürze
      </h2>
      <ul className="mt-4 list-[square] space-y-2.5 pl-5 text-ink-700 marker:text-brand-500">
        {items.map((t, i) => {
          const [head, ...rest] = t.split(": ");
          return rest.length ? (
            <li key={i}>
              <strong className="font-semibold text-ink-950">{head}:</strong> {rest.join(": ")}
            </li>
          ) : (
            <li key={i}>{t}</li>
          );
        })}
      </ul>
    </section>
  );
}

/** Month of the last price check (user decision 2026-11-14: month on prices only, no other visible dates). */
export function StandStamp({ date }: { date: string }) {
  if (!date) return null;
  return (
    <p className="t-eyebrow flex items-center gap-2">
      <CalendarCheck size={18} weight="regular" aria-hidden />
      Preise geprüft: {formatMonthYear(date)}
    </p>
  );
}

export async function SourcesList({ ids }: { ids: number[] }) {
  const list = await getSourcesByNumber(ids);
  return (
    <section aria-labelledby="quellen" className="mt-14 border-t border-line pt-8">
      <h2 id="quellen" className="t-h3 flex items-center gap-2" style={{ marginTop: 0 }}>
        <BookOpenText size={24} weight="regular" aria-hidden /> Quellen
      </h2>
      <ol className="mt-4 list-decimal space-y-3 pl-6 text-[15px] leading-relaxed text-ink-700">
        {list.map((s) => (
          <li key={s.id} id={`q${s.id}`} value={s.id}>
            {s.publisher}: „{s.title}“.{" "}
            <a href={s.url} rel="nofollow noopener" target="_blank" className="break-all">
              {s.url}
            </a>{" "}

          </li>
        ))}
      </ol>
    </section>
  );
}

export function Cite({ n }: { n: number[] }) {
  return (
    <sup>
      {n.map((i, k) => (
        <a key={i} href={`#q${i}`} aria-label={`Quelle ${i}`}>
          {k > 0 ? "," : ""}[{i}]
        </a>
      ))}
    </sup>
  );
}

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="border-t border-line">
      {items.map((f, i) => (
        <details key={i} className="group border-b border-line py-5">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-display text-[19px] font-semibold text-ink-950">
            {f.q}
            <span aria-hidden className="mt-1 text-brand-500 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 max-w-[62ch] text-ink-700">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export async function GuideCard({ doc, variant = "standard" }: { doc: Doc; variant?: "featured" | "standard" | "horizontal" }) {
  const CATEGORIES = await getCategories();
  const cat = CATEGORIES.find((c) => c.slug === doc.category);
  const href = `/${doc.kind}/${doc.slug}`;
  const meta = (
    <p className="t-eyebrow">
      {doc.kind === "ratgeber" ? "Ratgeber" : "Magazin"} · {doc.readingMinutes} Min. Lesezeit
    </p>
  );
  if (variant === "horizontal") {
    return (
      <Link href={href} className="card grid grid-cols-[1fr_140px] gap-5 border border-line p-5 no-underline sm:grid-cols-[1fr_200px]" style={{ borderRadius: 12 }}>
        <div className="flex flex-col justify-between gap-4">
          <div>
            {meta}
            <h3 className="card-title t-h3 mt-2 !text-[20px]">{doc.title}</h3>
          </div>
          <span className="text-[14px] text-ink-500">{cat?.name}</span>
        </div>
        <div className="card-img relative h-full min-h-[120px] overflow-hidden">
          <Thumbnail doc={doc} categoryName={cat?.name} sizes="200px" compact />
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} className="card block no-underline">
      <div className="card-img relative aspect-[16/10] overflow-hidden">
        <Thumbnail doc={doc} categoryName={cat?.name} sizes={variant === "featured" ? "(min-width: 1024px) 800px, 100vw" : "(min-width: 1024px) 420px, (min-width: 768px) 50vw, 100vw"} />
      </div>
      <div className="mt-5">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-[4px] border border-line px-2 py-0.5 font-data text-[12px] uppercase tracking-wider text-ink-700">
            {variant === "featured" ? "Neu" : cat?.name}
          </span>
          {meta}
        </div>
        <h3 className={`card-title ${variant === "featured" ? "t-h2" : "t-h3"}`}>{doc.title}</h3>
        <p className="mt-3 max-w-[60ch] text-ink-700">{doc.description}</p>
        <span className="link-arrow mt-4">Weiterlesen →</span>
      </div>
    </Link>
  );
}

export function StatRow({ value, label, source, delta }: { value: string; label: string; source: string; delta?: string }) {
  return (
    <div className="border-t border-white/20 py-6">
      <div className="flex items-baseline justify-between gap-4">
        <span className="t-stat">{value}</span>
        {delta && <span className="font-data text-[14px] text-accent">{delta}</span>}
      </div>
      <p className="mt-3 flex items-start gap-2 text-[16px] text-white/90">
        <span aria-hidden className="mt-2 inline-block h-2 w-2 shrink-0 bg-accent" />
        {label}
      </p>
      <p className="mt-1 pl-4 font-data text-[12px] uppercase tracking-wider text-white/60">Quelle: {source}</p>
    </div>
  );
}

export async function SoftwareTable({ items, showCta = true }: { items: Software[]; showCta?: boolean }) {
  const CATEGORIES = await getCategories();
  const categoryBySlug = (slug: string) => CATEGORIES.find((c) => c.slug === slug);
  return (
    <div className="table-wrap">
      <table className="data-table">
        <caption className="sr-only">Software im Überblick (Preise zzgl. MwSt.)</caption>
        <thead>
          <tr>
            <th scope="col">Software</th>
            <th scope="col">Kategorie</th>
            <th scope="col">Einstiegspreis / Monat</th>
            <th scope="col">Prüfkriterien</th>
            <th scope="col">Testphase</th>
            {showCta && <th scope="col"><span className="sr-only">Profil</span></th>}
          </tr>
        </thead>
        <tbody>
          {items.map((s) => (
            <tr key={s.slug}>
              <th scope="row" className="!bg-transparent !text-[16px] !normal-case !tracking-normal text-ink-950" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
                <span className="flex items-center gap-4">
                  <span className="flex w-[96px] shrink-0 items-center">
                    <PartnerLogo slug={s.slug} height={20} maxWidth={92} tile={false} />
                  </span>
                  <span>
                    {s.name}
                    <span className="block text-[13px] font-normal text-ink-500" style={{ fontFamily: "var(--font-sans)" }}>
                      {s.vendor}
                    </span>
                  </span>
                </span>
              </th>
              <td>{s.categories.map((c) => categoryBySlug(c)?.name).filter(Boolean).slice(0, 2).join(", ")}</td>
              <td>
                {s.entryPrice === null ? "auf Anfrage" : s.entryPrice === 0 ? "0 € (eingeschränkt)" : `ab ${formatEur(s.entryPrice)}`}
                <span className="block text-[13px] text-ink-500">zzgl. MwSt.</span>
              </td>
              <td className="whitespace-nowrap font-data">{s.checks?.length ? `${checkScore(s.checks).score} / 100` : "–"}</td>
              <td>{s.trial}</td>
              {showCta && (
                <td className="text-right">
                  <Button href={`/software/${s.slug}`} variant="outline" size="sm">
                    Zum Test
                  </Button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="border-t border-line px-5 py-3 text-[13px] text-ink-500">
        Preise laut Anbieter, zzgl. MwSt. Prüfkriterien: Anteil belegter Kriterien, siehe Methodik.
      </p>
    </div>
  );
}

export function PriceBars({ items, title, takeaway, source }: { items: { label: string; value: number }[]; title: string; takeaway: string; source: string }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <figure className="my-8 rounded-[12px] border border-line p-6">
      <figcaption>
        <p className="t-h3 !text-[19px]">{title}</p>
        <p className="mt-1 text-[15px] text-ink-700">{takeaway}</p>
      </figcaption>
      <div role="img" aria-label={`${title}: ${items.map((i) => `${i.label} ${formatEur(i.value)}`).join(", ")}`} className="mt-6 space-y-3">
        {items.map((i, k) => (
          <div key={i.label} className="grid grid-cols-[150px_1fr_72px] items-center gap-3 text-[14px] sm:grid-cols-[190px_1fr_80px]">
            <span className="truncate text-ink-700">{i.label}</span>
            <span className="block h-5 bg-surface-1">
              <span className="block h-5" style={{ width: `${(i.value / max) * 100}%`, background: k % 2 ? "var(--color-brand-700)" : "var(--color-brand-500)" }} />
            </span>
            <span className="tabular text-right font-data">{formatEur(i.value)}</span>
          </div>
        ))}
      </div>
      <p className="t-eyebrow mt-5">Quelle: {source}</p>
    </figure>
  );
}

// Internal review note. Hidden on the live site unless SHOW_EDITORIAL_NOTES=1.
export function EditorNote({ children }: { children: ReactNode }) {
  if (process.env.SHOW_EDITORIAL_NOTES !== "1") return null;
  return (
    <aside className="my-8 rounded-[12px] border border-dashed border-warning bg-[#fdf3e6] p-5 text-[15px] text-ink-700">
      <p className="t-eyebrow mb-1 !text-warning">Interner Prüfhinweis (nicht live)</p>
      {children}
    </aside>
  );
}

export { formatDate };
