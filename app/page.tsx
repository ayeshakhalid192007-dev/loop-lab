import { PillButton } from "@/components/ui/PillButton";
import { Section } from "@/components/ui/Section";

const swatches: [name: string, varName: string][] = [
  ["bg", "--bg"],
  ["surface", "--surface"],
  ["border", "--border"],
  ["text", "--text"],
  ["muted", "--muted"],
  ["accent", "--accent"],
  ["paper", "--paper"],
];

export default function Home() {
  return (
    <main>
      <Section eyebrow="Step 1 — Design system" title="Palette & primitives">
        <p className="mb-8 max-w-xl text-muted">
          Scaffold checkpoint: fonts, tokens, and the two shared primitives render in
          the real palette. This page is replaced by the Hero in step 3.
        </p>

        <div className="flex flex-wrap gap-4">
          <PillButton href="#" variant="solid">
            Solid pill
          </PillButton>
          <PillButton href="#" variant="outline">
            Outline pill
          </PillButton>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map(([name, varName]) => (
            <div key={name} className="rounded-lg border border-border p-3">
              <div
                className="h-12 w-full rounded"
                style={{ background: `var(${varName})` }}
              />
              <p className="mt-2 font-mono text-xs text-muted">{name}</p>
            </div>
          ))}
        </div>
      </Section>
    </main>
  );
}
