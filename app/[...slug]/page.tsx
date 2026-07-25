import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { DocBreadcrumbs } from "@/components/docs/DocBreadcrumbs";
import { DocSidebar } from "@/components/docs/DocSidebar";
import { DocToc } from "@/components/docs/DocToc";
import { DocFooterNav } from "@/components/docs/DocFooterNav";
import { DocJsonLd } from "@/components/docs/DocJsonLd";
import { allDocs, docByUrl, sectionPages } from "@/lib/docs";
import { renderMarkdown } from "@/lib/markdown";

/**
 * Every curriculum page. One route, 150 prerendered HTML files.
 *
 * This is the change the audit was actually about: before it, the site had 106
 * markdown files of curriculum and exactly one indexable page, and every link the
 * site emitted pointed at github.com. `generateStaticParams` over content/ turns
 * the existing writing into the site's own indexable surface without anyone
 * writing a word of new copy.
 */

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return allDocs().map((doc) => ({ slug: doc.slug }));
}

function urlFrom(slug: string[]): string {
  return "/" + slug.join("/") + "/";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const doc = docByUrl(urlFrom((await params).slug));
  if (!doc) return {};

  // The section suffix keeps 21 pages called "README" and 6 called "Quiz" from
  // competing as identical <title>s in the same index.
  const title = doc.section && !doc.isIndex ? `${doc.title} — ${doc.section.label}` : doc.title;

  return {
    title,
    description: doc.description || undefined,
    alternates: { canonical: doc.url },
    openGraph: {
      type: "article",
      title,
      description: doc.description || undefined,
      url: doc.url,
    },
    twitter: { card: "summary_large_image", title, description: doc.description || undefined },
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const doc = docByUrl(urlFrom((await params).slug));
  if (!doc) notFound();

  const { html, headings } = renderMarkdown(doc.markdown, doc.sourcePath);
  const siblings = doc.section ? sectionPages(doc.section) : [];
  const index = siblings.findIndex((p) => p.url === doc.url);

  return (
    <>
      <NavBar />
      <DocJsonLd doc={doc} />
      <main id="top" className="mx-auto w-full max-w-6xl px-6 py-10 md:py-14">
        <DocBreadcrumbs doc={doc} />

        <div className="mt-8 gap-12 lg:grid lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,13rem)]">
          <DocSidebar doc={doc} siblings={siblings} />

          <article className="min-w-0">
            <header>
              {doc.section && (
                <p className="font-mono text-[11px] uppercase tracking-widest text-accent-2">
                  {doc.section.label}
                </p>
              )}
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
                {doc.title}
              </h1>
              {doc.description && (
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
                  {doc.description}
                </p>
              )}
            </header>

            {/* Not sanitised, deliberately: the only input is our own curriculum,
                vendored from a repo we control, rendered at build time into a
                static export. No request-time input reaches this string, so there
                is no untrusted path to sanitise. If content ever comes from
                anywhere else, this needs a sanitiser first. */}
            <div className="doc-prose mt-10" dangerouslySetInnerHTML={{ __html: html }} />

            <DocFooterNav
              doc={doc}
              prev={index > 0 ? siblings[index - 1] : undefined}
              next={index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined}
            />
          </article>

          <DocToc headings={headings} />
        </div>
      </main>
      <Footer />
    </>
  );
}
