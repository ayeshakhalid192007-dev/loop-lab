import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { links } from "@/lib/links";
import { AUTHOR_ID, AUTHOR_NAME, DATE_MODIFIED, DATE_PUBLISHED, SITE, person } from "@/lib/schema";

/**
 * The author page.
 *
 * It exists because `Person.url` in the schema had nowhere honest to point: it
 * pointed at the course homepage, which tells a search engine that the author and
 * the thing they authored are the same entity — so neither resolves. For a course
 * whose entire credibility argument is "someone who does this wrote it", the
 * author being a schema node with no page behind it was the weakest link on the
 * site. This is that page.
 */

const title = "About the author — Loop Engineering Crash Course";
const description =
  "Ayesha Khalid writes the Loop Engineering Crash Course — a free, MIT-licensed curriculum on designing agent loops that run themselves.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/about/" },
  openGraph: { type: "profile", title, description, url: "/about/" },
};

const FOCUS = [
  {
    heading: "Agent loops",
    body: "Designing the system that prompts the agent — heartbeat, body, spine, stopping condition, checker, human gate — rather than prompting it by hand.",
    href: links.glossary,
    linkLabel: "Read the glossary",
  },
  {
    heading: "Verification",
    body: "Maker and checker stay separate. A loop that grades its own work passes a confidently wrong result unchallenged, every time.",
    href: "/parts/human-control/verification/",
    linkLabel: "How verification works",
  },
  {
    heading: "Human control",
    body: "Where a person decides, what a run may touch, and how a loop provably stops — the parts that make autonomy safe to actually run.",
    href: "/parts/human-control/",
    linkLabel: "Part 6 · Human Control",
  },
];

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "ProfilePage",
        "@id": `${SITE}about/#page`,
        url: `${SITE}about/`,
        name: title,
        description,
        inLanguage: "en",
        datePublished: DATE_PUBLISHED,
        dateModified: DATE_MODIFIED,
        mainEntity: { "@id": AUTHOR_ID },
      },
    ],
  };

  return (
    <>
      <NavBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main id="top" className="mx-auto w-full max-w-3xl px-6 py-16 md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-widest text-accent-2">Author</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight md:text-5xl">
          {AUTHOR_NAME}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          I write the{" "}
          <Link href="/" className="text-accent-2 underline decoration-border underline-offset-4">
            Loop Engineering Crash Course
          </Link>
          : a free, MIT-licensed curriculum on building AI agents that run themselves — on a
          heartbeat, checked by something other than themselves, and gated by a person who stays
          the engineer.
        </p>
        <p className="mt-5 leading-relaxed text-muted">
          The course is six parts, twenty starter kits, eleven graded projects and a Loop Ready
          certification. All of it is open source, and all of it is readable on this site — the{" "}
          <ExternalLink
            href={links.repo}
            className="text-accent-2 underline decoration-border underline-offset-4"
          >
            repository
          </ExternalLink>{" "}
          is there if you want to fork it rather than read it.
        </p>

        <h2 className="mt-14 font-display text-2xl font-extrabold tracking-tight">What I work on</h2>
        <div className="mt-6 flex flex-col gap-6">
          {FOCUS.map((item) => (
            <div key={item.heading} className="rounded-lg border border-border p-5">
              <h3 className="font-display text-lg font-bold tracking-tight">{item.heading}</h3>
              <p className="mt-2 text-muted">{item.body}</p>
              <Link
                href={item.href}
                className="mt-3 inline-flex min-h-[24px] items-center text-sm text-accent-2 transition-opacity hover:opacity-80"
              >
                {item.linkLabel} →
              </Link>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-display text-2xl font-extrabold tracking-tight">Elsewhere</h2>
        <ul className="mt-5 flex flex-col gap-2">
          <li>
            <ExternalLink
              href="https://github.com/ayeshakhalid192007-dev"
              className="inline-flex min-h-[24px] items-center text-muted underline decoration-border underline-offset-4 transition-colors hover:text-text hover:decoration-accent"
            >
              github.com/ayeshakhalid192007-dev
            </ExternalLink>
          </li>
        </ul>

        <p className="mt-14 border-t border-border pt-6 text-sm text-muted">
          Course first published{" "}
          <time dateTime={DATE_PUBLISHED}>
            {new Date(DATE_PUBLISHED).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          . Last updated{" "}
          <time dateTime={DATE_MODIFIED}>
            {new Date(DATE_MODIFIED).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
