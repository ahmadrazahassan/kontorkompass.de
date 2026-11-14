import Link from "next/link";
import { ArrowUpRight, CalendarCheck, ShieldCheck, BookOpenText, ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { Logo, LOGO_PATHS, LOGO_VIEWBOX } from "@/components/ui/Logo";
import { LinkedInLogo } from "@/components/ui/LinkedInLogo";
import { NewsletterForm } from "./NewsletterForm";
import { getCategories } from "@/lib/cms";
import { OPERATOR } from "@/lib/site";

const lnk = "text-[15px] text-white/65 no-underline transition-colors hover:text-white";
const head = "mb-5 font-data text-[12px] font-medium uppercase tracking-[0.1em] text-white/45";

// Fixed legal dates, each linked to the guide that explains it (sources live in the guides).
const DEADLINES = [
  { date: "seit 01.01.2025", label: "E-Rechnungen empfangen", href: "/ratgeber/e-rechnungen-empfangen-pflicht-2025" },
  { date: "01.01.2027", label: "E-Rechnung ausstellen bei mehr als 800.000 € Vorjahresumsatz", href: "/ratgeber/e-rechnung-2027-pflicht-unternehmen" },
  { date: "01.01.2028", label: "E-Rechnung für alle inländischen B2B-Umsätze", href: "/ratgeber/e-rechnung-2027-pflicht-unternehmen" },
];

export async function Footer() {
  const CATEGORIES = await getCategories();
  return (
    <footer className="relative mt-4 overflow-hidden bg-ink-950 text-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Seitenende
      </h2>

      {/* Newsletter band */}
      <div className="container-page">
        <div className="grid gap-10 border-b border-white/10 py-16 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:py-20">
          <div>
            <p className="font-data text-[12.5px] font-medium uppercase tracking-[0.1em] text-accent">Newsletter</p>
            <p className="mt-4 max-w-[18ch] font-display text-[clamp(32px,4vw,48px)] font-medium leading-[1.08] tracking-[-0.02em]">
              Fristen, Pflichten und Preise im Blick.
            </p>
            <p className="mt-5 max-w-[50ch] text-[17px] text-white/65">
              Einmal im Monat: neue Ratgeber, geänderte Pflichten und aktualisierte Softwarepreise. Ohne Werbung im Postfach.
            </p>
          </div>
          <NewsletterForm id="footer" tone="dark" />
        </div>
      </div>

      {/* Link grid */}
      <div className="container-page">
        <div className="grid gap-12 py-16 xl:grid-cols-[1.25fr_2.75fr] xl:gap-16">
          <div>
            <Logo mono="white" />
            <p className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-white/65">
              Unabhängige Ratgeber zu Buchhaltung, E-Rechnung, Lohn, HR und ERP für kleine und mittlere Unternehmen in Deutschland.
            </p>
            <ul className="mt-8 space-y-3 text-[14px] text-white/75">
              <li className="flex items-center gap-3">
                <BookOpenText size={18} aria-hidden className="text-accent" /> Jede Zahl mit Quelle
              </li>
              <li className="flex items-center gap-3">
                <CalendarCheck size={18} aria-hidden className="text-accent" /> Preise regelmäßig geprüft
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck size={18} aria-hidden className="text-accent" /> Werbelinks klar gekennzeichnet
              </li>
            </ul>
            <a
              href={OPERATOR.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-[14px] text-white/75 no-underline transition-colors hover:text-white"
            >
              <LinkedInLogo size={20} /> {OPERATOR.representative} auf LinkedIn
            </a>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            <nav aria-label="Ratgeber nach Thema">
              <p className={head}>Themen</p>
              <ul className="space-y-3">
                {CATEGORIES.map((c) => (
                  <li key={c.slug}>
                    <Link className={lnk} href={`/ratgeber/kategorie/${c.slug}`}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Wissen">
              <p className={head}>Wissen</p>
              <ul className="space-y-3">
                <li><Link className={lnk} href="/ratgeber">Alle Ratgeber</Link></li>
                <li><Link className={lnk} href="/magazin">Magazin</Link></li>
                <li><Link className={lnk} href="/software">Software-Profile</Link></li>
                <li><Link className={lnk} href="/software/vergleich">Software-Vergleich</Link></li>
                <li><Link className={lnk} href="/software/finder">Software-Finder</Link></li>
                <li><Link className={lnk} href="/marktdaten">Marktdaten</Link></li>
                <li><Link className={lnk} href="/glossar">Glossar</Link></li>
                <li><Link className={lnk} href="/suche">Suche</Link></li>
              </ul>
            </nav>
            <nav aria-label="Unternehmen">
              <p className={head}>Redaktion</p>
              <ul className="space-y-3">
                <li><Link className={lnk} href="/ueber-uns">Über uns</Link></li>
                <li><Link className={lnk} href="/methodik">Methodik</Link></li>
                <li><Link className={lnk} href="/transparenz">Transparenz</Link></li>
                <li><Link className={lnk} href="/kontakt">Kontakt</Link></li>
                <li><Link className={lnk} href="/newsletter">Newsletter</Link></li>
              </ul>
            </nav>
            <div className="col-span-2 lg:col-span-1">
              <p className={head}>Wichtige Fristen</p>
              <ol className="space-y-4">
                {DEADLINES.map((d) => (
                  <li key={d.date}>
                    <Link href={d.href} className="group block no-underline">
                      <span className="block font-data text-[13px] tracking-wider text-accent">{d.date}</span>
                      <span className="mt-0.5 block text-[14px] leading-snug text-white/70 transition-colors group-hover:text-white">{d.label}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Oversized wordmark */}
      <div className="container-page select-none" aria-hidden>
        <div className="flex items-end gap-[2vw] overflow-hidden border-t border-white/10 pt-10">
          <svg viewBox={LOGO_VIEWBOX} className="h-[clamp(34px,8.6vw,140px)] w-auto shrink-0">
            <path d={LOGO_PATHS.stem} fill="#006BFF" />
            <path d={LOGO_PATHS.arm} fill="#006BFF" />
            <path d={LOGO_PATHS.leg} fill="#006BFF" />
          </svg>
          <span
            className="font-display font-semibold leading-[0.78] tracking-[-0.045em] text-white/[0.07]"
            style={{ fontSize: "clamp(40px, 10.6vw, 178px)" }}
          >
            kontorkompass
          </span>
        </div>
      </div>

      {/* Legal bar */}
      <div className="container-page">
        <div className="mt-10 flex flex-col gap-5 border-t border-white/10 py-7 text-[14px] text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>© 2026 Kontorkompass</span>
            <Link className="no-underline hover:text-white" href="/impressum">Impressum</Link>
            <Link className="no-underline hover:text-white" href="/datenschutz">Datenschutz</Link>
            <Link className="no-underline hover:text-white" href="/cookie-einstellungen">Cookie-Einstellungen</Link>
            <Link className="inline-flex items-center gap-1 no-underline hover:text-white" href="/transparenz">
              Mit * gekennzeichnete Links sind Werbelinks <ArrowUpRight size={14} aria-hidden />
            </Link>
          </div>
          <a href="#inhalt" className="inline-flex items-center gap-2 self-start no-underline hover:text-white lg:self-auto">
            Nach oben <ArrowUp size={16} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
