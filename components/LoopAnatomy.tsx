import { Section } from "@/components/ui/Section";
import { LoopCycle } from "@/components/LoopCycle";
import { loopParts } from "@/lib/content";

/**
 * What one loop actually looks like: the signature ring diagram of the eight
 * operational stages, followed by the six conceptual parts every loop is made of.
 * No card grid — a diagram and a ruled definition list.
 */
export function LoopAnatomy() {
  return (
    <Section id="anatomy" eyebrow="Anatomy of a loop" title="What one loop looks like">
      <p className="mb-12 max-w-2xl text-muted">
        A loop is not a prompt you re-send. It&apos;s a cycle that schedules itself, does
        the work in isolation, gets graded by a second pair of eyes, and stops at a human.
        Then it beats again.
      </p>

      <div className="reveal">
        <LoopCycle />
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <h3 className="font-display text-xl font-bold tracking-tight">The six parts</h3>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Drop any one and the loop earns a familiar failure name — no heartbeat and it&apos;s
          a script you run by hand; no checker and it grades itself; no human gate and it
          ships with no owner.
        </p>

        <dl className="mt-8 divide-y divide-border border-y border-border">
          {loopParts.map((part) => (
            <div key={part.name} className="grid gap-1 py-4 sm:grid-cols-[200px_1fr] sm:gap-6">
              <dt className="flex items-baseline gap-2">
                <span className="font-display text-base font-bold tracking-tight text-text">
                  {part.name}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-widest text-accent-2">
                  {part.metaphor}
                </span>
              </dt>
              <dd className="text-sm text-muted">{part.answers}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}
