import Link from "next/link";
import { PillButton } from "@/components/ui/PillButton";
import { LiveTerminal } from "@/components/LiveTerminal";
import { hero } from "@/lib/content";
import { AUTHOR_NAME, DATE_MODIFIED, DATE_PUBLISHED } from "@/lib/schema";

const fmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

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
        <p className="mx-auto mt-4 font-display text-2xl font-bold tracking-tight text-accent-2 sm:text-3xl">
          {hero.tagline}
        </p>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{hero.lede}</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillButton href={hero.primary.href} variant="solid">
            {hero.primary.label}
          </PillButton>
          <PillButton href={hero.secondary.href} variant="outline">
            {hero.secondary.label}
          </PillButton>
        </div>

        <p className="mt-8 font-mono text-xs uppercase tracking-widest text-muted">
          {hero.featureLine}
        </p>

        {/* Byline and dates. The Person node in the schema named an author the page
            itself never did, and there was no publish or updated date anywhere in
            the rendered HTML. In a field moving this fast, a reader deciding whether
            a course on agent loops is current has nothing else to go on — and the
            schema's datePublished/dateModified should have something visible backing
            them rather than asserting a date the page never shows. */}
        <p className="mt-5 text-xs text-muted">
          By{" "}
          <Link
            href="/about/"
            rel="author"
            className="inline-flex min-h-[24px] items-center underline decoration-border underline-offset-4 transition-colors hover:text-text hover:decoration-accent"
          >
            {AUTHOR_NAME}
          </Link>{" "}
          · Published <time dateTime={DATE_PUBLISHED}>{fmt(DATE_PUBLISHED)}</time> · Updated{" "}
          <time dateTime={DATE_MODIFIED}>{fmt(DATE_MODIFIED)}</time>
        </p>

        <div className="reveal mt-14">
          <LiveTerminal />
        </div>
      </div>
    </section>
  );
}
