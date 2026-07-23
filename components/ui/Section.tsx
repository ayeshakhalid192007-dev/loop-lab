import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  /** Render as the single cream band — the one light inversion in the page. */
  paper?: boolean;
  className?: string;
}

/**
 * Consistent vertical rhythm + optional heading slot. Every section uses this so
 * spacing and heading treatment stay uniform across the page.
 */
export function Section({
  id,
  eyebrow,
  title,
  children,
  paper = false,
  className = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${paper ? "bg-paper text-paper-ink" : ""} py-20 md:py-28 ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        {eyebrow && (
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-accent">
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mb-10 font-display text-3xl font-extrabold tracking-tight md:text-4xl">
            {title}
          </h2>
        )}
        {children}
      </div>
    </section>
  );
}
