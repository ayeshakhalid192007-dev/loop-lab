import { PillButton } from "@/components/ui/PillButton";
import { DepthField } from "@/components/DepthField";
import { hero } from "@/lib/content";

/**
 * Oversized headline, lede, two CTAs, and a feature line, single-column. Visible-by-
 * default: the hero content never depends on motion (the depth field is decorative
 * and reduced-motion-gated).
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
    >
      <DepthField />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-24 text-center md:py-32">
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
      </div>
    </section>
  );
}
