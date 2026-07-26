import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { curriculum } from "@/lib/content";

/**
 * The spine of the course: six parts as a numbered syllabus running down a single
 * rail — not a card grid. Each part's title links to its GitHub folder; each
 * lesson, quiz, and flashcards deck links straight to the file. Most of the site's
 * outbound links live here.
 */
export function Curriculum() {
  return (
    <Section id="curriculum" eyebrow="Curriculum" title="Six parts, start to finish">
      <ol className="border-l border-border">
        {curriculum.map((part, i) => (
          <li key={part.part} className="relative grid gap-3 py-8 pl-8 sm:grid-cols-[auto_1fr] sm:gap-8 sm:pl-10">
            <span
              className="absolute -left-[13px] top-8 flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-bg font-mono text-[11px] font-bold text-accent-2"
              aria-hidden="true"
            >
              {i + 1}
            </span>

            <div className="sm:w-40">
              <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{part.part}</p>
              <h3 className="mt-1 font-display text-lg font-bold tracking-tight">
                <ExternalLink
                  href={part.folderHref}
                  className="inline-flex min-h-[24px] items-center transition-colors hover:text-accent"
                >
                  {part.title}
                </ExternalLink>
              </h3>
            </div>

            <div>
              {/* min-h-[24px] on the anchors, not padding on the <li>: the tap target is
                  the link box itself, and these lines are 16–22px of text with no
                  vertical padding — the whole reason 60 targets failed the 24px floor. */}
              <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {part.lessons.map((lesson) => (
                  <li key={lesson.href}>
                    <ExternalLink
                      href={lesson.href}
                      className="inline-flex min-h-[24px] items-center text-muted underline decoration-border underline-offset-4 transition-colors hover:text-text hover:decoration-accent"
                    >
                      {lesson.title}
                    </ExternalLink>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex gap-4 text-xs font-medium uppercase tracking-wide">
                <ExternalLink
                  href={part.quizHref}
                  className="inline-flex min-h-[24px] items-center text-muted transition-colors hover:text-accent"
                >
                  Quiz
                </ExternalLink>
                {part.flashcardsHref && (
                  <ExternalLink
                    href={part.flashcardsHref}
                    className="inline-flex min-h-[24px] items-center text-muted transition-colors hover:text-accent"
                  >
                    Flashcards
                  </ExternalLink>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
