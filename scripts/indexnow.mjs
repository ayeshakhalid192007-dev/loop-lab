/**
 * Submits every URL in the built sitemap to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Why this exists: on *.github.io a project site cannot serve a root robots.txt,
 * so there is no `Sitemap:` line for crawlers to discover. Search Console handles
 * Google; IndexNow is the equivalent push channel for Bing — which matters here
 * because the Bing index is what feeds Microsoft Copilot and is an input to
 * ChatGPT search.
 *
 * Key placement: IndexNow scopes a key to the directory the key file sits in, so
 * public/<key>.txt is served at /loop-lab/<key>.txt and authorises exactly the
 * /loop-lab/* URLs this site owns. A host-root key is impossible here and is also
 * unnecessary.
 *
 * Usage:
 *   npm run build && node scripts/indexnow.mjs          # submit
 *   node scripts/indexnow.mjs --dry-run                 # print what would be sent
 *
 * Safe to re-run: IndexNow is idempotent and rate-limits rather than penalises.
 */
import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "ayeshakhalid192007-dev.github.io";
const dryRun = process.argv.includes("--dry-run");

// The key is whichever <32-hex>.txt file is in public/ — kept as a file rather than
// an env var because the file itself IS the ownership proof and must ship anyway.
const keyFile = (await readdir(join(root, "public"))).find((f) => /^[0-9a-f]{8,128}\.txt$/.test(f));
if (!keyFile) {
  console.error("No IndexNow key file in public/. Expected <hex>.txt.");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");

const sitemap = await readFile(join(root, "out", "sitemap.xml"), "utf8").catch(() => {
  console.error("out/sitemap.xml not found — run `npm run build` first.");
  process.exit(1);
});

const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) {
  console.error("Sitemap contained no <loc> entries.");
  process.exit(1);
}

console.log(`${urlList.length} URLs, key ${key}`);
if (dryRun) {
  urlList.forEach((u) => console.log("  " + u));
  process.exit(0);
}

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/loop-lab/${keyFile}`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted but key still being validated (normal on first run).
console.log(`IndexNow responded ${res.status} ${res.statusText}`);
if (!res.ok && res.status !== 202) {
  console.error(await res.text());
  process.exit(1);
}
