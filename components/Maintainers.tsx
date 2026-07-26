import { Section } from "@/components/ui/Section";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { MAINTAINER_PROFILES } from "@/lib/schema";

/**
 * Two maintainer cards, closing the page before the footer. The Hero byline names
 * the maintainers for anyone skimming the top of the page; this section is the
 * fuller, harder-to-miss version for anyone who reads to the bottom — a real
 * avatar, a role label, and a link to their GitHub profile, not a text-xs credit
 * line easy to mistake for boilerplate.
 */
export function Maintainers() {
  return (
    <Section id="maintainers" eyebrow="Who's behind this" title="Meet the maintainers">
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        {MAINTAINER_PROFILES.map((m, i) => (
          <div
            key={m.name}
            className="reveal-stagger"
            style={{ "--i": i } as React.CSSProperties}
          >
            <SpotlightCard className="flex h-full flex-col items-start gap-4 rounded-2xl border border-border bg-surface/40 p-8 transition-colors hover:border-accent">
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 bg-accent/10 font-display text-lg font-bold text-accent">
                {m.initials}
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent-2">
                  Maintainer
                </p>
                <h3 className="mt-1 font-display text-xl font-bold tracking-tight text-text">
                  {m.name}
                </h3>
              </div>
              <ExternalLink
                href={m.github}
                className="group mt-auto inline-flex min-h-[24px] items-center gap-1.5 text-sm text-muted transition-colors hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 2.87-.39c.97.01 1.95.13 2.87.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.8 1.18 1.82 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.15 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
                GitHub
                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  →
                </span>
              </ExternalLink>
            </SpotlightCard>
          </div>
        ))}
      </div>
    </Section>
  );
}
