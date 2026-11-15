// 404 for URLs that match no route at all. Needed because the app has two root layouts
// (site and Payload admin), so Next.js cannot use (site)/not-found.tsx for unknown URLs.
// This file bypasses the layouts, so it loads the styles and fonts itself.
import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Fira_Sans, Saira } from "next/font/google";
import "./(site)/globals.css";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/lib/site";
import NotFound from "./(site)/not-found";

const bricolage = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-bricolage", display: "swap" });
const fira = Fira_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-fira", display: "swap", weight: ["400", "500", "600"] });
const saira = Saira({ subsets: ["latin", "latin-ext"], variable: "--font-saira", display: "swap" });

export const metadata: Metadata = {
  title: `Seite nicht gefunden | ${SITE.name}`,
  description: "Diese Seite gibt es nicht (mehr).",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="de" className={`${bricolage.variable} ${fira.variable} ${saira.variable}`}>
      <body>
        <header className="border-b border-ink-950/10">
          <div className="container-page flex h-[76px] items-center">
            <Logo />
          </div>
        </header>
        <main id="inhalt">
          <NotFound />
        </main>
        <footer className="border-t border-ink-950/10">
          <div className="container-page flex flex-wrap gap-x-6 gap-y-2 py-6 text-[14px]">
            <Link href="/ratgeber">Ratgeber</Link>
            <Link href="/software">Software-Profile</Link>
            <Link href="/kontakt">Kontakt</Link>
            <Link href="/impressum">Impressum</Link>
            <Link href="/datenschutz">Datenschutz</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
