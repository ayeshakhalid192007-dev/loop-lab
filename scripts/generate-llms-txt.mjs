/**
 * Writes public/llms.txt from the real route table.
 *
 * It was hand-maintained, and every one of its 14 links pointed at
 * github.com/…/blob/main/… — so the one file whose entire job is to tell an AI
 * engine where the canonical text lives was pointing at somebody else's domain.
 * Generating it from lib/docs.ts means the links are the site's own routes and
 * cannot drift from them.
 *
 * Worth being clear about what this file is: a convention, not a standard, and
 * Google has said it does not use it. It costs nothing to keep correct and some
 * assistants do read it. It is not a ranking lever and should not be treated as one.
 *
 * Imports lib/docs.ts directly — node strips the types.
 */
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { allDocs, SECTIONS } from "../lib/docs.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://ayeshakhalid192007-dev.github.io/loop-lab/";
const abs = (url) => SITE + url.replace(/^\//, "");

const docs = allDocs();
const byUrl = new Map(docs.map((d) => [d.url, d]));

/** Section groupings, in the order a reader would meet them. */
const GROUPS = [
  { heading: "Course", sections: ["/start-here", "/prerequisites", "/foundations", "/parts/the-shift", "/parts/heartbeat", "/parts/the-body", "/parts/the-spine", "/parts/complete-loop", "/parts/human-control"] },
  { heading: "Build", sections: ["/patterns", "/starters", "/projects", "/methods", "/operating", "/advanced"] },
  { heading: "Reference", sections: ["/certification", "/appendix", "/curriculum"] },
];

/** One line per page: title, URL, and its own description. */
function line(doc) {
  const desc = doc.description ? `: ${doc.description.replace(/\s+/g, " ")}` : "";
  return `- [${doc.title}](${abs(doc.url)})${desc}`;
}

let out = `# Loop Engineering Crash Course

> A free, open-source curriculum for loop engineering: designing control systems that keep
> AI coding agents working toward a goal over time. 6 parts, 14 steps, 20 starter kits,
> graded labs, and a Loop Ready certification. MIT licensed.

Loop engineering is the practice of designing the system that prompts an AI agent — its
trigger, instructions, guardrails, verification, state, and logging — rather than prompting
it by hand. Every production loop declares six parts: a heartbeat (when it runs), a body
(what it can do), a spine (what it remembers), a stopping condition (when it's done), a
checker (who verifies), and a human gate (where a person decides).

Every page below is published on this domain. The source markdown lives at
https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse.
`;

for (const group of GROUPS) {
  out += `\n## ${group.heading}\n\n`;
  for (const match of group.sections) {
    const section = SECTIONS.find((s) => s.match === match);
    if (!section) continue;
    const index = byUrl.get(section.match + "/");
    if (index) out += line(index) + "\n";
  }
}

// The glossary is the highest-value single page on the site for definitional
// queries, so it gets named explicitly rather than being buried under Foundations.
out += `\n## Key pages\n\n`;
for (const url of ["/foundations/glossary/", "/foundations/concepts/", "/foundations/primitives/", "/parts/the-shift/anatomy-of-a-loop/", "/about/"]) {
  const doc = byUrl.get(url);
  if (doc) out += line(doc) + "\n";
  else if (url === "/about/") out += `- [About the author](${abs(url)}): who writes this course\n`;
}

out += `\n## Optional\n\n- [Repository](https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse): source markdown, starter kits, and issues
- [License](https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse/blob/main/LICENSE): MIT

## Author

Ayesha Khalid — ${abs("/about/")}
`;

await writeFile(join(root, "public", "llms.txt"), out);
console.log(`  public/llms.txt  ${docs.length} pages indexed, ${out.split("\n").length} lines`);
