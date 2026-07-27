import Link from "next/link";
import { SECTIONS, type DocPage } from "@/lib/docs";

/**
 * Two lists: every section of the course, and every page inside the current one.
 *
 * Deliberately not the whole 150-page tree on every page. A full nav would put
 * ~150 links into all 150 documents — a lot of HTML, and it flattens the link
 * graph so that no page signals which others are actually related to it. Section
 * list plus current-section contents gives each page a compact, meaningful set of
 * internal links, which is the shape crawlers read as site structure.
 */
export function DocSidebar({ doc, siblings }: { doc: DocPage; siblings: DocPage[] }) {
  return (
    <nav aria-label="Course sections" className="mb-12 min-w-0 lg:mb-0">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-2">
        Course
      </p>
      <ul className="mt-4 flex flex-col gap-1 border-l border-border">
        {SECTIONS.map((section) => {
          const active = doc.section?.match === section.match;
          return (
            <li key={section.match}>
              <Link
                href={section.href + "/"}
                aria-current={active ? "true" : undefined}
                className={
                  "-ml-px flex min-h-[24px] items-center border-l py-1 pl-4 text-sm transition-colors " +
                  (active
                    ? "border-accent font-medium text-text"
                    : "border-transparent text-muted hover:border-border-hover hover:text-text")
                }
              >
                {section.label}
              </Link>
            </li>
          );
        })}
      </ul>

      {siblings.length > 1 && doc.section && (
        <>
          <p className="mt-10 font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-2">
            {doc.section.label}
          </p>
          <ul className="mt-4 flex flex-col gap-1 border-l border-border">
            {siblings.map((page) => {
              const active = page.url === doc.url;
              return (
                <li key={page.url}>
                  <Link
                    href={page.url}
                    aria-current={active ? "page" : undefined}
                    className={
                      "-ml-px flex min-h-[24px] items-center border-l py-1 pl-4 text-sm transition-colors " +
                      (active
                        ? "border-accent font-medium text-text"
                        : "border-transparent text-muted hover:border-border-hover hover:text-text")
                    }
                  >
                    {page.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </nav>
  );
}
