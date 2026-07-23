import type { CSSProperties } from "react";
import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { patterns } from "@/lib/content";

/**
 * Production patterns you can fork. Each card carries its cadence, a restrained
 * risk chip (monochrome — the accent is reserved for CTAs), and two outbound links:
 * the pattern write-up and its starter kit.
 */
export function PatternGrid() {
  return (
    <Section id="patterns" eyebrow="Patterns" title="Production patterns, ready to fork">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {patterns.map((p, i) => (
          <li
            key={p.name}
            style={{ "--i": i } as CSSProperties}
            className="reveal-stagger flex flex-col rounded-xl border border-border bg-surface p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-lg font-bold tracking-tight">{p.name}</h3>
              <span className="shrink-0 rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted">
                {p.risk} risk
              </span>
            </div>

            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">
              {p.frequency}
            </p>

            <div className="mt-6 flex flex-1 items-end gap-4 text-sm font-medium">
              <ExternalLink
                href={p.patternHref}
                className="text-accent transition-opacity hover:opacity-80"
              >
                Pattern →
              </ExternalLink>
              <ExternalLink
                href={p.starterHref}
                className="text-muted transition-colors hover:text-text"
              >
                Starter kit →
              </ExternalLink>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
