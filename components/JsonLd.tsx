/**
 * Structured data for the landing page, emitted as a single JSON-LD @graph in <head>.
 *
 * Nodes cross-reference by @id so Course → provider/author resolve to the shared
 * Organization and Person in lib/schema.ts rather than duplicating them inline —
 * the same @ids every curriculum page's LearningResource points back at, which is
 * what makes 153 pages read as one course by one author.
 *
 * FAQ answers are lifted from the course glossary (content/docs/02-foundations/
 * glossary.md) so the markup and the prose stay in agreement; a mismatch there is
 * a structured-data warning. Each answer now also links to the page that teaches
 * it, which is newly possible — before the curriculum was published, those pages
 * did not exist on this domain.
 */
import {
  COURSE_ID,
  DATE_MODIFIED,
  DATE_PUBLISHED,
  ORG_ID,
  AUTHOR_ID,
  SITE,
  WEBSITE_ID,
  courseParts,
  organization,
  person,
} from "@/lib/schema";

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Course",
      "@id": COURSE_ID,
      name: "Loop Engineering Crash Course",
      description:
        "A free, open-source curriculum for loop engineering: designing control systems that keep AI coding agents working toward a goal over time. 6 parts, 20 starter kits, graded labs, and a Loop Ready certification.",
      url: SITE,
      isAccessibleForFree: true,
      inLanguage: "en",
      license: "https://opensource.org/licenses/MIT",
      datePublished: DATE_PUBLISHED,
      dateModified: DATE_MODIFIED,
      image: `${SITE}og.png`,
      educationalLevel: "Intermediate",
      teaches: [
        "Agent loop design",
        "Heartbeat scheduling",
        "Git worktrees for agents",
        "Skills and connectors (MCP)",
        "Sub-agent orchestration",
        "Human-in-the-loop control",
      ],
      provider: { "@id": ORG_ID },
      author: { "@id": AUTHOR_ID },
      // The six parts as real URLs. They existed only as <h3> prose before the
      // curriculum was published, so the course's structure was invisible to
      // anything that reads markup rather than renders it.
      hasPart: courseParts,
      numberOfCredits: 6,
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "online",
        courseWorkload: "PT6H",
      },
    },
    organization,
    person,
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Loop Engineering Crash Course",
      url: SITE,
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
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
            url: `${SITE}foundations/glossary/`,
          },
        },
        {
          "@type": "Question",
          name: "What is an agent loop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "An agent loop is a system that repeatedly runs an AI agent toward a specified outcome without a human driving each run. Every production loop declares six parts: a heartbeat, a body, a spine, a stopping condition, a checker, and a human gate.",
            url: `${SITE}parts/the-shift/anatomy-of-a-loop/`,
          },
        },
        {
          "@type": "Question",
          name: "What is a heartbeat in an agent loop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A heartbeat is the trigger that starts one iteration of a loop. It can be in-session, conditional (run-until-done), scheduled, or event-driven.",
            url: `${SITE}parts/heartbeat/`,
          },
        },
        {
          "@type": "Question",
          name: "What is the spine of a loop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The spine is a loop's durable state between runs, usually a state file. An interrupted loop with a spine resumes where it stopped; a loop without one restarts from the beginning.",
            url: `${SITE}parts/the-spine/`,
          },
        },
        {
          "@type": "Question",
          name: "Why should a loop never check its own work?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Because maker and checker must be separate. A checker is the independent reviewer of a loop's output; if the loop grades itself, a confidently wrong result passes unchallenged.",
            url: `${SITE}parts/the-body/maker-checker/`,
          },
        },
        {
          "@type": "Question",
          name: "When does an agent loop stop?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A loop stops on one of three machine-checkable conditions: success when the stopping condition is met, limit when the run cap is hit, or no-progress when nothing has changed for N beats. Feeling done is not a stopping condition.",
            url: `${SITE}foundations/glossary/`,
          },
        },
        {
          "@type": "Question",
          name: "Is the Loop Engineering Crash Course free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The full curriculum, all 20 starter kits, the graded labs, and the Loop Ready certification are MIT licensed and free to use.",
            url: SITE,
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
