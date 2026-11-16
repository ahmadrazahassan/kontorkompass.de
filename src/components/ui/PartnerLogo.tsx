// Official vendor logos (from the vendors' own websites), shown unaltered for identification only.
// Rules: no recolouring, no cropping, no effects (Sage Programmbedingungen § 4.2 and general trademark practice).
const LOGOS: Record<string, { src: string; ratio: number; name: string }> = {
  sage: { src: "/logos/sage.svg", ratio: 250 / 141, name: "Sage" },
  lexware: { src: "/logos/lexware.svg", ratio: 100 / 15, name: "Lexware" },
  sevdesk: { src: "/logos/sevdesk.svg", ratio: 124 / 36, name: "sevdesk" },
  weclapp: { src: "/logos/weclapp.svg", ratio: 379.5 / 70.7, name: "weclapp" },
  personio: { src: "/logos/personio.svg", ratio: 122 / 24, name: "Personio" },
  // easybill.de header logo; Pipedrive header logo from pipedrive.com/de with the fill the vendor's own CSS applies (#017737). Both taken 16.11.2026.
  easybill: { src: "/logos/easybill.svg", ratio: 210 / 52, name: "easybill" },
  pipedrive: { src: "/logos/pipedrive.svg", ratio: 121 / 26, name: "Pipedrive" },
};

export function vendorKey(softwareSlug: string): keyof typeof LOGOS | null {
  if (softwareSlug.startsWith("sage")) return "sage";
  if (softwareSlug.startsWith("lexware")) return "lexware";
  if (softwareSlug.startsWith("sevdesk")) return "sevdesk";
  if (softwareSlug.startsWith("weclapp")) return "weclapp";
  if (softwareSlug.startsWith("personio")) return "personio";
  if (softwareSlug.startsWith("easybill")) return "easybill";
  if (softwareSlug.startsWith("pipedrive")) return "pipedrive";
  return null;
}

/** Logo on a neutral white tile. `height` is the logo's own height in px; width follows its proportions (capped). */
export function PartnerLogo({ slug, height = 24, maxWidth = 120, tile = true }: { slug: string; height?: number; maxWidth?: number; tile?: boolean }) {
  const key = vendorKey(slug);
  if (!key) return null;
  const l = LOGOS[key];
  const w = Math.min(maxWidth, Math.round(height * l.ratio));
  const h = Math.round(w / l.ratio);
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img src={l.src} alt={`Logo ${l.name}`} width={w} height={h} style={{ width: w, height: h, objectFit: "contain" }} />;
  if (!tile) return img;
  return (
    <span className="inline-flex items-center justify-center border border-line bg-white px-3 py-2" style={{ borderRadius: 8, minHeight: height + 18 }}>
      {img}
    </span>
  );
}
