import Link from "next/link";
import type { DocPage } from "@/lib/docs";

/**
 * Course → Section → Page. Renders the visible trail; the matching
 * BreadcrumbList JSON-LD lives in DocJsonLd so Google can render the same trail
 * in place of the raw URL in a result.
 */
export function DocBreadcrumbs({ doc }: { doc: DocPage }) {
  const trail = [
    { label: "Course", href: "/" },
    ...(doc.section ? [{ label: doc.section.label, href: doc.section.href + "/" }] : []),
  ];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-muted">
        {trail.map((crumb) => (
          <li key={crumb.href} className="flex items-center gap-2">
            <Link
              href={crumb.href}
              className="inline-flex min-h-[24px] items-center transition-colors hover:text-accent"
            >
              {crumb.label}
            </Link>
            <span aria-hidden="true" className="text-border">
              /
            </span>
          </li>
        ))}
        <li className="truncate text-text" aria-current="page">
          {doc.title}
        </li>
      </ol>
    </nav>
  );
}
