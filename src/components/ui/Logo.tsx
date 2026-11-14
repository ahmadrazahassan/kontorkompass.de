import Link from "next/link";

/**
 * "Kompass-K" symbol, redrawn on a 94 × 100 grid from the chosen concept.
 * Stem + a floating triangle (upper arm) + a 45° leg that meets the triangle at one point.
 * The gap between stem and triangle forms the K in negative space; arm and leg read as a needle.
 */
export const LOGO_PATHS = {
  stem: "M0 0H32V100H0Z",
  arm: "M44 0H94L44 50Z",
  leg: "M44 50L94 100H70L32 62Z",
};
export const LOGO_VIEWBOX = "0 0 94 100";

export function LogoMark({ size = 28, mono }: { size?: number; mono?: "white" | "ink" }) {
  const fill = mono === "white" ? "#FFFFFF" : mono === "ink" ? "#0E1420" : "#006BFF";
  return (
    <svg width={Math.round(size * 0.94)} height={size} viewBox={LOGO_VIEWBOX} aria-hidden="true" focusable="false">
      <path d={LOGO_PATHS.stem} fill={fill} />
      <path d={LOGO_PATHS.arm} fill={fill} />
      <path d={LOGO_PATHS.leg} fill={fill} />
    </svg>
  );
}

export function Logo({ mono, className = "" }: { mono?: "white" | "ink"; className?: string }) {
  return (
    <Link href="/" aria-label="Kontorkompass – zur Startseite" className={`inline-flex items-center gap-3 no-underline ${className}`}>
      <LogoMark mono={mono} size={26} />
      <span
        className="font-display text-[23px] font-semibold leading-none tracking-[-0.025em]"
        style={{ color: mono === "white" ? "#fff" : "#0E1420" }}
      >
        kontorkompass
      </span>
    </Link>
  );
}
