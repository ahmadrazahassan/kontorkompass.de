import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/content/Blocks";
import { BigNumber, Card, Gauge, HeatGrid, HighlightBars, MiniStats, RankBars, SplitBars, pct } from "@/components/dashboard/Dash";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import {
  CLOUD_BY_SIZE,
  CLOUD_SECTORS,
  CLOUD_SERVICES,
  CLOUD_TOTAL,
  KI_BY_SIZE,
  KI_HURDLES,
  KI_TECH,
  KI_TREND,
  KI_USES,
  KMU_CLASSES,
  KMU_SPLIT,
  KMU_TURNOVER_SECTORS,
  SRC,
} from "@/content/marketData";
import { getSoftwareList } from "@/lib/cms";
import { formatEur } from "@/lib/format";
import { checkScore, planCost } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Marktdaten: Mittelstand, KI, Cloud und Software-Preise in Zahlen",
  description:
    "Aktuelle Zahlen zum deutschen Mittelstand: KI-Nutzung, Cloud-Einsatz und Unternehmensstruktur laut Destatis, dazu Preis- und Kostenanalysen für Business-Software.",
  alternates: { canonical: "/marktdaten" },
};

const TABS = [
  ["ueberblick", "Überblick"],
  ["ki", "Künstliche Intelligenz"],
  ["cloud", "Cloud"],
  ["mittelstand", "Mittelstand"],
  ["software", "Software-Preise"],
] as const;

const TEAM = [1, 5, 10, 25, 50];

export default async function Page() {
  const software = await getSoftwareList();
  const find = (slug: string, plan: string) => {
    const s = software.find((x) => x.slug === slug);
    const p = s?.plans.find((x) => x.name === plan);
    return s && p ? { s, p } : null;
  };
  const row = (slug: string, plan: string, label: string) => {
    const f = find(slug, plan);
    if (!f) return null;
    return { label, slug, values: TEAM.map((n) => planCost(f.p, n, f.s.scenarioBasis)?.total ?? null) };
  };
  const byUsers = [
    row("sevdesk", "Buchhaltung", "sevdesk Buchhaltung"),
    row("sage-active", "Starter", "Sage Active Starter"),
    row("sage-active", "Essentials", "Sage Active Essentials"),
    row("weclapp", "ERP Starter", "weclapp ERP Starter"),
    row("sage-100", "Modul Warenwirtschaft", "Sage 100 Warenwirtschaft"),
    row("weclapp", "ERP Dienstleistung", "weclapp ERP Dienstleistung"),
  ].filter(Boolean) as { label: string; slug: string; values: (number | null)[] }[];
  const byEmployees = [
    row("sage-lohnabrechnung", "Payroll Essentials", "Sage Lohnabrechnung Essentials"),
    row("sage-lohnabrechnung", "Payroll Standard", "Sage Lohnabrechnung Standard"),
    row("sage-lohnabrechnung", "Payroll Premium", "Sage Lohnabrechnung Premium"),
    row("personio", "Core", "Personio Core"),
  ].filter(Boolean) as { label: string; slug: string; values: (number | null)[] }[];

  const entry = software
    .map((s) => {
      const p = s.plans.find((x) => (x.monthlyNet ?? 0) > 0);
      const unit = p?.unit === "perUser" ? " · je Nutzer" : p?.unit === "perEmployee" ? " · je Beschäftigte" : "";
      return { label: s.name + unit, slug: s.slug, value: p?.monthlyNet ?? null };
    })
    .filter((x): x is { label: string; slug: string; value: number } => x.value != null)
    .sort((a, b) => a.value - b.value);
  const scores = software.filter((s) => s.checks?.length).map((s) => ({ s, ...checkScore(s.checks!) })).sort((a, b) => b.score - a.score);
  const eur = (v: number) => formatEur(v);

  return (
    <div className="bg-surface-1 pb-24">
      {/* Header */}
      <div className="container-page pt-8 lg:pt-12">
        <Breadcrumbs items={[{ label: "Startseite", href: "/" }, { label: "Marktdaten" }]} />
        <div className="mt-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="t-eyebrow">Marktdaten · Dashboard</p>
            <h1 className="t-display mt-4 !text-[clamp(38px,5vw,64px)]">Mittelstand und Software in Zahlen</h1>
            <p className="t-lead mt-5 max-w-[60ch]">
              Wie digital ist der deutsche Mittelstand? Amtliche Zahlen zu KI, Cloud und Unternehmensstruktur, dazu unsere Kostenanalysen für Business-Software.
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 text-[13px]">
            {["Destatis IKT-Erhebung 2025", "Destatis KMU-Statistik 2024", "Anbieterpreise 11/2026"].map((t) => (
              <li key={t} className="border border-line bg-white px-3 py-2 text-ink-700" style={{ borderRadius: 6 }}>
                {t}
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Bereiche" className="mt-10 overflow-x-auto">
          <ul className="flex gap-2 whitespace-nowrap">
            {TABS.map(([id, label], i) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="inline-flex h-10 items-center px-4 text-[14px] font-medium no-underline"
                  style={{ borderRadius: 8, background: i === 0 ? "#0E1420" : "#FFFFFF", color: i === 0 ? "#FFFFFF" : "#0E1420", border: i === 0 ? undefined : "1px solid #E3E6EB" }}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-page mt-8 space-y-16">
        {/* ÜBERBLICK */}
        <section id="ueberblick" aria-label="Überblick" className="scroll-mt-28">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Card
              title="KI im Mittelstand"
              sub="Anteil der Unternehmen ab 10 Beschäftigten, die KI nutzen (2025)"
              tone="blue"
              href="#ki"
              source="Destatis"
              sourceUrl={SRC.kiTable.url}
              className="lg:col-span-5 lg:row-span-2"
            >
              <BigNumber value="26" unit=" %" tone="blue" size={88} />
              <p className="mt-3 max-w-[34ch] text-[15px]" style={{ color: "rgb(255 255 255 / 0.8)" }}>
                Mehr als doppelt so viele wie 2023. Große Unternehmen liegen deutlich vorn.
              </p>
              <div className="mt-8">
                <MiniStats
                  tone="blue"
                  items={KI_BY_SIZE.map((k) => ({ label: `${k.label} Besch.`, value: pct(k.y2025) }))}
                />
              </div>
              <div className="mt-8">
                <Gauge value={57} label="Großunternehmen" tone="blue" size={260} />
              </div>
            </Card>

            <div className="grid min-w-0 grid-cols-1 gap-4 lg:col-span-7">
              <Card title="KI-Nutzung seit 2021" sub="Anteil der Unternehmen in % (2022 nicht erhoben)" source="Destatis 2024 und 2025" sourceUrl={SRC.ki2024.url}>
                <HighlightBars data={KI_TREND} highlight={KI_TREND.length - 1} hatchOthers ariaLabel="KI-Nutzung in Unternehmen" height={200} />
              </Card>
              <div className="grid gap-4 sm:grid-cols-3">
                <Card title="Cloud" sub="nutzen kostenpflichtige Cloud-Dienste" tone="ink" source="Destatis 2025" sourceUrl={SRC.cloud2025.url}>
                  <BigNumber value={String(CLOUD_TOTAL)} unit=" %" tone="ink" size={48} />
                </Card>
                <Card title="KMU-Anteil" sub="an allen Unternehmen" source="Destatis 2024" sourceUrl={SRC.kmu2024.url}>
                  <BigNumber value="99,3" unit=" %" size={48} />
                </Card>
                <Card title="Beschäftigte" sub="arbeiten in KMU" source="Destatis 2024" sourceUrl={SRC.kmu2024.url}>
                  <BigNumber value="53,7" unit=" %" size={48} />
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* KI */}
        <section id="ki" aria-labelledby="ki-h" className="scroll-mt-28">
          <SectionTitle id="ki-h" eyebrow="Künstliche Intelligenz" title="Wie Unternehmen KI einsetzen" />
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Card
              title="KI-Technologien nach Unternehmensgröße"
              sub="in % der KI-nutzenden Unternehmen, 2025 · dunkler = höherer Anteil"
              source="Destatis"
              sourceUrl={SRC.kiTable.url}
              className="lg:col-span-7"
            >
              <HeatGrid cols={KI_TECH.cols} rows={KI_TECH.rows} ariaLabel="KI-Technologien nach Unternehmensgröße" />
            </Card>
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:col-span-5">
              <Card title="KI nach Größenklasse" sub="Anteil 2025 in %, Beschäftigte" source="Destatis 2025" sourceUrl={SRC.kiTable.url}>
                <HighlightBars data={KI_BY_SIZE.map((k) => ({ label: k.label, value: k.y2025 }))} highlight={2} ariaLabel="KI-Nutzung nach Größenklasse 2025" height={180} />
                <p className="mt-2 text-[13px] text-ink-500">
                  Zuwachs gegenüber 2024: {KI_BY_SIZE.map((k) => `${k.label}: +${k.y2025 - k.y2024} Pp.`).join(" · ")}
                </p>
              </Card>
              <Card title="Wofür KI genutzt wird" sub="in % der KI-Nutzer, 2024" source="Destatis, PM Nr. 444" sourceUrl={SRC.ki2024.url}>
                <RankBars data={KI_USES} max={50} />
              </Card>
            </div>
            <Card
              title="Was Unternehmen von KI abhält"
              sub="Gründe in % der Nicht-Nutzer, die KI erwogen haben, 2024"
              tone="light"
              source="Destatis, PM Nr. 444"
              sourceUrl={SRC.ki2024.url}
              className="lg:col-span-12"
            >
              <div className="grid gap-x-10 md:grid-cols-2">
                <RankBars data={KI_HURDLES.slice(0, 4)} />
                <div className="mt-3.5 md:mt-0">
                  <RankBars data={KI_HURDLES.slice(4)} accentFirst={false} />
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* CLOUD */}
        <section id="cloud" aria-labelledby="cloud-h" className="scroll-mt-28">
          <SectionTitle id="cloud-h" eyebrow="Cloud" title="Jedes zweite Unternehmen nutzt die Cloud" />
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Card title="Cloud-Nutzung gesamt" sub="kostenpflichtige Cloud-Dienste, Unternehmen ab 10 Beschäftigten, 2025" tone="ink" source="Destatis, PM Nr. 416" sourceUrl={SRC.cloud2025.url} className="lg:col-span-4">
              <div className="flex h-full flex-col justify-between gap-6">
                <BigNumber value={String(CLOUD_TOTAL)} unit=" %" tone="ink" size={80} />
                <ul className="space-y-2 text-[14px]">
                  {CLOUD_SECTORS.map((s) => (
                    <li key={s.label} className="flex justify-between gap-4 border-t pt-2" style={{ borderColor: "rgb(255 255 255 / 0.14)" }}>
                      <span style={{ color: "rgb(255 255 255 / 0.75)" }}>{s.label}</span>
                      <span className="font-data">{pct(s.value)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
            <Card title="Nach Größenklasse" sub="Anteil in %, Beschäftigte" source="Destatis, PM Nr. 416" sourceUrl={SRC.cloud2025.url} className="lg:col-span-4">
              <HighlightBars data={CLOUD_BY_SIZE} highlight={2} hatchOthers ariaLabel="Cloud-Nutzung nach Größenklasse" height={200} />
            </Card>
            <Card title="Genutzte Cloud-Dienste" sub="in % der Cloud-Nutzer, 2025" source="Destatis, PM Nr. 416" sourceUrl={SRC.cloud2025.url} className="lg:col-span-4">
              <RankBars data={CLOUD_SERVICES} />
              <p className="mt-4 text-[13px] text-ink-500">
                ERP und CRM aus der Cloud nutzt bislang knapp jedes vierte Cloud-Unternehmen. Hier liegt das größte Wachstumspotenzial für Business-Software.
              </p>
            </Card>
          </div>
        </section>

        {/* MITTELSTAND */}
        <section id="mittelstand" aria-labelledby="mit-h" className="scroll-mt-28">
          <SectionTitle id="mit-h" eyebrow="Mittelstand" title="Die Struktur der deutschen Wirtschaft" />
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Card
              title="KMU und Großunternehmen im Vergleich"
              sub="Anteile in %, 2024 (Wirtschaftsabschnitte B bis S)"
              source="Destatis"
              sourceUrl={SRC.kmu2024.url}
              className="lg:col-span-7"
            >
              <SplitBars data={KMU_SPLIT.map((k) => ({ label: k.label, a: k.kmu, b: k.gross }))} labels={["KMU", "Großunternehmen"]} />
            </Card>
            <div className="grid min-w-0 grid-cols-1 gap-4 lg:col-span-5">
              <Card title="Unternehmen nach Größe" sub="Anteil an allen Unternehmen in %, 2024" source="Destatis 2024" sourceUrl={SRC.kmu2024.url}>
                <RankBars data={KMU_CLASSES} format={(v) => pct(v, 1)} />
              </Card>
              <Card title="KMU-Anteil am Umsatz nach Branche" sub="2024, ausgewählte Branchen" tone="light" source="Destatis 2024" sourceUrl={SRC.kmuUmsatz.url}>
                <HighlightBars data={KMU_TURNOVER_SECTORS} highlight={0} ariaLabel="KMU-Anteil am Umsatz nach Branche" height={170} />
              </Card>
            </div>
          </div>
        </section>

        {/* SOFTWARE */}
        <section id="software" aria-labelledby="sw-h" className="scroll-mt-28">
          <SectionTitle id="sw-h" eyebrow="Software-Preise" title="Was Business-Software wirklich kostet" />
          <p className="mt-3 max-w-[70ch] text-ink-700">
            Monatskosten netto, berechnet aus den veröffentlichten Listenpreisen der Anbieter: Grundpreis, enthaltene Personen, Aufpreise und Mindestbeträge.
            Zusatzmodule und Einführung sind nicht enthalten.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Card title="Buchhaltung und ERP nach Nutzenden" sub="€ pro Monat netto · Spalten = Anzahl Nutzende · Farbskala logarithmisch" source="Anbieterpreise, eigene Berechnung" className="lg:col-span-7">
              <HeatGrid cols={TEAM.map(String)} rows={byUsers} format={eur} log ariaLabel="Monatskosten nach Nutzenden" />
            </Card>
            <Card title="Einstiegspreise im Überblick" sub="günstigster bezahlter Tarif, € pro Monat netto" source="Anbieterpreise" className="lg:col-span-5">
              <RankBars data={entry} format={eur} max={Math.max(...entry.map((e) => e.value))} />
              <p className="mt-4 text-[13px] text-ink-500">Preismodelle unterscheiden sich: pauschal, je Nutzer oder je Beschäftigte. Bei Personio gilt zusätzlich eine Mindestabnahme von 420 € pro Monat.</p>
            </Card>
            <Card title="Lohn und HR nach Beschäftigten" sub="€ pro Monat netto · Spalten = Anzahl Beschäftigte" source="Anbieterpreise, eigene Berechnung" className="lg:col-span-7">
              <HeatGrid cols={TEAM.map(String)} rows={byEmployees} format={eur} log ariaLabel="Monatskosten nach Beschäftigten" />
              <p className="mt-3 text-[13px] text-ink-500">Personio: Mindestabnahme von 420 € pro Monat, daher gleiche Kosten bis etwa 55 Beschäftigte.</p>
            </Card>
            <Card title="Prüfkriterien-Check" sub="Anteil öffentlich belegter Kriterien, 0–100" tone="light" source="Eigene Auswertung, siehe Methodik" className="lg:col-span-5">
              <ul className="space-y-3">
                {scores.map(({ s, score }) => (
                  <li key={s.slug}>
                    <Link href={`/software/${s.slug}`} className="flex items-center gap-3 no-underline">
                      <span className="flex w-[78px] shrink-0 items-center">
                        <PartnerLogo slug={s.slug} height={16} maxWidth={74} tile={false} />
                      </span>
                      <span className="w-[42%] truncate text-[14px]">{s.name}</span>
                      <span className="h-2.5 flex-1 overflow-hidden bg-white" style={{ borderRadius: 4 }}>
                        <span className="block h-full" style={{ width: `${score}%`, background: score >= 60 ? "#006BFF" : "#7AB3FF", borderRadius: 4 }} />
                      </span>
                      <span className="w-8 text-right font-data text-[13px] tabular-nums">{score}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </section>

        <aside className="rounded-[20px] border border-line bg-white p-6 text-[14px] text-ink-700">
          <p className="font-medium text-ink-950">Quellen und Hinweise</p>
          <ul className="mt-3 list-[square] space-y-1.5 pl-5 marker:text-brand-500">
            {Object.values(SRC).map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener nofollow">
                  {s.label}
                </a>
              </li>
            ))}
            <li>Software-Preise: Preisseiten der Anbieter; Berechnung siehe <Link href="/methodik">Methodik</Link>.</li>
          </ul>
          <p className="mt-3">
            Destatis-Werte beziehen sich auf Unternehmen mit mindestens 10 Beschäftigten (IKT-Erhebung) beziehungsweise auf die Wirtschaftsabschnitte B bis S ohne O und S94 (KMU-Statistik). Ab dem
            Berichtsjahr 2025 gilt in der IKT-Erhebung der EU-Unternehmensbegriff.
          </p>
        </aside>
      </div>
    </div>
  );
}

function SectionTitle({ id, eyebrow, title }: { id: string; eyebrow: string; title: string }) {
  return (
    <div>
      <p className="t-eyebrow">{eyebrow}</p>
      <h2 id={id} className="t-h2 mt-2">
        {title}
      </h2>
    </div>
  );
}
