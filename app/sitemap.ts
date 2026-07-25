import type { MetadataRoute } from "next";

/**
 * Emitted to out/sitemap.xml at build time and served at /loop-lab/sitemap.xml,
 * since the whole export is published under the project-site basePath.
 *
 * The trailing slash is required: next.config sets `trailingSlash: true`, and this
 * URL must match the canonical in app/layout.tsx exactly. A mismatch here tells
 * Google two different things about the same page.
 *
 * There is deliberately no app/robots.ts — on *.github.io, robots.txt is only
 * honored at the domain root, which a project site does not control. Discovery
 * happens through Search Console sitemap submission instead.
 */
// Required by `output: "export"` — without it the sitemap route is treated as
// dynamic and the static export fails to collect it.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://ayeshakhalid192007-dev.github.io/loop-lab/",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
