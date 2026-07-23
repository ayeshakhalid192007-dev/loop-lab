import { PillButton } from "@/components/ui/PillButton";
import { DepthField } from "@/components/DepthField";
import { hero } from "@/lib/content";

/**
 * Oversized headline, lede, two CTAs, a feature line, and a static loop motif.
 * Visible-by-default: no opacity/transform tricks here — the signature hero motion
 * (depth field + drawn connectors) is layered on in step 8.
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

/** Static decorative ring of connected nodes — a loop. Purely ornamental. */
function LoopMotif() {
  const nodes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: 100 + 74 * Math.cos(angle), y: 100 + 74 * Math.sin(angle) };
  });

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className="mx-auto hidden w-full max-w-xs text-accent lg:block"
    >
      <circle
        cx="100"
        cy="100"
        r="74"
        fill="none"
        stroke="var(--border)"
        strokeWidth="1"
      />
      {/* A constant, subtle signal that something is cycling (§6.3). */}
      <circle
        className="loop-dash"
        cx="100"
        cy="100"
        r="74"
        fill="none"
        stroke="var(--accent)"
        strokeOpacity="0.55"
        strokeWidth="1.5"
        strokeDasharray="6 8"
      />
      {nodes.map((n, i) => {
        const next = nodes[(i + 1) % nodes.length];
        return (
          <line
            key={`edge-${i}`}
            x1={n.x}
            y1={n.y}
            x2={next.x}
            y2={next.y}
            stroke="var(--border)"
            strokeWidth="1"
          />
        );
      })}
      {nodes.map((n, i) => (
        <circle
          key={`node-${i}`}
          cx={n.x}
          cy={n.y}
          r={i === 0 ? 6 : 4}
          fill={i === 0 ? "var(--accent)" : "var(--surface)"}
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
      ))}
    </svg>
  );
}
