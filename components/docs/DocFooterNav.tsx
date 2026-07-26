import Link from "next/link";
import { ExternalLink } from "@/components/ui/ExternalLink";
import type { DocPage } from "@/lib/docs";

/**
 * Previous / next through the section, plus the "view source" link.
 *
 * The source link is deliberately secondary and deliberately last: GitHub is
 * where the file lives, but this page is now the canonical place to read it, and
 * the audit's finding was that every link the site emitted said otherwise.
 */
export function DocFooterNav({
  doc,
  prev,
  next,
}: {
  doc: DocPage;
  prev?: DocPage;
  next?: DocPage;
}) {
  return (
    <footer className="mt-16 border-t border-border pt-8">
      {(prev || next) && (
        <nav aria-label="Course pagination" className="grid gap-4 sm:grid-cols-2">
          {prev ? (
            <Link
              href={prev.url}
              rel="prev"
              className="group rounded-lg border border-border p-4 transition-colors hover:border-accent"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                ← Previous
              </span>
              <span className="mt-1 block font-display font-bold tracking-tight transition-colors group-hover:text-accent">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={next.url}
              rel="next"
              className="group rounded-lg border border-border p-4 text-right transition-colors hover:border-accent sm:col-start-2"
            >
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">
                Next →
              </span>
              <span className="mt-1 block font-display font-bold tracking-tight transition-colors group-hover:text-accent">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}

      <p className="mt-8 text-sm text-muted">
        <ExternalLink
          href={doc.githubUrl}
          className="inline-flex min-h-[24px] items-center underline decoration-border underline-offset-4 transition-colors hover:text-text hover:decoration-accent"
        >
          View source on GitHub
        </ExternalLink>
      </p>
    </footer>
  );
}
