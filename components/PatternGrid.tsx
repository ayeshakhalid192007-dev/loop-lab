import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { patterns } from "@/lib/content";

/**
 * Production patterns as a real data table — cadence, a restrained risk mark, what
 * each one does, and outbound links to the write-up and its starter kit. A table,
 * not a card grid: dense, scannable, and honest about being a reference.
 */
export function PatternGrid() {
  return (
    <Section id="patterns" eyebrow="Patterns" title="Production patterns, ready to fork">
      <p className="mb-10 max-w-2xl text-muted">
        Six loops that already earn their keep. Each ships as a write-up plus a starter
        kit you can fork today.
      </p>

      <div className="overflow-x-auto border-y border-border">
        <table className="w-full min-w-[680px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border font-mono text-[11px] uppercase tracking-widest text-accent-2">
              <th scope="col" className="py-3 pr-4 font-medium">Pattern</th>
              <th scope="col" className="px-4 py-3 font-medium">Cadence</th>
              <th scope="col" className="px-4 py-3 font-medium">Risk</th>
              <th scope="col" className="px-4 py-3 font-medium">What it does</th>
              <th scope="col" className="py-3 pl-4 font-medium">Links</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patterns.map((p) => (
              <tr key={p.name} className="align-top transition-colors hover:bg-surface/40">
                <td className="py-4 pr-4">
                  <span className="font-display font-bold tracking-tight text-text">{p.name}</span>
                </td>
                <td className="px-4 py-4 font-mono text-xs uppercase tracking-wide text-muted">
                  {p.frequency}
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wide text-muted">
                    <span
                      aria-hidden="true"
                      className={`h-1.5 w-1.5 rounded-full ${p.risk === "low" ? "bg-olive" : "bg-accent"}`}
                    />
                    {p.risk}
                  </span>
                </td>
                <td className="max-w-sm px-4 py-4 text-muted">{p.blurb}</td>
                <td className="py-4 pl-4">
                  <div className="flex flex-col gap-1.5 whitespace-nowrap">
                    <ExternalLink
                      href={p.patternHref}
                      className="font-medium text-accent-2 transition-opacity hover:opacity-80"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
