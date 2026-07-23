import { Section } from "@/components/ui/Section";
import { LayerStack } from "@/components/LayerStack";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { layers, autonomyLevels } from "@/lib/content";

/**
 * How the pieces stack, and how far you let a loop off the leash. Two diagrams —
 * a layered stack and a three-rung autonomy ladder — built as ruled panels, not a
 * card grid. Everything maps back to a real part of the anatomy or a real loop in
 * this repo.
 */
export function Architecture() {
  return (
    <Section id="architecture" eyebrow="Architecture" title="How a loop is built up">
      <p className="mb-12 max-w-2xl text-muted">
        The same five layers under every loop. A human designs the top; work descends to
        real tools at the bottom; results climb back up to the gate.
      </p>

      {/* The stack — annotated list (accessible) beside the live schematic */}
      <div className="reveal grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
        <ol className="flex flex-col gap-2">
          {layers.map((layer, i) => (
            <li
              key={layer.name}
              className="flex items-start gap-4 rounded-lg border border-border bg-surface/50 px-5 py-4"
              style={{ marginLeft: `${i * 14}px`, marginRight: `${(layers.length - 1 - i) * 14}px` }}
            >
              <span className="mt-0.5 font-mono text-[11px] uppercase tracking-widest text-accent-2">
                L{i}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base font-bold tracking-tight text-text">
                  {layer.name}
                </h3>
                <p className="mt-0.5 text-sm text-muted">{layer.role}</p>
              </div>
              <span className="shrink-0 self-center rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                {layer.maps}
              </span>
            </li>
          ))}
        </ol>

        {/* runtime schematic — decorative twin of the list */}
        <div className="hidden justify-center lg:flex">
          <LayerStack />
        </div>
      </div>

      {/* Autonomy ladder */}
      <div className="mt-16 border-t border-border pt-12">
        <h3 className="font-display text-xl font-bold tracking-tight">Three rungs of autonomy</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Every loop starts on the bottom rung and earns its way up. You decide how far.
        </p>

        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {autonomyLevels.map((lvl, i) => (
            <li key={lvl.level}>
              <SpotlightCard className="flex h-full flex-col rounded-lg border border-border bg-surface/50 p-5 transition-colors hover:border-accent/50">
                <div className="flex items-center gap-2">
                  <span className="font-display text-2xl font-extrabold tracking-tight text-accent">
                    {lvl.level}
                  </span>
                  <span className="font-display text-base font-bold tracking-tight text-text">
                    {lvl.name}
                  </span>
                </div>
                {/* rising meter: fuller as autonomy grows */}
                <span className="mt-3 flex h-1 gap-1" aria-hidden="true">
                  {[0, 1, 2].map((seg) => (
                    <span
                      key={seg}
                      className={`h-full flex-1 rounded-full ${seg <= i ? "bg-accent" : "bg-border"}`}
                    />
                  ))}
                </span>
                <p className="mt-4 text-sm text-muted">{lvl.blurb}</p>
                <p className="mt-3 font-mono text-[11px] uppercase tracking-wide text-accent-2">
                  {lvl.example}
                </p>
              </SpotlightCard>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
