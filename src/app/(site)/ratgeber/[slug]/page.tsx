import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE, SITE } from "@/lib/site";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/content/ArticlePage";
import { ArticleBody } from "@/components/content/ArticleBody";
import { getDoc, getDocs } from "@/lib/cms";
import { briefShareImage } from "@/lib/brief-images";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getDocs("ratgeber")).map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getDoc("ratgeber", slug);
  if (!doc) return {};
  const share = doc.cover?.src ?? briefShareImage(doc);
  const images = share ? [{ url: share, width: 1200, height: 630, alt: doc.cover?.alt ?? doc.title }] : [DEFAULT_OG_IMAGE];
  return {
    title: doc.seoTitle,
    description: doc.description,
    alternates: { canonical: `/ratgeber/${doc.slug}` },
    openGraph: { title: doc.seoTitle, description: doc.description, type: "article", publishedTime: doc.published, modifiedTime: doc.updated, images },
    twitter: { card: "summary_large_image", title: doc.seoTitle, description: doc.description, images: [share ?? SITE.shareImage] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const doc = await getDoc("ratgeber", slug);
  if (!doc) notFound();
  return (
    <ArticlePage doc={doc}>
      <ArticleBody doc={doc} />
    </ArticlePage>
  );
}
