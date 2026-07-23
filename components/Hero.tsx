import { PillButton } from "@/components/ui/PillButton";
import { LiveTerminal } from "@/components/LiveTerminal";
import { hero } from "@/lib/content";

/**
 * Oversized headline, lede, two CTAs, and a feature line — then the signature: a
 * live terminal scaffolding a loop, the thesis of the whole course shown rather
 * than told. Single-column and visible-by-default; the terminal degrades to a full
 * static transcript under reduced-motion / no-JS.
 */
export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden border-b border-border">
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-24 text-center md:py-28">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/50 px-3.5 py-1 font-mono text-[11px] uppercase tracking-widest text-accent-2">
          <span className="pulse-dot" aria-hidden="true" />
          Agents that run on a heartbeat
        </p>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-text sm:text-5xl md:text-6xl">
          {hero.headline}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{hero.lede}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillButton href={hero.primary.href} variant="solid" external>
            {hero.primary.label}
          </PillButton>
          <PillButton href={hero.secondary.href} variant="outline" external>
            {hero.secondary.label}
          </PillButton>
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
          {hero.featureLine}
        </p>

        <div className="reveal mt-14">
          <LiveTerminal />
        </div>
      </div>
    </section>
  );
}
