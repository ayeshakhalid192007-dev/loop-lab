import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { loopParts } from "@/lib/content";

/**
 * The course's own anatomy of a loop — a horizontal strip of six numbered stages
 * (Heartbeat → … → Human gate), connected by a line on wide screens and stacking to
 * a vertical list on mobile. Static here; step 8 draws the connector on scroll.
 */
export function LoopAnatomy() {
  return (
    <Section
      id="anatomy"
      eyebrow="Anatomy of a loop"
      title="Six parts of every loop"
    >
      <p className="mb-10 max-w-2xl text-muted">
        Drop any one of them and the loop earns a familiar failure name — no
        heartbeat and it&apos;s a script you run by hand; no checker and it grades
        itself; no human gate and it ships with no owner.
      </p>

      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {loopParts.map((part, i) => (
          <li
            key={part.name}
            style={{ "--i": i } as CSSProperties}
            className="reveal-stagger relative rounded-xl border border-border bg-surface p-4 lg:after:absolute lg:after:top-[34px] lg:after:left-full lg:after:h-px lg:after:w-4 lg:after:bg-border lg:last:after:hidden"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-accent font-mono text-sm text-accent">
              {i + 1}
            </span>
            <h3 className="mt-3 font-display text-base font-bold tracking-tight">
              {part.name}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-accent">
              {part.metaphor}
            </p>
            <p className="mt-2 text-sm text-muted">{part.answers}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
