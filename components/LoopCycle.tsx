import { loopCycle } from "@/lib/content";

/**
 * The page's signature: the operational loop as a ring of eight stages with a
 * pulse travelling clockwise around it — the heartbeat, made visible. The SVG is
 * decorative (aria-hidden); the ordered list beside it is the real, accessible
 * content and the readable version on narrow screens. Reduced-motion users get a
 * still ring (the spin is CSS, gated in globals.css).
 */

// Eight nodes evenly spaced on a circle (r=150) centred at 220,220, starting at top.
const NODES = [
  { x: 220, y: 70, lx: 220, ly: 50, anchor: "middle" as const },
  { x: 326, y: 114, lx: 342, ly: 104, anchor: "start" as const },
  { x: 370, y: 220, lx: 388, ly: 224, anchor: "start" as const },
  { x: 326, y: 326, lx: 342, ly: 344, anchor: "start" as const },
  { x: 220, y: 370, lx: 220, ly: 398, anchor: "middle" as const },
  { x: 114, y: 326, lx: 98, ly: 344, anchor: "end" as const },
  { x: 70, y: 220, lx: 52, ly: 224, anchor: "end" as const },
  { x: 114, y: 114, lx: 98, ly: 104, anchor: "end" as const },
];

export function LoopCycle() {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <svg
        viewBox="0 0 440 440"
        className="mx-auto w-full max-w-[420px]"
        aria-hidden="true"
        role="presentation"
      >
        {/* the ring */}
        <circle
          cx="220"
          cy="220"
          r="150"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
          strokeDasharray="2 7"
          strokeLinecap="round"
        />
        <circle cx="220" cy="220" r="150" fill="none" stroke="var(--olive)" strokeWidth="1.5" opacity="0.35" />

        {/* travelling pulse */}
        <g className="loop-spin">
          <circle cx="220" cy="70" r="14" fill="var(--accent)" opacity="0.18" />
          <circle cx="220" cy="70" r="5" fill="var(--accent)" />
        </g>

        {/* nodes + labels */}
        {NODES.map((n, i) => (
          <g key={loopCycle[i].short}>
            <circle cx={n.x} cy={n.y} r="9" fill="var(--surface)" stroke="var(--accent)" strokeWidth="1.5" />
            <circle cx={n.x} cy={n.y} r="3" fill="var(--accent)" />
            <text
              x={n.lx}
              y={n.ly}
              textAnchor={n.anchor}
              dominantBaseline="middle"
              className="font-mono"
              fontSize="13"
              fill="var(--text)"
            >
              {loopCycle[i].short}
            </text>
          </g>
        ))}

        {/* centre caption */}
        <text x="220" y="214" textAnchor="middle" className="font-mono" fontSize="11" fill="var(--muted)" letterSpacing="2">
          ONE BEAT
        </text>
        <text x="220" y="236" textAnchor="middle" className="font-mono" fontSize="11" fill="var(--muted)" letterSpacing="2">
          8 STAGES
        </text>
      </svg>

      <ol className="relative flex flex-col gap-0 border-l border-border pl-6">
        {loopCycle.map((stage, i) => (
          <li key={stage.short} className="relative py-2.5">
            <span
              className="absolute -left-[31px] top-3.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-accent"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent-2">
              {String(i + 1).padStart(2, "0")}
            </span>{" "}
            <span className="font-display text-sm font-bold tracking-tight text-text">{stage.name}</span>
            <p className="mt-0.5 text-sm text-muted">{stage.role}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
