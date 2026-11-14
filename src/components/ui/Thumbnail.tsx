import Image from "next/image";
import type { Doc } from "@/content/data";
import { briefImage } from "@/lib/brief-images";
import { Contour, Halftone } from "./Pattern";
import { LogoMark } from "./Logo";

export type Cover = { src: string; alt: string; aiGenerated: boolean };
type DocWithCover = Doc & { cover?: Cover | null };

// One place that decides an article's thumbnail: CMS upload > curated brief image > branded fallback.
export function coverFor(doc: DocWithCover): Cover | undefined {
  return doc.cover ?? briefImage(doc) ?? undefined;
}

const THEMES = [
  { bg: "#004796", fg: "#FFFFFF", sub: "rgb(255 255 255 / 0.72)", a: "#006BFF", b: "#003672", pattern: "contour" },
  { bg: "#EBF3FF", fg: "#0E1420", sub: "#3D4656", a: "#006BFF", b: "#EBF3FF", pattern: "halftone" },
  { bg: "#0E1420", fg: "#FFFFFF", sub: "rgb(255 255 255 / 0.7)", a: "#0AE8F0", b: "#0E1420", pattern: "halftone" },
  { bg: "#F4F5F7", fg: "#0E1420", sub: "#3D4656", a: "#006BFF", b: "#004796", pattern: "contour" },
] as const;

/**
 * Article thumbnail. Shows the photo or illustration when one exists, otherwise a branded
 * cover with category and title so every article always has a proper thumbnail.
 */
export function Thumbnail({
  doc,
  categoryName,
  sizes,
  priority = false,
  compact = false,
  showCaption = true,
}: {
  doc: DocWithCover;
  categoryName?: string;
  sizes: string;
  priority?: boolean;
  compact?: boolean;
  showCaption?: boolean;
}) {
  const cover = coverFor(doc);
  if (cover) {
    return (
      <>
        <Image src={cover.src} alt={cover.alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </>
    );
  }

  const t = THEMES[doc.coverSeed % THEMES.length];
  return (
    <div
      role="img"
      aria-label={`Titelbild: ${doc.title}`}
      className="absolute inset-0 overflow-hidden"
      style={{ background: t.bg, containerType: "inline-size" }}
    >
      <div className="absolute inset-0">
        {t.pattern === "contour" ? (
          <Contour seed={doc.coverSeed} a={t.a} b={t.b} className="h-full w-full" />
        ) : (
          <Halftone dot={t.a} bg={t.bg} focal={[0.8, 0.45]} pitch={compact ? 14 : 20} className="h-full w-full" />
        )}
        {/* Fades the pattern into the background on the text side, so there is no hard edge. */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${t.bg} 38%, transparent 72%)` }} />
      </div>
      {!compact && (
        <div className="relative flex h-full w-[66%] flex-col justify-between p-[5.5%]">
          <p className="font-data uppercase tracking-[0.08em]" style={{ color: t.sub, fontSize: "clamp(10px, 1.6cqw, 15px)" }}>
            {doc.kind === "ratgeber" ? "Ratgeber" : "Magazin"}
            {categoryName ? ` · ${categoryName}` : ""}
          </p>
          <p className="font-display font-medium leading-[1.08] tracking-[-0.02em]" style={{ color: t.fg, fontSize: "clamp(17px, 5.2cqw, 64px)" }}>
            {doc.seoTitle}
          </p>
          <LogoMark size={22} mono={t.fg === "#FFFFFF" ? "white" : undefined} />
        </div>
      )}
    </div>
  );
}
