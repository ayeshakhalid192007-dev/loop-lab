"use client";

import { useEffect, useState } from "react";
import { PillButton } from "@/components/ui/PillButton";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
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
          className="font-display text-base font-extrabold tracking-tight text-text"
        >
          {nav.wordmark}
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {nav.anchors.map((a) => (
            <li key={a.href}>
              <a
                href={a.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {a.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <PillButton href={nav.cta.href} variant="solid" external>
            {nav.cta.label}
          </PillButton>
        </div>
      </nav>
    </header>
  );
}
