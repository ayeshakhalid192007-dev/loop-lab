"use client";

import { useEffect, useState } from "react";
import { PillButton } from "@/components/ui/PillButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LoopMark } from "@/components/ui/LoopMark";
import { nav } from "@/lib/content";

/**
 * Sticky top bar: wordmark left, on-page anchors center, "View on GitHub" pill right.
 * Translucent by default, gains a solid surface + border once the page scrolls.
 * The scroll listener is the only reason this is a client component (plan §7).
 */
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={
        "sticky top-0 z-50 w-full transition-colors duration-[180ms] " +
        (scrolled
          ? "border-b border-border bg-bg/80 backdrop-blur"
          : "border-b border-transparent bg-transparent")
      }
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <a
          href="#top"
          aria-label={nav.wordmark}
          className="group inline-flex items-center gap-2.5 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          <LoopMark className="h-12 w-12 shrink-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[360deg]" />
          <span className="font-brand text-lg font-semibold tracking-wide text-olive">
            {nav.wordmark}
          </span>
        </a>

        <ul className="hidden items-center gap-2 md:flex">
          {nav.anchors.map((a) => (
            <li key={a.href}>
              <a
                href={a.href}
                className="inline-flex rounded-full border border-border px-3.5 py-1.5 text-sm text-muted transition-[color,background-color,border-color] duration-[180ms] hover:border-accent hover:bg-[color-mix(in_srgb,var(--accent)_20%,transparent)] hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <PillButton href={nav.cta.href} variant="solid">
            {nav.cta.label}
          </PillButton>
        </div>
      </nav>
    </header>
  );
}
