// Generative brand patterns (halftone + contour). Server-rendered SVG, brand colours only.
import Image from "next/image";
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export function Halftone({
  dot = "#006BFF",
  bg = "#EBF3FF",
  focal = [0.3, 0.55],
  pitch = 22,
  width = 800,
  height = 600,
  className = "",
}: {
  dot?: string;
  bg?: string;
  focal?: [number, number];
  pitch?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const dots: { x: number; y: number; r: number }[] = [];
  const maxR = pitch * 0.46;
  const R = Math.hypot(width, height) * 0.62;
  for (let y = pitch / 2; y < height; y += pitch) {
    for (let x = pitch / 2; x < width; x += pitch) {
      const d = Math.hypot(x - focal[0] * width, y - focal[1] * height) / R;
      const t = Math.max(0, 1 - d);
      const r = maxR * t * t * (3 - 2 * t);
      if (r > 0.6) dots.push({ x, y, r });
    }
  }
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" role="presentation">
      <rect width={width} height={height} fill={bg} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(2)} fill={dot} />
      ))}
    </svg>
  );
}

export function Contour({
  a = "#006BFF",
  b = "#004796",
  bands = 12,
  seed = 7,
  width = 800,
  height = 640,
  className = "",
}: {
  a?: string;
  b?: string;
  bands?: number;
  seed?: number;
  width?: number;
  height?: number;
  className?: string;
}) {
  const r = rng(seed);
  const id = `warp-${seed}`;
  const cx = width * (0.4 + r() * 0.2);
  const cy = height * (0.4 + r() * 0.2);
  const max = Math.hypot(width, height) * 0.75;
  const rings = Array.from({ length: bands }, (_, i) => bands - i);
  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true" role="presentation">
      <defs>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency={(0.0035 + r() * 0.002).toFixed(4)} numOctaves="2" seed={seed} result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={Math.round(width * 0.28)} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <rect width={width} height={height} fill={b} />
      <g filter={`url(#${id})`}>
        {rings.map((n, i) => (
          <circle key={i} cx={cx} cy={cy} r={(max / bands) * n} fill={i % 2 === 0 ? a : b} />
        ))}
      </g>
    </svg>
  );
}

export function CategoryCover({ index, className = "" }: { index: number; className?: string }) {
  const covers = [
    'buchhaltung-finanzen', 'rechnungsstellung-e-rechnung', 'lohn-gehalt',
    'hr-personal', 'erp-warenwirtschaft', 'zeiterfassung',
  ];
  return <Image src={`/media/categories/kategorie-${covers[index % covers.length]}.svg`} alt="" fill sizes="200px" className={`object-cover ${className}`} />;
}
