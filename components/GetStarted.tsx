import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { CloneTerminal } from "@/components/CloneTerminal";
import { getStarted } from "@/lib/content";

/**
 * The one cream band. An interactive clone terminal (copy the command and watch it
 * clone) beside three sequenced steps drawn as a connected timeline — the order is the
 * path through the course, so the spine that joins them is load-bearing, not decoration.
 */
export function GetStarted() {
  return (
    <Section id="start" paper eyebrow="Get started" title="Clone it and go">
      <div className="reveal grid gap-12 lg:grid-cols-2 lg:items-start">
        <CloneTerminal
          command={getStarted.cloneCommand}
          dir={getStarted.repoDir}
          summary={getStarted.cloneSummary}
        />

        <ol className="relative flex flex-col gap-8">
          {/* the spine — a hairline joining the numbered nodes */}
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-4 top-4 w-px -translate-x-1/2 bg-paper-ink/15"
          />
          {getStarted.steps.map((step, i) => (
            <li key={step.title} className="relative flex gap-4">
              <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper-ink/30 bg-paper font-mono text-sm text-paper-ink">
                {i + 1}
              </span>
              <div className="pt-0.5">
                <h3 className="font-display text-lg font-bold tracking-tight text-paper-ink">
                  <ExternalLink
                    href={step.href}
                    className="group inline-flex items-center gap-1.5 underline decoration-paper-ink/25 underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {step.title}
                    <span
                      aria-hidden="true"
                      className="text-accent transition-transform duration-200 group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </ExternalLink>
                </h3>
                <p className="mt-1.5 text-sm text-paper-ink/85">{step.blurb}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
