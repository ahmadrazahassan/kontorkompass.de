import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Fira_Sans, Saira } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DEFAULT_OG_IMAGE, SITE } from "@/lib/site";
import { getCategories, getDocs, getSoftwareList } from "@/lib/cms";


const bricolage = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-bricolage", display: "swap" });
const fira = Fira_Sans({ subsets: ["latin", "latin-ext"], variable: "--font-fira", display: "swap", weight: ["400", "500", "600"] });
const saira = Saira({ subsets: ["latin", "latin-ext"], variable: "--font-saira", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name}: Ratgeber für B2B-Software in Deutschland`, template: `%s | ${SITE.name}` },
  description: SITE.description,
  // No site-wide canonical/hreflang here: child pages inherit it, so every page without its own canonical would point to the homepage.
  openGraph: { type: "website", locale: "de_DE", siteName: SITE.name, images: [DEFAULT_OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [SITE.shareImage] },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [categories, docs, software] = await Promise.all([getCategories(), getDocs(), getSoftwareList()]);
  const counts = Object.fromEntries(categories.map((c) => [c.slug, docs.filter((d) => d.category === c.slug).length]));
  const menuSoftware = software.map((s) => ({ slug: s.slug, name: s.name, category: categories.find((c) => c.slug === s.categories[0])?.name ?? "" }));
  return (
    <html lang="de" className={`${bricolage.variable} ${fira.variable} ${saira.variable}`}>
      <body>
        <Header categories={categories} counts={counts} software={menuSoftware} />
        <main id="inhalt">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
