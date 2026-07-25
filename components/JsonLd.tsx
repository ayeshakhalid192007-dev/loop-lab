/**
 * Structured data for the site, emitted as a single JSON-LD @graph in <head>.
 *
 * Nodes are cross-referenced by @id so Course → provider/author resolve to the
 * Organization and Person rather than duplicating them inline. FAQ answers are
 * lifted from the course glossary (docs/02-foundations/glossary.md) so the markup
 * and the prose stay in agreement — a mismatch there is a structured-data warning.
 */

const SITE = "https://ayeshakhalid192007-dev.github.io/loop-lab/";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": `${SITE}#course`,
      name: "Loop Engineering Crash Course",
      description:
        "A free, open-source curriculum for loop engineering: designing control systems that keep AI coding agents working toward a goal over time. 6 parts, 20 starter kits, graded labs, and a Loop Ready certification.",
      url: SITE,
      isAccessibleForFree: true,
      inLanguage: "en",
      license: "https://opensource.org/licenses/MIT",
      teaches: [
        "Agent loop design",
        "Heartbeat scheduling",
        "Git worktrees for agents",
        "Skills and connectors (MCP)",
        "Sub-agent orchestration",
        "Human-in-the-loop control",
      ],
      provider: { "@id": `${SITE}#org` },
      author: { "@id": `${SITE}#author` },
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT6H",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE}#org`,
      name: "Loop Engineering Crash Course",
      url: SITE,
    },
    {
      "@type": "Person",
      "@id": `${SITE}#author`,
      name: "Ayesha Khalid",
      url: SITE,
      // Each profile here is an entity signal — add LinkedIn / X when available.
      sameAs: ["https://github.com/ayeshakhalid192007-dev"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}#website`,
      name: "Loop Engineering Crash Course",
      url: SITE,
      inLanguage: "en",
      publisher: { "@id": `${SITE}#org` },
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is loop engineering?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Loop engineering is the practice of designing the system that prompts an AI agent — its trigger, instructions, guardrails, verification, state, and logging — rather than prompting it by hand.",
          },
        },
        {
          "@type": "Question",
          name: "What is an agent loop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An agent loop is a system that repeatedly runs an AI agent toward a specified outcome without a human driving each run. Every production loop declares six parts: a heartbeat, a body, a spine, a stopping condition, a checker, and a human gate.",
          },
        },
        {
          "@type": "Question",
          name: "What is a heartbeat in an agent loop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A heartbeat is the trigger that starts one iteration of a loop. It can be in-session, conditional (run-until-done), scheduled, or event-driven.",
          },
        },
        {
          "@type": "Question",
          name: "What is the spine of a loop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The spine is a loop's durable state between runs, usually a state file. An interrupted loop with a spine resumes where it stopped; a loop without one restarts from the beginning.",
          },
        },
        {
          "@type": "Question",
          name: "Why should a loop never check its own work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Because maker and checker must be separate. A checker is the independent reviewer of a loop's output; if the loop grades itself, a confidently wrong result passes unchallenged.",
          },
        },
        {
          "@type": "Question",
          name: "When does an agent loop stop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A loop stops on one of three machine-checkable conditions: success when the stopping condition is met, limit when the run cap is hit, or no-progress when nothing has changed for N beats. Feeling done is not a stopping condition.",
          },
        },
        {
          "@type": "Question",
          name: "Is the Loop Engineering Crash Course free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The full curriculum, all 20 starter kits, the graded labs, and the Loop Ready certification are MIT licensed and free to use.",
          },
        },
      ],
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
