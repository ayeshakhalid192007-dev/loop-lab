import type { ReactElement } from "react";
import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { buildingBlocks } from "@/lib/content";

/** Minimal inline stroke icons, one per primitive. Purely decorative (aria-hidden). */
const ICONS: Record<string, ReactElement> = {
  Scheduling: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l3 2" />
    </>
  ),
  Worktrees: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="9" r="2.5" />
      <path d="M6 8.5v7M6 15.5c6 0 9-1 9-6" />
    </>
  ),
  Skills: (
    <>
      <rect x="4" y="4" width="10" height="10" rx="2" />
      <path d="M10 10h10v10H10z" />
    </>
  ),
  Connectors: (
    <>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M8.5 12h7" />
    </>
  ),
  "Sub-agents": (
    <>
      <circle cx="9" cy="12" r="4" />
      <circle cx="15" cy="12" r="4" />
    </>
  ),
  State: (
    <>
      <ellipse cx="12" cy="6" rx="7" ry="2.5" />
      <path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6" />
      <path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
    </>
  ),
};

/**
 * The six primitives (the Body layer) as a ruled editorial list, not a card grid.
 * Each row is a single outbound link to the doc that teaches it: an accent icon,
 * the name, its one-line job, and a "Learn" affordance that reveals on hover.
 */
export function BuildingBlocks() {
  return (
    <Section id="blocks" eyebrow="Building blocks" title="The primitives you compose">
      <p className="mb-10 max-w-2xl text-muted">
        Six moving parts. Learn each on its own, then wire them into a loop that runs
        without you.
      </p>

      <ul className="divide-y divide-border border-y border-border">
        {buildingBlocks.map((block) => (
          <li key={block.title}>
            <ExternalLink
              href={block.href}
              className="group flex items-center gap-5 py-5 transition-colors hover:bg-surface/40"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent transition-colors group-hover:border-accent">
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  {ICONS[block.title]}
                </svg>
              </span>
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold tracking-tight text-text">
                  {block.title}
                </h3>
                <p className="mt-0.5 text-sm text-muted">{block.blurb}</p>
              </div>
              <span
                aria-hidden="true"
                className="ml-auto shrink-0 text-sm font-medium text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:text-accent-2 group-hover:opacity-100"
              >
                Learn →
              </span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
