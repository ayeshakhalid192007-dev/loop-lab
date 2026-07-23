import { layers } from "@/lib/content";

/**
 * The runtime stack as a schematic: five plates, a beam of light descending the
 * left rail (work going down to real tools) and one climbing the right rail
 * (results returning to the gate). Decorative (aria-hidden) — the ordered list
 * beside it is the accessible, annotated version. The beams are pure SVG
 * stroke-dashoffset, gated for reduced motion in globals.css.
 */

const PLATE_H = 44;
const GAP = 12;
const TOP = 16;
const STEP = PLATE_H + GAP; // 56
const cy = (i: number) => TOP + i * STEP + PLATE_H / 2;

const FIRST = cy(0);
const LAST = cy(layers.length - 1);

export function LayerStack() {
  return (
    <svg
      viewBox="0 0 420 300"
      className="w-full max-w-[420px]"
      aria-hidden="true"
      role="presentation"
    >
      {/* left rail — work descends */}
      <line x1="28" y1={FIRST} x2="28" y2={LAST} stroke="var(--border)" strokeWidth="1.5" />
      <line
        x1="28"
        y1={FIRST}
        x2="28"
        y2={LAST}
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="10 34"
        className="beam-down"
      />
      {/* right rail — results climb */}
      <line x1="392" y1={FIRST} x2="392" y2={LAST} stroke="var(--border)" strokeWidth="1.5" />
      <line
        x1="392"
        y1={FIRST}
        x2="392"
        y2={LAST}
        stroke="var(--olive)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="10 34"
        className="beam-up"
      />

      {layers.map((layer, i) => {
        const y = TOP + i * STEP;
        const mid = y + PLATE_H / 2;
        return (
          <g key={layer.name}>
            <line x1="28" y1={mid} x2="60" y2={mid} stroke="var(--border)" strokeWidth="1.5" />
            <line x1="360" y1={mid} x2="392" y2={mid} stroke="var(--border)" strokeWidth="1.5" />
            <rect
              x="60"
              y={y}
              width="300"
              height={PLATE_H}
              rx="8"
              fill="var(--surface)"
              stroke="var(--border)"
            />
            <text
              x="76"
              y={mid}
              dominantBaseline="middle"
              className="font-mono"
              fontSize="10"
              letterSpacing="1"
              fill="var(--accent-2)"
            >
              L{i}
            </text>
            <text
              x="104"
              y={mid}
              dominantBaseline="middle"
              className="font-display"
              fontSize="13"
              fontWeight="700"
              fill="var(--text)"
            >
              {layer.name}
            </text>
            <text
              x="348"
              y={mid}
              textAnchor="end"
              dominantBaseline="middle"
              className="font-mono"
              fontSize="9"
              letterSpacing="1"
              fill="var(--muted)"
            >
              {layer.maps.toUpperCase()}
            </text>
          </g>
        );
      })}

      {/* rail captions */}
      <text
        x="28"
        y={LAST + 22}
        textAnchor="middle"
        className="font-mono"
        fontSize="8.5"
        letterSpacing="1.5"
        fill="var(--muted)"
      >
        WORK ↓
      </text>
      <text
        x="392"
        y={FIRST - 10}
        textAnchor="middle"
        className="font-mono"
        fontSize="8.5"
        letterSpacing="1.5"
        fill="var(--muted)"
      >
        ↑ RESULTS
      </text>
    </svg>
  );
}
