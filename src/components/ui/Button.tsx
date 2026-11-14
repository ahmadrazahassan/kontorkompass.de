import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

type Variant = "primary" | "ink" | "outline" | "light";

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  arrow = false,
  external = false,
  affiliate = false,
  className = "",
}: {
  href: string;
  children: string;
  variant?: Variant;
  size?: "md" | "sm";
  arrow?: boolean;
  external?: boolean;
  affiliate?: boolean;
  className?: string;
}) {
  const label = affiliate ? `${children}*` : children;
  const inner: ReactNode = (
    <>
      <span className="btn-label" data-text={label}>
        <span>{label}</span>
      </span>
      {arrow && <ArrowRight aria-hidden className="btn-arrow" weight="regular" />}
    </>
  );
  const cls = `btn btn-${variant} btn-${size} ${className}`;
  if (external || affiliate) {
    return (
      <a href={href} className={cls} target="_blank" rel={affiliate ? "sponsored nofollow noopener" : "nofollow noopener"}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
