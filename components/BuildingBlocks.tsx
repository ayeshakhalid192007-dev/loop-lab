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
 * Six primitive cards (the Body layer). Each is an outbound link to the doc that
 * teaches it, with a minimal inline icon and a one-line blurb.
 */
export function BuildingBlocks() {
  return (
    <Section
      id="blocks"
      eyebrow="Building blocks"
      title="The primitives you compose"
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {buildingBlocks.map((block) => (
          <li key={block.title}>
            <ExternalLink
              href={block.href}
              className="group flex h-full flex-col rounded-xl border border-border bg-surface p-6 transition-colors hover:border-accent"
            >
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-accent"
              >
                {ICONS[block.title]}
              </svg>
              <h3 className="mt-4 font-display text-lg font-bold tracking-tight">
                {block.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{block.blurb}</p>
              <span className="mt-4 text-sm font-medium text-muted transition-colors group-hover:text-accent">
                Learn →
              </span>
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
