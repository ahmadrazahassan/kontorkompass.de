"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowRight,
  ArrowsLeftRight,
  BookOpenText,
  CaretDown,
  ChartBar,
  Compass,
  List,
  ListChecks,
  MagnifyingGlass,
  Newspaper,
  ShieldCheck,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icons";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import type { Category } from "@/content/data";

type MenuSoftware = { slug: string; name: string; category: string };
type MenuId = "ratgeber" | "software" | "wissen";

// Products in alphabetical order, so no vendor is always listed first.
const POPULAR = [
  { label: "Lexware Office vs. Sage Active vs. sevdesk", href: "/software/vergleich?p=lexware-office,sage-active,sevdesk" },
  { label: "Personio vs. Sage HR Suite", href: "/software/vergleich?p=personio,sage-hr-suite" },
  { label: "Sage 100 vs. weclapp", href: "/software/vergleich?p=sage-100,weclapp" },
];

const TOOLS = [
  { href: "/software/finder", label: "Software-Finder", text: "Vier Fragen, passende Lösungen mit Begründung", Icon: Compass },
  { href: "/software/vergleich", label: "Software-Vergleich", text: "Bis zu drei Produkte nebeneinander", Icon: ArrowsLeftRight },
  { href: "/software", label: "Alle Software-Profile", text: "Preise, Kosten und zehn Prüfkriterien", Icon: ListChecks },
];

const KNOWLEDGE = [
  { href: "/marktdaten", label: "Marktdaten", text: "Destatis-Zahlen zu KI, Cloud und Mittelstand", Icon: ChartBar },
  { href: "/magazin", label: "Magazin", text: "Praxisprobleme und ihre Lösungen", Icon: Newspaper },
  { href: "/glossar", label: "Glossar", text: "Fachbegriffe kurz erklärt", Icon: BookOpenText },
  { href: "/methodik", label: "Methodik", text: "So recherchieren und bewerten wir", Icon: ListChecks },
  { href: "/transparenz", label: "Transparenz", text: "Finanzierung und Werbelinks", Icon: ShieldCheck },
  { href: "/ueber-uns", label: "Über uns", text: "Redaktion und Anspruch", Icon: UsersThree },
];

const SECTION: Record<MenuId | "magazin", (p: string) => boolean> = {
  ratgeber: (p) => p.startsWith("/ratgeber"),
  magazin: (p) => p.startsWith("/magazin"),
  software: (p) => p.startsWith("/software"),
  wissen: (p) => ["/marktdaten", "/glossar", "/methodik", "/transparenz", "/ueber-uns"].some((x) => p.startsWith(x)),
};

export function Header({ categories, counts, software }: { categories: Category[]; counts: Record<string, number>; software: MenuSoftware[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<MenuId | null>(null);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [panelTop, setPanelTop] = useState(64);
  const bar = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setMobile(false);
      }
      // "/" jumps to the search field, as on large documentation and news sites
      const t = e.target as HTMLElement;
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName) && !t.isContentEditable) {
        const el = document.getElementById("header-q");
        if (el && el.offsetParent !== null) {
          e.preventDefault();
          el.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Lock page scroll while the mobile menu is open, and place the panel right under the bar.
  useEffect(() => {
    if (!mobile) return;
    setPanelTop(Math.max(0, bar.current?.getBoundingClientRect().bottom ?? 64));
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobile]);

  const enter = useCallback((id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(id);
  }, []);
  const leave = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 160);
  }, []);

  const search = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    router.push(q ? `/suche?q=${encodeURIComponent(q)}` : "/suche");
  };

  return (
    <>
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-4 focus:py-2 focus:shadow-[var(--shadow-overlay)]"
      >
        Zum Inhalt springen
      </a>

      {/* ---------- Utility bar (scrolls away) ---------- */}
      <div className="bg-ink-950 text-white">
        <div className="container-page flex h-9 items-center justify-between gap-6 text-[13px]">
          <Link href="/ratgeber/e-rechnung-2027-pflicht-unternehmen" className="group flex min-w-0 items-center gap-2.5 text-white/80 no-underline hover:text-white">
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-accent" />
            <span className="truncate">
              <span className="font-medium text-white">E-Rechnung:</span>
              <span className="hidden sm:inline"> Ausstellungspflicht ab 01.01.2027 für Unternehmen über 800.000 € Vorjahresumsatz</span>
              <span className="sm:hidden"> Pflicht ab 01.01.2027</span>
            </span>
            <ArrowRight size={13} aria-hidden className="shrink-0 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <nav aria-label="Service" className="hidden shrink-0 items-center gap-5 text-white/65 md:flex">
            <span className="hidden font-data text-[11.5px] uppercase tracking-[0.1em] text-white/45 lg:inline">Unabhängig · Quellen belegt</span>
            <span aria-hidden className="hidden h-3 w-px bg-white/20 lg:inline" />
            <Link href="/methodik" className="no-underline hover:text-white">Methodik</Link>
            <Link href="/transparenz" className="no-underline hover:text-white">Transparenz</Link>
            <Link href="/kontakt" className="no-underline hover:text-white">Kontakt</Link>
          </nav>
        </div>
      </div>

      {/* ---------- Main bar (sticky) ---------- */}
      <header
        ref={bar}
        className="sticky top-0 z-50 border-b bg-white transition-shadow duration-200"
        style={{ borderColor: scrolled || open ? "var(--color-line)" : "transparent", boxShadow: scrolled && !open ? "0 6px 24px -14px rgb(14 20 32 / 0.25)" : "none" }}
        onMouseLeave={leave}
      >
        <div className="container-page flex items-center justify-between gap-6 transition-[height] duration-200" style={{ height: scrolled ? 64 : 76 }}>
          <div className="flex h-full items-center gap-8 xl:gap-12">
            <Logo />
            <nav aria-label="Hauptnavigation" className="hidden h-full items-center lg:flex">
              <Trigger id="ratgeber" label="Ratgeber" open={open} active={SECTION.ratgeber(pathname)} onEnter={enter} onToggle={setOpen} />
              <Link href="/magazin" className="hnav" data-active={SECTION.magazin(pathname) || undefined} onMouseEnter={leave}>
                Magazin
              </Link>
              <Trigger id="software" label="Software" open={open} active={SECTION.software(pathname)} onEnter={enter} onToggle={setOpen} />
              <Trigger id="wissen" label="Wissen" open={open} active={SECTION.wissen(pathname)} onEnter={enter} onToggle={setOpen} />
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <form onSubmit={search} role="search" className="hidden xl:block">
              <label htmlFor="header-q" className="sr-only">
                Ratgeber durchsuchen
              </label>
              <div className="flex h-10 w-[230px] items-center gap-2 border border-ink-950/12 bg-surface-1 px-3 transition-colors focus-within:border-brand-500 focus-within:bg-white" style={{ borderRadius: 6 }}>
                <MagnifyingGlass size={17} aria-hidden className="shrink-0 text-ink-500" />
                <input id="header-q" name="q" type="search" placeholder="Suchen" className="w-full min-w-0 bg-transparent text-[14.5px] outline-none placeholder:text-ink-500" />
                <kbd className="shrink-0 border border-ink-950/15 bg-white px-1.5 font-data text-[11px] text-ink-500" style={{ borderRadius: 3 }} aria-hidden>
                  /
                </kbd>
              </div>
            </form>
            <Link href="/suche" aria-label="Suche öffnen" className="grid h-10 w-10 place-items-center text-ink-700 no-underline hover:bg-surface-1 xl:hidden" style={{ borderRadius: 6 }}>
              <MagnifyingGlass size={20} aria-hidden />
            </Link>
            <Link href="/software/finder" className="hidden h-10 items-center gap-2 whitespace-nowrap px-3 text-[14.5px] font-medium text-ink-950 no-underline hover:bg-surface-1 xl:inline-flex" style={{ borderRadius: 6 }}>
              <Compass size={18} aria-hidden className="text-brand-500" /> Software-Finder
            </Link>
            <div className="hidden sm:block">
              <Link href="/newsletter" className="btn btn-ink btn-sm">
                <span className="btn-label" data-text="Newsletter">
                  <span>Newsletter</span>
                </span>
              </Link>
            </div>
            <button
              type="button"
              className="grid h-10 w-10 place-items-center bg-transparent shadow-[inset_0_0_0_1px_rgb(14_20_32/0.18)] lg:hidden"
              style={{ borderRadius: 6 }}
              aria-label={mobile ? "Menü schließen" : "Menü öffnen"}
              aria-expanded={mobile}
              aria-controls="mobile-menu"
              onClick={() => setMobile((v) => !v)}
            >
              {mobile ? <X size={20} aria-hidden /> : <List size={20} aria-hidden />}
            </button>
          </div>
        </div>

        {/* ---------- Mega menus ---------- */}
        {open && (
          <div
            id={`mega-${open}`}
            className="mega-in absolute inset-x-0 top-full hidden border-t border-line bg-white shadow-[0_24px_48px_-24px_rgb(14_20_32_/_0.28)] lg:block"
            onMouseEnter={() => enter(open)}
          >
            {open === "ratgeber" && (
              <MegaShell
                footer={
                  <>
                    <Link href="/ratgeber" className="link-arrow">Alle Ratgeber →</Link>
                    <Link href="/magazin" className="link-arrow">Zum Magazin →</Link>
                  </>
                }
              >
                <div className="grid grid-cols-[1fr_300px] gap-10 xl:gap-12">
                  <div>
                    <p className="mega-head">Themen</p>
                    <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 xl:grid-cols-3">
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/ratgeber/kategorie/${c.slug}`} className="group flex gap-3.5 p-3 no-underline transition-colors hover:bg-surface-1" style={{ borderRadius: 8 }}>
                            <Icon name={c.icon} size={22} className="mt-0.5 shrink-0 text-brand-500" />
                            <span>
                              <span className="flex items-baseline gap-2 font-medium text-ink-950 group-hover:text-brand-700">
                                {c.name}
                                <span className="font-data text-[11.5px] font-normal text-ink-500">{counts[c.slug] ?? 0}</span>
                              </span>
                              <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-500">{c.description}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link href="/ratgeber/e-rechnung-2027-pflicht-unternehmen" className="group flex flex-col bg-brand-700 p-6 text-white no-underline" style={{ borderRadius: 12 }}>
                    <span className="font-data text-[11.5px] uppercase tracking-[0.1em] text-accent">Im Fokus</span>
                    <span className="mt-3 font-display text-[21px] font-medium leading-snug tracking-[-0.01em]">E-Rechnung ab 2027: Was Unternehmen jetzt umsetzen müssen</span>
                    <span className="mt-3 text-[14px] text-white/70">Fristen, Formate und ein Fahrplan für die Umstellung.</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14.5px] font-medium text-accent">
                      Ratgeber lesen <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </MegaShell>
            )}

            {open === "software" && (
              <MegaShell footer={<Link href="/software" className="link-arrow">Alle Software-Profile →</Link>}>
                <div className="grid grid-cols-[260px_1fr] gap-10 xl:grid-cols-[280px_1fr_280px] xl:gap-12">
                  <div>
                    <p className="mega-head">Werkzeuge</p>
                    <ul className="mt-5 space-y-1">
                      {TOOLS.map((t) => (
                        <li key={t.href}>
                          <MegaItem href={t.href} label={t.label} text={t.text} icon={<t.Icon size={22} aria-hidden className="text-brand-500" />} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mega-head">Software-Profile</p>
                    <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-1">
                      {software.map((s) => (
                        <li key={s.slug}>
                          <Link href={`/software/${s.slug}`} className="group flex items-center gap-3 p-2.5 no-underline transition-colors hover:bg-surface-1" style={{ borderRadius: 8 }}>
                            <span className="grid h-9 w-[72px] shrink-0 place-items-center border border-line bg-white" style={{ borderRadius: 6 }}>
                              <PartnerLogo slug={s.slug} height={14} maxWidth={60} tile={false} />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-[14.5px] font-medium text-ink-950 group-hover:text-brand-700">{s.name}</span>
                              <span className="block truncate text-[12.5px] text-ink-500">{s.category}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="hidden border-l border-line pl-10 xl:block">
                    <p className="mega-head">Beliebte Vergleiche</p>
                    <ul className="mt-5 space-y-3">
                      {POPULAR.map((p) => (
                        <li key={p.href}>
                          <Link href={p.href} className="group flex items-start gap-2.5 text-[14.5px] leading-snug text-ink-700 no-underline hover:text-brand-700">
                            <ArrowsLeftRight size={16} aria-hidden className="mt-0.5 shrink-0 text-ink-500 group-hover:text-brand-500" />
                            {p.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </MegaShell>
            )}

            {open === "wissen" && (
              <MegaShell footer={<Link href="/marktdaten" className="link-arrow">Zum Marktdaten-Dashboard →</Link>}>
                <div className="grid grid-cols-[1fr_300px] gap-10 xl:gap-12">
                  <ul className="grid grid-cols-2 gap-x-6 gap-y-1 xl:grid-cols-3">
                    {KNOWLEDGE.map((k) => (
                      <li key={k.href}>
                        <MegaItem href={k.href} label={k.label} text={k.text} icon={<k.Icon size={22} aria-hidden className="text-brand-500" />} />
                      </li>
                    ))}
                  </ul>
                  <Link href="/marktdaten#ki" className="group flex flex-col bg-ink-950 p-6 text-white no-underline" style={{ borderRadius: 12 }}>
                    <span className="font-data text-[11.5px] uppercase tracking-[0.1em] text-accent">Marktdaten</span>
                    <span className="mt-3 font-data text-[52px] font-medium leading-none text-white">26 %</span>
                    <span className="mt-2 text-[14.5px] leading-snug text-white/75">der Unternehmen ab 10 Beschäftigten nutzen KI (Destatis, 2025).</span>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-[14.5px] font-medium text-accent">
                      Zum Dashboard <ArrowRight size={15} aria-hidden className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </MegaShell>
            )}
          </div>
        )}
      </header>

      {/* Dim the page while a mega menu is open */}
      {open && <div aria-hidden className="fixed inset-0 z-40 hidden bg-ink-950/20 lg:block" onMouseEnter={leave} onClick={() => setOpen(null)} />}

      {/* ---------- Mobile menu ---------- */}
      {mobile && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 z-40 flex flex-col overflow-y-auto bg-white lg:hidden" style={{ top: panelTop }} role="dialog" aria-modal="true" aria-label="Menü">
          <div className="container-page flex-1 py-5">
            <form onSubmit={search} role="search">
              <label htmlFor="mobile-q" className="sr-only">Ratgeber durchsuchen</label>
              <div className="flex h-12 items-center gap-3 border border-ink-950/15 bg-surface-1 px-4" style={{ borderRadius: 8 }}>
                <MagnifyingGlass size={20} aria-hidden className="text-ink-500" />
                <input id="mobile-q" name="q" type="search" placeholder="Wonach suchen Sie?" className="w-full bg-transparent text-[16px] outline-none" />
              </div>
            </form>

            <Accordion title="Ratgeber" defaultOpen>
              <ul className="space-y-1">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/ratgeber/kategorie/${c.slug}`} className="flex items-center justify-between gap-3 py-2.5 no-underline">
                      <span className="flex items-center gap-3">
                        <Icon name={c.icon} size={20} className="text-brand-500" />
                        {c.name}
                      </span>
                      <span className="font-data text-[12px] text-ink-500">{counts[c.slug] ?? 0}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-2">
                  <Link href="/ratgeber" className="link-arrow">Alle Ratgeber →</Link>
                </li>
              </ul>
            </Accordion>
            <Link href="/magazin" className="flex items-center justify-between border-b border-line py-4 font-display text-[20px] font-medium no-underline">
              Magazin <ArrowRight size={18} aria-hidden className="text-ink-500" />
            </Link>
            <Accordion title="Software">
              <ul className="space-y-1">
                {TOOLS.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="flex items-center gap-3 py-2.5 font-medium no-underline">
                      <t.Icon size={20} aria-hidden className="text-brand-500" /> {t.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mega-head mt-4">Software-Profile</p>
              <ul className="mt-2 grid grid-cols-2 gap-x-4">
                {software.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/software/${s.slug}`} className="block py-2 text-[15px] text-ink-700 no-underline">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>
            <Accordion title="Wissen">
              <ul className="space-y-1">
                {KNOWLEDGE.map((k) => (
                  <li key={k.href}>
                    <Link href={k.href} className="flex items-center gap-3 py-2.5 no-underline">
                      <k.Icon size={20} aria-hidden className="text-brand-500" /> {k.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </Accordion>
          </div>
          <div className="sticky bottom-0 border-t border-line bg-white">
            <div className="container-page grid grid-cols-2 gap-3 py-4">
              <Link href="/software/finder" className="btn btn-outline btn-md">
                <span className="btn-label" data-text="Software-Finder"><span>Software-Finder</span></span>
              </Link>
              <Link href="/newsletter" className="btn btn-ink btn-md">
                <span className="btn-label" data-text="Newsletter"><span>Newsletter</span></span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Trigger({
  id,
  label,
  open,
  active,
  onEnter,
  onToggle,
}: {
  id: MenuId;
  label: string;
  open: MenuId | null;
  active: boolean;
  onEnter: (id: MenuId) => void;
  onToggle: (v: MenuId | null) => void;
}) {
  const isOpen = open === id;
  return (
    <button
      type="button"
      className="hnav inline-flex items-center gap-1.5 bg-transparent"
      data-active={active || isOpen || undefined}
      aria-expanded={isOpen}
      aria-controls={`mega-${id}`}
      onMouseEnter={() => onEnter(id)}
      onClick={() => onToggle(isOpen ? null : id)}
    >
      {label}
      <CaretDown size={13} weight="bold" aria-hidden className="transition-transform duration-200" style={{ transform: isOpen ? "rotate(180deg)" : undefined }} />
    </button>
  );
}

function MegaShell({ children, footer }: { children: ReactNode; footer: ReactNode }) {
  return (
    <>
      <div className="container-page py-9">{children}</div>
      <div className="border-t border-line bg-surface-1">
        <div className="container-page flex items-center gap-8 py-3.5 text-[14.5px]">{footer}</div>
      </div>
    </>
  );
}

function MegaItem({ href, label, text, icon }: { href: string; label: string; text: string; icon: ReactNode }) {
  return (
    <Link href={href} className="group flex gap-3.5 p-3 no-underline transition-colors hover:bg-surface-1" style={{ borderRadius: 8 }}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <span>
        <span className="block font-medium text-ink-950 group-hover:text-brand-700">{label}</span>
        <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-500">{text}</span>
      </span>
    </Link>
  );
}

function Accordion({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) {
  return (
    <details className="group border-b border-line py-4" open={defaultOpen}>
      <summary className="flex cursor-pointer list-none items-center justify-between font-display text-[20px] font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <CaretDown size={18} aria-hidden className="text-ink-500 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
