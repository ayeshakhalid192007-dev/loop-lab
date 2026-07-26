/**
 * The deploy-time basePath, for URLs Next will not rewrite for us.
 *
 * GitHub Pages serves this project site from /loop-lab, so next.config sets
 * `basePath` from PAGES_BASE_PATH. Next applies that automatically to <Link> and
 * <Image> — but *not* to raw HTML. The curriculum pages are rendered markdown, so
 * every internal link and every diagram in them is a plain <a href> / <img src>
 * in an HTML string, and without this they would resolve to /parts/heartbeat/
 * instead of /loop-lab/parts/heartbeat/ and 404 on the live site while working
 * perfectly in local dev.
 */
const basePath = process.env.PAGES_BASE_PATH || "";

/** Prefix a site-absolute path with the basePath. Leaves absolute URLs alone. */
export function withBasePath(path: string): string {
  if (!path.startsWith("/")) return path;
  return basePath + path;
}
