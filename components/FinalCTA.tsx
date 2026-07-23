import { Section } from "@/components/ui/Section";
import { PillButton } from "@/components/ui/PillButton";
import { finalCta } from "@/lib/content";

/** Dark closing section: one big headline, one pill to the repo. */
export function FinalCTA() {
  return (
    <Section id="final" className="text-center">
      <h2 className="reveal mx-auto max-w-2xl font-display text-3xl font-extrabold tracking-tight md:text-5xl">
        {finalCta.headline}
      </h2>
      <div className="reveal mt-8 flex justify-center">
        <PillButton href={finalCta.cta.href} variant="solid" external>
          {finalCta.cta.label}
        </PillButton>
      </div>
    </Section>
  );
}
