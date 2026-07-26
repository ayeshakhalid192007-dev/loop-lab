import type { Heading } from "@/lib/markdown";

/**
 * On-page contents, xl and up. Every entry targets a real heading id, which is
 * also what makes an individual definition on the glossary page directly linkable
 * — the unit an AI engine cites is a passage, not a document.
 */
export function DocToc({ headings }: { headings: Heading[] }) {
  const items = headings.filter((h) => h.depth <= 2);
  if (items.length < 2) return <div aria-hidden="true" className="hidden xl:block" />;

  return (
    <nav aria-label="On this page" className="hidden xl:block">
      <div className="sticky top-24">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-2">
          On this page
        </p>
        <ul className="mt-4 flex flex-col gap-1">
          {items.map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={
                  "flex min-h-[24px] items-center py-0.5 text-sm text-muted transition-colors hover:text-accent " +
                  (h.depth === 2 ? "pl-3" : "")
                }
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
