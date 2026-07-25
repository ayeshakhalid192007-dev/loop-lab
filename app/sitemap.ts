import type { MetadataRoute } from "next";
import { allDocs, SECTIONS } from "@/lib/docs";
import { SITE } from "@/lib/schema";

/**
 * Emitted to out/sitemap.xml and served at /loop-lab/sitemap.xml, since the whole
 * export is published under the project-site basePath.
 *
 * Trailing slashes are required throughout: next.config sets `trailingSlash: true`
 * and every URL here must match the canonical the page emits exactly. A mismatch
 * tells Google two different things about the same page.
 *
 * There is deliberately no app/robots.ts — on *.github.io, robots.txt is only
 * honoured at the domain root, which a project site does not control. That makes
 * this file the only discovery path Google has, so it must be complete: it is
 * submitted by hand in Search Console and pushed to Bing by scripts/indexnow.mjs.
 *
 * Priorities are relative, not absolute: the homepage, then the section indexes
 * (which are the hub pages), then individual lessons.
 */
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sectionIndexes = new Set(SECTIONS.map((s) => s.match + "/"));

  return [
    { url: SITE, lastModified, changeFrequency: "weekly" as const, priority: 1 },
    {
      url: `${SITE}about/`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    ...allDocs().map((doc) => ({
      url: SITE + doc.url.replace(/^\//, ""),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: sectionIndexes.has(doc.url) ? 0.8 : 0.6,
    })),
  ];
}
