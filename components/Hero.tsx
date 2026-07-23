import type { CSSProperties } from "react";
import { PillButton } from "@/components/ui/PillButton";
import { DepthField } from "@/components/DepthField";
import { hero } from "@/lib/content";

/**
 * Oversized headline, lede, two CTAs, a feature line, and the signature loop motif.
 * Visible-by-default: the hero content never depends on motion (the depth field and
 * the motif are decorative and reduced-motion-gated).
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
    >
      <DepthField />
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 py-24 md:py-32 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-5xl md:text-6xl">
            {hero.headline}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted">{hero.lede}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PillButton href={hero.primary.href} variant="solid" external>
              {hero.primary.label}
            </PillButton>
            <PillButton href={hero.secondary.href} variant="outline" external>
              {hero.secondary.label}
            </PillButton>
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
            {hero.featureLine}
          </p>
        </div>

        <LoopMotif />
      </div>
    </section>
  );
}

/**
 * The signature: a loop that quietly cycles. A gradient ring (olive → brass) with a
 * traveling dash, softly pulsing nodes, a breathing glow, and one bright sand node
 * orbiting the loop. Decorative (aria-hidden); all motion stops under reduced motion.
 */
function LoopMotif() {
  const R = 74;
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: 100 + R * Math.cos(angle), y: 100 + R * Math.sin(angle) };
  });

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="mx-auto hidden w-full max-w-sm lg:block"
    >
      <defs>
        <radialGradient id="motif-glow-grad">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="65%" stopColor="var(--accent)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="motif-ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--olive)" />
          <stop offset="55%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--olive)" />
        </linearGradient>
      </defs>

      {/* Breathing glow behind the loop */}
      <circle className="motif-glow" cx="100" cy="100" r="94" fill="url(#motif-glow-grad)" />

      {/* Faint concentric rings for depth */}
      <circle cx="100" cy="100" r="90" fill="none" stroke="var(--olive)" strokeOpacity="0.35" strokeWidth="1" />
      <circle cx="100" cy="100" r="56" fill="none" stroke="var(--olive)" strokeOpacity="0.22" strokeWidth="1" />

      {/* Connecting lines */}
      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        return (
          <line
            key={`edge-${i}`}
            x1={n.x}
            y1={n.y}
            x2={next.x}
            y2={next.y}
            stroke="var(--olive)"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
        );
      })}

      {/* The ring: gradient base + a traveling brass dash */}
      <circle cx="100" cy="100" r={R} fill="none" stroke="url(#motif-ring-grad)" strokeOpacity="0.5" strokeWidth="1.25" />
      <circle
        className="loop-dash"
        cx="100"
        cy="100"
        r={R}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.75"
        strokeDasharray="6 8"
      />

      {/* Pulsing nodes */}
      {nodes.map((n, i) => (
        <circle
          key={`node-${i}`}
          className="motif-node"
          style={{ "--i": i } as CSSProperties}
          cx={n.x}
          cy={n.y}
          r={i === 0 ? 5.5 : 4}
          fill={i === 0 ? "var(--accent)" : "var(--surface)"}
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
      ))}

      {/* A bright sand node orbiting the loop — the "current position" cycling round */}
      <g className="motif-orbit">
        <circle cx="100" cy={100 - R} r="9" fill="var(--accent)" fillOpacity="0.25" />
        <circle cx="100" cy={100 - R} r="4.5" fill="var(--text)" stroke="var(--accent)" strokeWidth="1.5" />
      </g>
    </svg>
  );
}
