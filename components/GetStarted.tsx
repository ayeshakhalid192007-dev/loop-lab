import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { CopyButton } from "@/components/ui/CopyButton";
import { getStarted } from "@/lib/content";

/**
 * The one cream band. A dark terminal block with the clone command + working copy
 * button, beside three numbered steps that each end in a repo link.
 */
export function GetStarted() {
  return (
    <Section id="start" paper eyebrow="Get started" title="Clone it and go">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
        <div className="overflow-hidden rounded-xl border border-border bg-bg">
          <div className="flex items-center gap-1.5 px-4 py-3">
            <span className="h-3 w-3 rounded-full border border-border" />
            <span className="h-3 w-3 rounded-full border border-border" />
            <span className="h-3 w-3 rounded-full border border-border" />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-4">
            <code className="min-w-0 truncate font-mono text-sm text-text">
              <span className="text-muted">$ </span>
              {getStarted.cloneCommand}
            </code>
            <CopyButton text={getStarted.cloneCommand} />
          </div>
        </div>

        <ol className="flex flex-col gap-6">
          {getStarted.steps.map((step, i) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper-ink/30 font-mono text-sm text-paper-ink">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-paper-ink">
                  <ExternalLink
                    href={step.href}
                    className="underline decoration-paper-ink/30 underline-offset-4 transition-colors hover:decoration-accent"
                  >
                    {step.title}
                  </ExternalLink>
                </h3>
                <p className="mt-1 text-sm text-paper-ink/70">{step.blurb}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
