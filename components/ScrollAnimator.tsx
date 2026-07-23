"use client";

import { useEffect } from "react";

/**
 * Drives the scroll reveals with an IntersectionObserver so they animate reliably
 * in every browser (the old CSS scroll-timeline only ran in Chromium). Mounted once.
 * Content stays visible by default: this only engages when motion is allowed, and
 * the hidden start state is a CSS rule scoped to `html.reveal-on`.
 */
export function ScrollAnimator() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const root = document.documentElement;
    root.classList.add("reveal-on"); // belt-and-braces if the inline script didn't run

    const els = document.querySelectorAll<HTMLElement>(".reveal, .reveal-stagger");

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
