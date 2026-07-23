"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

/**
 * The hero's signature moment: a field of nodes across three depth layers (§6.2).
 * Two composed motions — scroll parallax (pure CSS, per-layer view() timeline) and
 * mouse drift (JS). Perf rules honoured:
 *   - Only transform/opacity move; blur is a static filter set once (compositor caches it).
 *   - Mouse drift writes a CSS var inside a rAF loop — never setState on pointermove.
 *   - Gated off for touch (pointer: coarse), hidden tabs, and reduced-motion.
 *   - 28 nodes total across 3 layers (budget ≤ 30 / ≤ 3 layers).
 * Decorative and inert: aria-hidden, pointer-events-none.
 */

type Node = { x: number; y: number; s: number; round: boolean; accent: boolean };

// Deterministic positions (percent) so server and client render identically.
const FAR: Node[] = [
  { x: 8, y: 18, s: 10, round: true, accent: false },
  { x: 22, y: 62, s: 8, round: false, accent: true },
  { x: 15, y: 88, s: 12, round: true, accent: false },
  { x: 34, y: 30, s: 7, round: true, accent: false },
  { x: 47, y: 74, s: 9, round: false, accent: false },
  { x: 61, y: 22, s: 8, round: true, accent: true },
  { x: 73, y: 58, s: 11, round: true, accent: false },
  { x: 84, y: 34, s: 7, round: false, accent: false },
  { x: 91, y: 78, s: 10, round: true, accent: false },
  { x: 55, y: 46, s: 6, round: true, accent: false },
  { x: 40, y: 12, s: 8, round: true, accent: false },
  { x: 68, y: 90, s: 9, round: false, accent: true },
];
const MID: Node[] = [
  { x: 12, y: 40, s: 14, round: true, accent: true },
  { x: 28, y: 78, s: 12, round: false, accent: false },
  { x: 44, y: 20, s: 16, round: true, accent: false },
  { x: 58, y: 66, s: 13, round: true, accent: true },
  { x: 70, y: 36, s: 15, round: false, accent: false },
  { x: 82, y: 62, s: 12, round: true, accent: false },
  { x: 20, y: 14, s: 11, round: true, accent: false },
  { x: 88, y: 20, s: 13, round: false, accent: true },
  { x: 36, y: 54, s: 12, round: true, accent: false },
  { x: 64, y: 84, s: 14, round: true, accent: false },
];
const NEAR: Node[] = [
  { x: 18, y: 58, s: 22, round: true, accent: true },
  { x: 42, y: 82, s: 26, round: false, accent: false },
  { x: 60, y: 28, s: 24, round: true, accent: true },
  { x: 78, y: 70, s: 20, round: false, accent: false },
  { x: 30, y: 34, s: 22, round: true, accent: false },
  { x: 86, y: 46, s: 24, round: true, accent: true },
];

function Nodes({ nodes }: { nodes: Node[] }) {
  return (
    <>
      {nodes.map((n, i) => (
        <span
          key={i}
          className="absolute block"
          style={{
            left: `${n.x}%`,
            top: `${n.y}%`,
            width: n.s,
            height: n.s,
            borderRadius: n.round ? "9999px" : "30%",
            background: n.accent ? "var(--accent)" : "var(--muted)",
          }}
        />
      ))}
    </>
  );
}

export function DepthField() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    // Respect user + device: no mouse drift for reduced-motion or touch pointers.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let tx = 0;
    let ty = 0; // target, normalised [-1, 1]
    let cx = 0;
    let cy = 0; // current (eased)
    let raf = 0;
    let running = true;

    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const tick = () => {
      if (!running) return;
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      // Opposite the cursor; written as a CSS var, no React re-render.
      el.style.setProperty("--mx", String(-cx));
      el.style.setProperty("--my", String(-cy));
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ "--mx": 0, "--my": 0 } as CSSProperties}
    >
      {/* Each layer: outer = scroll parallax (CSS), inner = mouse drift (CSS var). */}
      <div className="depth-far absolute inset-0 opacity-35 blur-[2px]">
        <div className="depth-drift-far absolute inset-0">
          <Nodes nodes={FAR} />
        </div>
      </div>
      <div className="depth-mid absolute inset-0 opacity-70">
        <div className="depth-drift-mid absolute inset-0">
          <Nodes nodes={MID} />
        </div>
      </div>
      <div className="depth-near absolute inset-0 opacity-50 blur-[6px]">
        <div className="depth-drift-near absolute inset-0">
          <Nodes nodes={NEAR} />
        </div>
      </div>
    </div>
  );
}
