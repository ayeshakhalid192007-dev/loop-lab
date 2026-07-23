"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

/**
 * A card that carries a soft brass spotlight tracking the pointer (the skiper-ui /
 * Motion hover pattern). The highlight is painted by CSS (.spotlight-card::before);
 * this only writes the pointer position to CSS vars inside the rAF-free handler —
 * no React re-render per move. It's a progressive enhancement: with no pointer the
 * card is a plain bordered panel, so it needs no reduced-motion gate.
 */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
  };

  return (
    <div ref={ref} onPointerMove={onMove} className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
}
