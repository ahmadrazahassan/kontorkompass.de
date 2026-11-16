import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUp } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/ui/Logo";
import { LinkedInLogo } from "@/components/ui/LinkedInLogo";
import { OPERATOR } from "@/lib/site";

// Short, minimal footer (user decision 16.11.2026): dark background, no newsletter band, no oversized wordmark.
// Newsletter sign-up stays on /newsletter and under each article.
// globals.css has an unlayered `a { color: inherit }` that beats Tailwind colour utilities on <a>,
// so colour and hover sit on a wrapper and the link inherits them.
const head = "mb-4 font-data text-[11.5px] font-medium uppercase tracking-[0.1em] text-white/40";
const hover = "transition-colors hover:text-white";

function FLink({ href, children, external = false, label }: { href: string; children: ReactNode; external?: boolean; label?: string }) {
  return (
    <span className={`inline-flex ${hover}`}>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="inline-flex items-center gap-1.5 no-underline">
          {children}
        </a>
      ) : (
        <Link href={href} aria-label={label} className="inline-flex items-center gap-1.5 no-underline">
          {children}
        </Link>
      )}
    </span>
  );
}

const COLUMNS: { title: string; links: [string, string][] }[] = [
  {
    title: "Inhalte",
    links: [
      ["Ratgeber", "/ratgeber"],
      ["Magazin", "/magazin"],
      ["Glossar", "/glossar"],
      ["Marktdaten", "/marktdaten"],
    ],
  },
  {
    title: "Software",
    links: [
      ["Software-Profile", "/software"],
      ["Software-Vergleich", "/software/vergleich"],
      ["Software-Finder", "/software/finder"],
    ],
  },
  {
    title: "Redaktion",
    links: [
      ["Über uns", "/ueber-uns"],
      ["Methodik", "/methodik"],
      ["Transparenz", "/transparenz"],
      ["Kontakt", "/kontakt"],
      ["Newsletter", "/newsletter"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-4 bg-ink-950 text-white" aria-labelledby="footer-title">
      <h2 id="footer-title" className="sr-only">
        Seitenende
      </h2>
      <div className="container-page">
        <div className="grid gap-10 py-12 md:grid-cols-[1.2fr_2fr] md:gap-16 lg:py-14">
          <div>
            <Logo mono="white" />
            <p className="mt-4 max-w-[36ch] text-[14.5px] leading-relaxed text-white/60">
              Unabhängige Ratgeber zu Buchhaltung, E-Rechnung, Lohn, HR und ERP für kleine und mittlere Unternehmen in Deutschland.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3">
            {COLUMNS.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <p className={head}>{c.title}</p>
                <ul className="space-y-2.5 text-[14.5px] text-white/60">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <FLink href={href}>{label}</FLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-[13.5px] text-white/50 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>© 2026 Kontorkompass</span>
            <FLink href="/impressum">Impressum</FLink>
            <FLink href="/datenschutz">Datenschutz</FLink>
            <FLink href="/cookie-einstellungen">Cookie-Einstellungen</FLink>
            <FLink href="/transparenz">Mit * gekennzeichnete Links sind Werbelinks</FLink>
          </div>
          <div className="flex items-center gap-5">
            {OPERATOR.linkedin && (
              <FLink href={OPERATOR.linkedin} external label={`${OPERATOR.representative} auf LinkedIn`}>
                <LinkedInLogo size={18} />
              </FLink>
            )}
            <FLink href="#inhalt">
              Nach oben <ArrowUp size={14} aria-hidden />
            </FLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
