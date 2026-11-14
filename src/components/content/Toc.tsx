"use client";

import { useEffect, useState } from "react";

export function Toc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    const onScroll = () => {
      const art = document.getElementById("artikel");
      if (!art) return;
      const r = art.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.6;
      setProgress(Math.min(1, Math.max(0, -r.top / Math.max(total, 1))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  return (
    <nav aria-label="Inhalt" className="text-[14px]">
      <p className="t-eyebrow mb-3">Inhalt</p>
      <div className="relative border-l border-line pl-4">
        <span aria-hidden className="absolute -left-px top-0 w-[2px] bg-brand-500" style={{ height: `${progress * 100}%`, transition: "height 120ms linear" }} />
        <ul className="space-y-2.5">
          {items.map((i) => (
            <li key={i.id}>
              <a href={`#${i.id}`} className="no-underline" style={{ color: active === i.id ? "var(--color-ink-950)" : "var(--color-ink-500)", fontWeight: active === i.id ? 500 : 400 }}>
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
