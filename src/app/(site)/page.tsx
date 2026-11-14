import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { OPERATOR, SITE } from "@/lib/site";
import { Thumbnail, coverFor } from "@/components/ui/Thumbnail";
import { Eyebrow, GuideCard, SectionHeading } from "@/components/content/Blocks";
import { SoftwareShowcase } from "@/components/content/SoftwareShowcase";
import { getCategories, getDocs, getSoftwareList } from "@/lib/cms";

const QUICK = [
  { label: "E-Rechnung 2027", href: "/ratgeber/e-rechnung-2027-pflicht-unternehmen" },
  { label: "Lohnabrechnung", href: "/ratgeber/lohnabrechnungssoftware-kleine-unternehmen" },
  { label: "ERP-Kosten", href: "/ratgeber/erp-kosten-mittelstand" },
  { label: "GoBD", href: "/ratgeber/gobd-einfach-erklaert" },
];

// Hero collage: three articles whose photos open the page, each a direct entry point.
const HERO_SLUGS = ["zusammenarbeit-steuerbuero-datev-export", "e-rechnung-2027-unternehmen-nicht-vorbereitet", "lagerbestand-ohne-ueberblick-handel"];

// The pain-point series: the problem in a few words, then the article that solves it.
const PROBLEMS: { slug: string; problem: string }[] = [
  { slug: "belegchaos-buero-belege-digitalisieren", problem: "Belege liegen überall" },
  { slug: "zahlungsverzug-kunden-mahnwesen-automatisieren", problem: "Kunden zahlen zu spät" },
  { slug: "excel-am-limit-wann-ein-erp-sinnvoll-ist", problem: "Excel stößt an Grenzen" },
  { slug: "lohnabrechnung-fehler-meldepflichten-kleine-betriebe", problem: "Lohn ist fehleranfällig" },
  { slug: "ueberstunden-arbeitszeitkonto-erfassen", problem: "Überstunden ohne Überblick" },
  { slug: "buerokratie-mittelstand-zeit-sparen-software", problem: "Bürokratie frisst Zeit" },
];

const TIMELINE = [
  { date: "01.01.2025", title: "Empfangen", text: "Alle inländischen Unternehmen müssen E-Rechnungen empfangen können." },
  { date: "01.01.2027", title: "Ausstellen ab 800.000 €", text: "Pflicht für Unternehmen mit mehr als 800.000 € Gesamtumsatz im Vorjahr." },
  { date: "01.01.2028", title: "Ausstellen für alle", text: "Die Ausstellungspflicht gilt für alle inländischen B2B-Umsätze." },
];

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default async function Home() {
  const [CATEGORIES, DOCS, SOFTWARE] = await Promise.all([
    getCategories(),
    getDocs(),
    getSoftwareList(),
  ]);
  const bySlug = (slug: string) => DOCS.find((d) => d.slug === slug);
  const guides = DOCS.filter((d) => d.kind === "ratgeber");
  const newest = [...DOCS].sort((a, b) => b.updated.localeCompare(a.updated) || b.published.localeCompare(a.published));

  const featured = guides.find((d) => d.slug === "e-rechnung-2027-pflicht-unternehmen") ?? guides[0];
  const heroDocs = HERO_SLUGS.map(bySlug).filter((d): d is NonNullable<typeof d> => Boolean(d));
  const problems = PROBLEMS.map((p) => ({ ...p, doc: bySlug(p.slug) })).filter((p) => p.doc);
  const used = new Set([featured.slug, ...problems.map((p) => p.slug)]);
  const latest = newest.filter((d) => !used.has(d.slug)).slice(0, 4);
  const guideGrid = guides.filter((d) => d.slug !== featured.slug).slice(0, 6);
  // One product per vendor, alphabetical, so no vendor is put first.
  const profileBar = ["lexware-office", "personio", "sage-active", "sevdesk", "weclapp"]
    .map((slug) => SOFTWARE.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      url: SITE.url,
      logo: `${SITE.url}${SITE.logo}`,
      email: SITE.email,
      parentOrganization: {
        "@type": "Organization",
        name: OPERATOR.company,
        address: { "@type": "PostalAddress", streetAddress: OPERATOR.street, postalCode: OPERATOR.city.split(" ")[0], addressLocality: OPERATOR.city.split(" ").slice(1).join(" "), addressCountry: "DE" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      name: SITE.name,
      url: SITE.url,
      inLanguage: "de-DE",
      publisher: { "@id": `${SITE.url}/#organization` },
      potentialAction: { "@type": "SearchAction", target: `${SITE.url}/suche?q={search_term_string}`, "query-input": "required name=search_term_string" },
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="container-page grid gap-12 pb-16 pt-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-20">
          <div className="reveal">
            <p className="inline-flex items-center gap-2 border border-line bg-white px-3 py-1.5 font-data text-[12.5px] font-medium uppercase tracking-[0.08em] text-ink-700" style={{ borderRadius: 4 }}>
              <span aria-hidden className="inline-block h-2 w-2 bg-brand-500" />
              Unabhängiger Ratgeber für den Mittelstand
            </p>
            <h1 className="t-display mt-7 max-w-[13ch]">
              Software-Entscheidungen <span className="text-brand-500">mit Substanz.</span>
            </h1>
            <p className="t-lead mt-6 max-w-[50ch]">
              Recherchierte Ratgeber zu Buchhaltung, E-Rechnung, Lohn, HR und ERP. Mit Primärquellen, echten Preisen in Euro und nachvollziehbaren Berechnungen.
            </p>

            <form action="/suche" role="search" className="mt-9 max-w-xl">
              <label htmlFor="hero-q" className="sr-only">
                Ratgeber durchsuchen
              </label>
              <div className="flex items-center gap-2 border border-ink-950/15 bg-white p-1.5 shadow-[0_8px_24px_-12px_rgb(14_20_32_/_0.18)] focus-within:border-brand-500" style={{ borderRadius: 8 }}>
                <MagnifyingGlass size={20} aria-hidden className="ml-3 shrink-0 text-ink-500" />
                <input id="hero-q" name="q" type="search" placeholder="Thema suchen, z. B. Mahnwesen" className="h-11 w-full min-w-0 bg-transparent text-[16px] outline-none placeholder:text-ink-500/70" />
                <button type="submit" className="btn btn-primary btn-sm shrink-0">
                  <span className="btn-label" data-text="Suchen">
                    <span>Suchen</span>
                  </span>
                </button>
              </div>
            </form>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px]">
              <span className="font-data text-[12px] uppercase tracking-[0.08em] text-ink-500">Schnelleinstieg</span>
              {QUICK.map((q) => (
                <Link key={q.label} href={q.href} className="font-medium text-ink-700 underline decoration-ink-950/20 underline-offset-4 hover:text-brand-700 hover:decoration-brand-500">
                  {q.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Photo collage */}
          <div className="relative">
            <div className="grid h-[440px] grid-cols-[1.15fr_1fr] grid-rows-2 gap-3 sm:h-[520px] lg:h-[560px]">
              {heroDocs.map((d, i) => {
                const cover = coverFor(d);
                return (
                  <Link
                    key={d.slug}
                    href={`/${d.kind}/${d.slug}`}
                    className={`group relative block overflow-hidden no-underline ${i === 0 ? "row-span-2" : ""}`}
                    style={{ borderRadius: 14 }}
                  >
                    {cover && <Image src={cover.src} alt={cover.alt} fill priority sizes="(min-width: 1024px) 30vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />}
                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-950/75 to-transparent" aria-hidden />
                    <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white">
                      <span className="text-[14px] font-medium leading-snug sm:text-[15px]">{d.seoTitle}</span>
                      <ArrowUpRight size={18} aria-hidden className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============ SOFTWARE-PROFILE BAR ============ */}
      {/* Plain product names instead of a logo wall: a row of vendor logos reads like partners or customers (trademark use, Sage partner terms). */}
      <section aria-label="Software-Profile" className="border-b border-line bg-surface-1">
        <div className="container-page flex flex-col items-start gap-4 py-7 md:flex-row md:items-center md:justify-between md:gap-10">
          <p className="shrink-0 font-data text-[12px] uppercase tracking-[0.1em] text-ink-500">Software-Profile</p>
          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {profileBar.map((s) => (
              <li key={s.slug}>
                <Link href={`/software/${s.slug}`} className="font-display text-[17px] font-medium text-ink-700 no-underline transition-colors hover:text-brand-700">
                  {s.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/software" className="link-arrow !text-[14px]">
                Alle Profile →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ============ EDITORIAL ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Im Fokus"
            title="Was Unternehmen jetzt wissen müssen."
            action={
              <Button href="/ratgeber" variant="outline" size="sm">
                Alle Ratgeber
              </Button>
            }
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-14">
            <GuideCard doc={featured} variant="featured" />
            <div>
              <p className="t-eyebrow border-b border-ink-950 pb-3">Neu und aktualisiert</p>
              <ul>
                {latest.map((d) => {
                  const cat = CATEGORIES.find((c) => c.slug === d.category);
                  return (
                    <li key={d.slug} className="border-b border-line">
                      <Link href={`/${d.kind}/${d.slug}`} className="card group grid grid-cols-[1fr_104px] gap-5 py-5 no-underline sm:grid-cols-[1fr_132px]">
                        <div>
                          <p className="font-data text-[11.5px] uppercase tracking-[0.08em] text-brand-700">
                            {d.kind === "ratgeber" ? "Ratgeber" : "Magazin"} · {cat?.name}
                          </p>
                          <h3 className="card-title mt-2 font-display text-[18px] font-semibold leading-snug tracking-[-0.01em]">{d.seoTitle}</h3>
                          <p className="mt-2 font-data text-[11.5px] uppercase tracking-wider text-ink-500">
                            {d.readingMinutes} Min. Lesezeit
                          </p>
                        </div>
                        <div className="card-img relative aspect-[4/3] overflow-hidden" style={{ borderRadius: 8 }}>
                          <Thumbnail doc={d} categoryName={cat?.name} sizes="132px" compact />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROBLEM -> LÖSUNG ============ */}
      <section className="mx-4 md:mx-6">
        <div className="overflow-hidden bg-ink-950 text-white" style={{ borderRadius: 20 }}>
          <div className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="font-data text-[12.5px] font-medium uppercase tracking-[0.1em] text-accent">Praxisprobleme gelöst</p>
                <h2 className="t-h1 mt-4">Vom Alltagsproblem zur passenden Lösung.</h2>
                <p className="mt-5 max-w-[56ch] text-[18px] leading-relaxed text-white/70">
                  Unsere Magazin-Serie beginnt dort, wo es im Betrieb hakt: Rechtslage, Ursachen, ein klarer Ablauf und Software, die laut Anbieter dabei hilft.
                </p>
              </div>
              <Button href="/magazin" variant="light" arrow>
                Zum Magazin
              </Button>
            </div>
            <ul className="mt-14 grid gap-px overflow-hidden bg-white/10 sm:grid-cols-2 lg:grid-cols-3" style={{ borderRadius: 14 }}>
              {problems.map(({ problem, doc }, i) => {
                const d = doc!;
                const cover = coverFor(d);
                return (
                  <li key={d.slug} className="bg-ink-950">
                    <Link href={`/${d.kind}/${d.slug}`} className="group flex h-full flex-col no-underline">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {cover && <Image src={cover.src} alt={cover.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover opacity-90 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-100" />}
                        <span className="absolute left-4 top-4 bg-ink-950/85 px-2.5 py-1 font-data text-[12px] tracking-wider text-white backdrop-blur" style={{ borderRadius: 4 }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="font-data text-[12px] uppercase tracking-[0.08em] text-white/50">Problem</p>
                        <p className="mt-1 font-display text-[22px] font-medium leading-tight tracking-[-0.01em]">{problem}</p>
                        <p className="mt-4 flex-1 text-[15px] leading-relaxed text-white/65">{d.seoTitle}</p>
                        <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-medium text-accent">
                          Zur Lösung <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ============ RATGEBER GRID ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeading
            eyebrow="Ratgeber"
            title="Grundlagen, Pflichten und Auswahlhilfen."
            lead="Ausführliche Leitfäden mit Quellen, Rechenbeispielen und Checklisten."
            action={
              <Button href="/ratgeber" variant="outline" size="sm">
                Alle Ratgeber
              </Button>
            }
          />
          <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {guideGrid.map((d) => (
              <GuideCard key={d.slug} doc={d} />
            ))}
          </div>
        </div>
      </section>

      {/* ============ E-RECHNUNG TIMELINE ============ */}
      <section className="mx-4 md:mx-6">
        <div className="relative overflow-hidden bg-brand-700 text-white" style={{ borderRadius: 20 }}>
          <div className="relative grid gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1fr_1.3fr] lg:px-16 lg:py-24">
            <div>
              <p className="font-data text-[12.5px] font-medium uppercase tracking-[0.1em] text-accent">Pflicht im Überblick: E-Rechnung</p>
              <h2 className="t-h1 mt-4 max-w-[16ch]">Drei Stichtage, die jedes Unternehmen kennen muss.</h2>
              <p className="mt-6 max-w-[46ch] text-[17px] text-white/75">Wer 2026 mehr als 800.000 € Gesamtumsatz erzielt, muss ab 2027 E-Rechnungen ausstellen. Was das konkret bedeutet, erklären wir Schritt für Schritt.</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href="/ratgeber/e-rechnung-2027-pflicht-unternehmen" variant="light" arrow>
                  Zum Ratgeber E-Rechnung
                </Button>
              </div>
            </div>
            <div>
            <ol className="relative">
              {TIMELINE.map((t, i) => (
                <li key={t.date} className="relative grid grid-cols-[28px_1fr] gap-5 pb-10 last:pb-0">
                  {i < TIMELINE.length - 1 && <span aria-hidden className="absolute left-[13px] top-7 h-[calc(100%-20px)] w-px bg-white/25" />}
                  <span aria-hidden className={`mt-1.5 h-[14px] w-[14px] translate-x-[7px] ${i === 1 ? "bg-accent" : "border border-white/60 bg-brand-700"}`} />
                  <div className="border-b border-white/15 pb-8 last:border-0">
                    <p className="font-data text-[clamp(26px,3vw,36px)] font-medium leading-none tracking-[-0.01em]">{t.date}</p>
                    <p className="mt-3 text-[18px] font-medium">{t.title}</p>
                    <p className="mt-1 text-[15px] text-white/70">{t.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 font-data text-[11.5px] uppercase tracking-wider text-white/50">Quelle: IHK Region Stuttgart, IHK Frankfurt am Main</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ THEMEN ============ */}
      <section className="section">
        <div className="container-page">
          <SectionHeading eyebrow="Themenwelten" title="Alles zu Ihrem Fachbereich." />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => {
              const inCat = newest.filter((d) => d.category === c.slug);
              return (
                <div key={c.slug} className="group flex flex-col border border-line bg-white p-7 transition-shadow hover:shadow-[var(--shadow-overlay)]" style={{ borderRadius: 14 }}>
                  <div className="flex items-start justify-between">
                    <Icon name={c.icon} size={30} className="text-brand-500" />
                    <span className="font-data text-[12px] uppercase tracking-wider text-ink-500">{inCat.length} Beiträge</span>
                  </div>
                  <h3 className="t-h3 mt-6">
                    <Link href={`/ratgeber/kategorie/${c.slug}`} className="no-underline hover:text-brand-700">
                      {c.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-[15px] text-ink-700">{c.description}</p>
                  <ul className="mt-5 flex-1 space-y-2 border-t border-line pt-5">
                    {inCat.slice(0, 2).map((d) => (
                      <li key={d.slug}>
                        <Link href={`/${d.kind}/${d.slug}`} className="flex gap-2 text-[14.5px] leading-snug text-ink-700 no-underline hover:text-brand-700">
                          <ArrowRight size={14} aria-hidden className="mt-1 shrink-0 text-brand-500" />
                          {d.seoTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/ratgeber/kategorie/${c.slug}`} className="link-arrow mt-6 text-[15px]">
                    Zum Thema →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ SOFTWARE ============ */}
      <SoftwareShowcase items={SOFTWARE} />

      {/* ============ METHODIK ============ */}
      <section className="section border-t border-line bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Eyebrow>So arbeiten wir</Eyebrow>
            <h2 className="t-h1 mt-4 max-w-[14ch]">Recherchiert, belegt, aktuell gehalten.</h2>
            <p className="t-lead mt-6 max-w-[44ch]">Unsere Inhalte entstehen aus Gesetzestexten, amtlichen Statistiken und Anbieterangaben. Nicht aus Vermutungen.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/methodik" variant="ink" arrow>
                Zur Methodik
              </Button>
              <Button href="/transparenz" variant="outline">
                Transparenz
              </Button>
            </div>
          </div>
          <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2" style={{ borderRadius: 14 }}>
            {[
              ["Primärquellen", "Gesetzestexte, Kammern, Destatis, Studien und die Preisseiten der Anbieter."],
              ["Belegt", "Jede Zahl erhält eine nummerierte Quelle, die Sie selbst prüfen können."],
              ["Geprüft", "Preise prüfen wir mindestens vierteljährlich, Rechtsthemen bei jeder Änderung."],
              ["Transparent", "Werbelinks sind gekennzeichnet und beeinflussen weder Auswahl noch Bewertung."],
            ].map(([h, t], i) => (
              <li key={h} className="bg-white p-8">
                <p className="font-data text-[15px] text-brand-500">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="t-h3 mt-8">{h}</h3>
                <p className="mt-2 text-ink-700">{t}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============ GLOSSAR ============ */}
      <section className="border-t border-line">
        <div className="container-page flex flex-col gap-6 py-12 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-baseline gap-4">
            <Eyebrow>Glossar</Eyebrow>
            <p className="font-display text-[22px] font-medium tracking-[-0.01em]">Fachbegriffe kurz erklärt.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["E-Rechnung", "XRechnung", "ZUGFeRD", "EN 16931", "Kleinbetragsrechnung"].map((t) => (
              <Link
                key={t}
                href={`/glossar/${t.toLowerCase().replace(/ /g, "-")}`}
                className="border border-ink-950/15 bg-white px-3.5 py-2 text-[14.5px] no-underline hover:border-brand-500 hover:text-brand-700"
                style={{ borderRadius: 4 }}
              >
                {t}
              </Link>
            ))}
            <Link href="/glossar" className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[14.5px] font-medium text-brand-700 no-underline hover:underline">
              Alle Begriffe <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
