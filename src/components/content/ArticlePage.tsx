import Link from "next/link";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Toc } from "./Toc";
import {
  AffiliateDisclosure,
  Breadcrumbs,
  Callout,
  Faq,
  GuideCard,
  KeyTakeaways,
  SourcesList,
} from "./Blocks";
import type { Doc } from "@/content/data";
import { getAffiliateSoftwareIds, getCategory, getDocs, hasActiveAffiliateLinks, softwareBoxIds } from "@/lib/cms";
import { AUTHOR, OPERATOR, SITE } from "@/lib/site";
import { LinkedInLogo } from "@/components/ui/LinkedInLogo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Thumbnail, coverFor } from "@/components/ui/Thumbnail";
import { PartnerOffers, getPartnerOffers } from "./PartnerOffers";

export async function ArticlePage({ doc, children }: { doc: Doc; children: ReactNode }) {
  const cat = await getCategory(doc.category);
  const DOCS = await getDocs();
  // The ad notice only shows while a partner programme is really active; otherwise links are plain editorial links.
  // Partner offers (ad block) for this topic; when present, the page carries Werbelinks and gets the notice too.
  const offers = await getPartnerOffers({ category: doc.category, limit: 2 });
  // Notice when the page really carries Werbelinks: a software box whose link is a Werbelink, the partner block, or the editor's manual flag.
  const affiliateIds = await getAffiliateSoftwareIds();
  const boxIsAffiliate = softwareBoxIds((doc as { body?: unknown }).body).some((id) => affiliateIds.has(id));
  const showAdNotice = boxIsAffiliate || offers.length > 0 || (doc.hasAffiliate && (await hasActiveAffiliateLinks()));
  const isGuide = doc.kind === "ratgeber";
  const related = DOCS.filter((d) => d.slug !== doc.slug).slice(0, 3);
  const url = `${SITE.url}/${doc.kind}/${doc.slug}`;
  const heroImage = coverFor(doc);

  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: doc.title,
      description: doc.description,
      datePublished: doc.published,
      dateModified: doc.updated,
      inLanguage: "de-DE",
      author: {
        "@type": "Person",
        name: AUTHOR.name,
        jobTitle: OPERATOR.role,
        url: `${SITE.url}${AUTHOR.profile}`,
        sameAs: [AUTHOR.linkedin],
        worksFor: { "@type": "Organization", name: OPERATOR.company },
      },
      publisher: { "@type": "Organization", name: SITE.name, url: SITE.url, logo: { "@type": "ImageObject", url: `${SITE.url}/brand/icon-512.png` } },
      mainEntityOfPage: url,
      image: heroImage ? [new URL(heroImage.src, SITE.url).toString()] : undefined,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Startseite", item: SITE.url },
        { "@type": "ListItem", position: 2, name: isGuide ? "Ratgeber" : "Magazin", item: `${SITE.url}/${doc.kind}` },
        { "@type": "ListItem", position: 3, name: doc.title, item: url },
      ],
    },
    ...(doc.faqs.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: doc.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]
      : []),
  ];

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      {/* Header */}
      <div className="container-page pt-8 lg:pt-12">
        <Breadcrumbs
          items={[
            { label: "Startseite", href: "/" },
            { label: isGuide ? "Ratgeber" : "Magazin", href: `/${doc.kind}` },
            { label: cat?.name ?? "" },
          ]}
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Link href={`/${doc.kind}`} className="link-arrow !text-[14px] !text-ink-700">
              ← Zurück zu {isGuide ? "Ratgebern" : "Magazin"}
            </Link>
          </div>
          <div>
            <p className="t-eyebrow">{cat?.name}</p>
            <h1 className="t-h1 mt-4">{doc.title}</h1>
            <p className="t-lead mt-6 max-w-[62ch]">{doc.lead}</p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-b border-line pb-6 text-[14px] sm:grid-cols-2 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div />
          <dl className="flex flex-wrap items-center gap-x-10 gap-y-3">
            <div className="flex items-center gap-2.5">
              <Avatar initials={AUTHOR.initials} src={AUTHOR.photo} alt="" size={36} />
              <div>
                <dt className="sr-only">Autor</dt>
                <dd className="font-medium">
                  <Link href={AUTHOR.profile} className="text-ink-950 no-underline hover:text-brand-700">
                    {AUTHOR.name}
                  </Link>
                </dd>
                <dd className="text-[13px] text-ink-500">{AUTHOR.role}</dd>
              </div>
            </div>
            <div>
              <dt className="t-eyebrow">Lesezeit</dt>
              <dd>{doc.readingMinutes} Min.</dd>
            </div>
          </dl>
        </div>

        {showAdNotice && (
          <div className="mt-6 max-w-3xl lg:ml-[calc(33.333%+21px)]">
            <AffiliateDisclosure />
          </div>
        )}

        <figure className="mt-8">
          <div className="relative aspect-[16/9] overflow-hidden" style={{ borderRadius: 12 }}>
            <Thumbnail doc={doc} categoryName={cat?.name} priority showCaption={false} sizes="(min-width: 1280px) 1200px, 100vw" />
          </div>
        </figure>
      </div>

      {/* Body */}
      <div className="container-page mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,720px)] xl:grid-cols-[240px_minmax(0,720px)_1fr] xl:gap-16">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <Toc items={doc.toc} />
          </div>
        </aside>
        <div id="artikel">
          <details className="mb-8 border border-line p-4 lg:hidden" style={{ borderRadius: 12 }}>
            <summary className="t-eyebrow cursor-pointer">Inhalt</summary>
            <ul className="mt-3 space-y-2 text-[15px]">
              {doc.toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`}>{t.label}</a>
                </li>
              ))}
            </ul>
          </details>
          <KeyTakeaways items={doc.takeaways} />
          <div className="prose-de mt-10">{children}</div>

          {doc.faqs.length > 0 && (
            <section className="mt-14" aria-labelledby="faq">
              <h2 id="faq" className="t-h2 mb-6">
                Häufige Fragen
              </h2>
              <Faq items={doc.faqs} />
            </section>
          )}

          {doc.legalDisclaimer && (
            <Callout kind="legal" title="Hinweis">
              <p>Dieser Beitrag ersetzt keine Rechts- oder Steuerberatung.</p>
            </Callout>
          )}

          {offers.length > 0 && <PartnerOffers category={doc.category} limit={2} compact />}

          <SourcesList ids={doc.sourceIds} />

          <div className="mt-10 flex items-start gap-4 border-t border-line pt-8">
            <Avatar initials={AUTHOR.initials} src={AUTHOR.photo} alt={`${AUTHOR.name}, ${AUTHOR.role}`} size={56} />
            <div>
              <p className="t-eyebrow">Autor</p>
              <p className="mt-1 font-medium">
                <Link href={AUTHOR.profile} className="text-ink-950 no-underline hover:text-brand-700">
                  {AUTHOR.name}
                </Link>
              </p>
              <p className="text-[14px] text-ink-500">{AUTHOR.role}</p>
              <p className="mt-2 text-[15px] text-ink-700">
                {AUTHOR.name} verantwortet die Inhalte von {SITE.name}. Jeder Beitrag stützt sich auf die oben genannten Quellen.{" "}
                <Link href="/methodik">So arbeiten wir</Link>
              </p>
              <a href={AUTHOR.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-[14px] no-underline">
                <LinkedInLogo size={16} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="hidden xl:block" />
      </div>

      {/* Related + newsletter */}
      <section className="section mt-16 border-t border-line">
        <div className="container-page">
          <h2 className="t-h2">Das könnte Sie auch interessieren</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {related.map((d) => (
              <GuideCard key={d.slug} doc={d} />
            ))}
            <div className="border border-line p-6" style={{ borderRadius: 12 }}>
              <p className="t-eyebrow">Software-Verzeichnis</p>
              <p className="t-h3 mt-3">Preise und Funktionen im Überblick</p>
              <div className="mt-6">
                <Button href="/software" variant="outline" size="sm">
                  Zum Verzeichnis
                </Button>
              </div>
            </div>
          </div>
          <div className="panel mt-16 grid gap-8 p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <h2 className="t-h2">Wichtige Fristen nicht verpassen.</h2>
              <p className="mt-3 text-ink-700">Neue Ratgeber und Änderungen bei Pflichten, einmal im Monat.</p>
            </div>
            <div className="self-end">
              <NewsletterForm id="article" />
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
