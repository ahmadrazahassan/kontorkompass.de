import Image from "next/image";

// Avatar is the only element allowed to be fully round (see scripts/lint-shapes.mjs).
export function Avatar({
  initials,
  src,
  alt,
  size = 32,
}: {
  initials: string;
  /** When set, shows a real photo instead of the initials. */
  src?: string;
  alt?: string;
  size?: number;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={size}
        height={size}
        sizes={`${size}px`}
        className="inline-block shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-brand-700 font-data text-white"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initials}
    </span>
  );
}
