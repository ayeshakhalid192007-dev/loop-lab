import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { curriculum } from "@/lib/content";

/**
 * The spine of the site: six cards for the six course parts. Each card's title links
 * to the part's GitHub folder; each lesson, the quiz, and (where it exists) the
 * flashcards deck link straight to the file. Most of the site's outbound links live here.
 */
export function Curriculum() {
  return (
    <Section id="curriculum" eyebrow="Curriculum" title="Six parts, start to finish">
      <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {curriculum.map((part) => (
          <li
            key={part.part}
            className="flex flex-col rounded-xl border border-border bg-surface p-6"
          >
            <p className="text-xs font-medium uppercase tracking-widest text-accent">
              {part.part}
            </p>
            <h3 className="mt-1 font-display text-xl font-bold tracking-tight">
              <ExternalLink
                href={part.folderHref}
                className="transition-colors hover:text-accent"
              >
                {part.title}
              </ExternalLink>
            </h3>

            <ul className="mt-4 flex flex-1 flex-col gap-2 text-sm">
              {part.lessons.map((lesson) => (
                <li key={lesson.href}>
                  <ExternalLink
                    href={lesson.href}
                    className="text-muted transition-colors hover:text-text"
                  >
                    {lesson.title}
                  </ExternalLink>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex gap-4 border-t border-border pt-4 text-xs font-medium uppercase tracking-wide">
              <ExternalLink
                href={part.quizHref}
                className="text-muted transition-colors hover:text-accent"
              >
                Quiz
              </ExternalLink>
              {part.flashcardsHref && (
                <ExternalLink
                  href={part.flashcardsHref}
                  className="text-muted transition-colors hover:text-accent"
                >
                  Flashcards
                </ExternalLink>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
