"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Ambient background: three soft brand-coloured blooms that drift and breathe behind
 * the whole page, giving the flat olive field a slow sense of depth. Fixed and inert,
 * sitting below the dot-grid (z -2 vs the grid's -1) so the grid still reads on top.
 *
 * Only transform + opacity animate (loop-constraints.md), and the whole thing is
 * gated on prefers-reduced-motion: with motion reduced the blooms render once and
 * hold — no drift, no pulse. Purely decorative, so it's hidden from assistive tech.
 */
const BLOOMS = [
  {
    color: "var(--accent)",
    size: 620,
    left: "-8%",
    top: "-14%",
    drift: { x: [0, 40, -20, 0], y: [0, 24, -16, 0], opacity: [0.5, 0.68, 0.5] },
    duration: 26,
  },
  {
    color: "var(--olive)",
    size: 560,
    left: "58%",
    top: "-6%",
    drift: { x: [0, -34, 18, 0], y: [0, 26, -12, 0], opacity: [0.45, 0.62, 0.45] },
    duration: 32,
  },
  {
    color: "var(--accent-2)",
    size: 480,
    left: "26%",
    top: "34%",
    drift: { x: [0, 24, -28, 0], y: [0, -22, 14, 0], opacity: [0.35, 0.5, 0.35] },
    duration: 38,
  },
];

export function AnimatedBackground() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-[2] overflow-hidden">
      {BLOOMS.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            top: b.top,
            background: `radial-gradient(circle, color-mix(in srgb, ${b.color} 26%, transparent), transparent 68%)`,
            filter: "blur(56px)",
            willChange: "transform, opacity",
          }}
          initial={{ opacity: b.drift.opacity[0] }}
          animate={
            reduce
              ? { opacity: b.drift.opacity[0] }
              : { x: b.drift.x, y: b.drift.y, opacity: b.drift.opacity }
          }
          transition={
            reduce
              ? undefined
              : { duration: b.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
          }
        />
      ))}
    </div>
  );
}
