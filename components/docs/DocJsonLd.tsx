import type { DocPage } from "@/lib/docs";
import {
  SITE,
  ORG_ID,
  MAINTAINER_IDS,
  COURSE_ID,
  DATE_MODIFIED,
  DATE_PUBLISHED,
  organization,
  maintainers,
} from "@/lib/schema";

/**
 * Per-page structured data: a LearningResource tied back to the Course, plus the
 * BreadcrumbList that matches the visible trail.
 *
 * LearningResource rather than Article because that is what these pages are, and
 * `isPartOf` pointing at the course's @id is what tells Google the 150 pages are
 * one body of work rather than 150 unrelated documents.
 */
export function DocJsonLd({ doc }: { doc: DocPage }) {
  const url = SITE + doc.url.replace(/^\//, "");

  const graph: Record<string, unknown>[] = [
    {
      "@type": "LearningResource",
      "@id": `${url}#page`,
      name: doc.title,
      ...(doc.description ? { description: doc.description } : {}),
      url,
      inLanguage: "en",
      isAccessibleForFree: true,
      license: "https://opensource.org/licenses/MIT",
      datePublished: DATE_PUBLISHED,
      dateModified: DATE_MODIFIED,
      isPartOf: { "@id": COURSE_ID },
      author: MAINTAINER_IDS.map((id) => ({ "@id": id })),
      publisher: { "@id": ORG_ID },
      ...(doc.section ? { learningResourceType: doc.section.label } : {}),
    },
    // The Course, Organization and Person the nodes above reference. Included in
    // full rather than left as bare @id references so each page's graph resolves
    // on its own — a crawler that only ever fetches one deep curriculum page still
    // learns who wrote it and what it is part of. Deliberately *not* the FAQPage
    // node: those seven answers are not displayed here, and FAQ markup on a page
    // that does not show the content is invalid.
    {
      "@type": "Course",
      "@id": COURSE_ID,
      name: "Loop Engineering Crash Course",
      url: SITE,
      provider: { "@id": ORG_ID },
      author: MAINTAINER_IDS.map((id) => ({ "@id": id })),
    },
    organization,
    ...maintainers,
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Course", item: SITE },
        ...(doc.section
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: doc.section.label,
                item: SITE + doc.section.href.replace(/^\//, "") + "/",
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: doc.section ? 3 : 2,
          name: doc.title,
          item: url,
        },
      ],
    },
  ];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
