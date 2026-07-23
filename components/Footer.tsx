import { ExternalLink } from "@/components/ui/ExternalLink";
import { footer, nav } from "@/lib/content";

/**
 * Dark footer: wordmark + one-line note, then a grid of outbound links to the repo.
 * Every link goes out through ExternalLink so target/rel stay safe.
 */
export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-base font-extrabold tracking-tight text-text">
            {nav.wordmark}
          </p>
          <p className="mt-3 text-sm text-muted">{footer.note}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3">
            {footer.columns.map((c) => (
              <li key={c.label}>
                <ExternalLink
                  href={c.href}
                  className="text-sm text-muted transition-colors hover:text-accent"
                >
                  {c.label}
                </ExternalLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
