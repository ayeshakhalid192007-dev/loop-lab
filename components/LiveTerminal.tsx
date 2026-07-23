"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's signature: a loop scaffolding itself, live. The transcript below is
 * the real cobusgreyling/loop-engineering workflow — `npx @cobusgreyling/loop-init`
 * writes LOOP.md / STATE.md / loop-budget.md / loop-run-log.md into the current
 * repo (no clone required), reports a Loop Ready score, prints the first `/loop`
 * command, and `loop-audit` writes the badge. Played back line by line once the
 * block scrolls into view, so the animation doubles as a table of contents.
 *
 * Accessibility & motion:
 *   - The full transcript is real text in the DOM, so it reads top-to-bottom for
 *     assistive tech regardless of playback (aria-label names the figure).
 *   - Reduced-motion / no-JS: every line shows at once with a steady caret (the
 *     reveal below only trims what's already there).
 *   - Playback starts on first intersection and runs once — no looping churn.
 */

type Kind = "cmd" | "out" | "ok" | "head" | "beat";
type Line = { kind: Kind; text: string; note?: string };

const SCRIPT: Line[] = [
  { kind: "cmd", text: "npx @cobusgreyling/loop-init . --pattern daily-triage --tool grok" },
  { kind: "out", text: "Scaffolding into ./ — no clone required" },
  { kind: "ok", text: "LOOP.md", note: "the loop's contract" },
  { kind: "ok", text: "STATE.md", note: "durable memory between beats" },
  { kind: "ok", text: "loop-budget.md", note: "token + run caps" },
  { kind: "ok", text: "loop-run-log.md", note: "one line appended per beat" },
  { kind: "ok", text: "starters/daily-triage", note: "copied" },
  { kind: "head", text: "Loop Ready  ████████████  100 / 100" },
  { kind: "head", text: "First loop command:" },
  { kind: "beat", text: "/loop 1d Run loop-triage. Update STATE.md. No auto-fix in week one." },
  { kind: "cmd", text: "npx @cobusgreyling/loop-audit . --badge" },
  { kind: "ok", text: "audit passed", note: "Loop Ready badge written to README" },
];

// A cmd line reads as "typed", so give it more dwell than a streamed output line.
const dwell = (line: Line) => (line.kind === "cmd" ? 620 : 300);

const GLYPH: Record<Kind, string> = { cmd: "$", out: " ", ok: "✓", head: "◇", beat: "♥" };

function LineRow({ line, typing }: { line: Line; typing: boolean }) {
  const glyphClass =
    line.kind === "cmd"
      ? "text-muted"
      : line.kind === "ok"
        ? "text-olive"
        : line.kind === "head"
          ? "text-accent-2"
          : line.kind === "beat"
            ? "text-accent"
            : "text-transparent";

  return (
    <div className="flex items-baseline gap-2.5 leading-relaxed">
      <span aria-hidden="true" className={`w-3 shrink-0 text-center ${glyphClass}`}>
        {line.kind === "beat" ? <span className="pulse-dot align-middle" /> : GLYPH[line.kind]}
      </span>
      <span className="min-w-0">
        <span
          className={
            line.kind === "cmd"
              ? "text-text"
              : line.kind === "head"
                ? "text-accent-2"
                : line.kind === "beat"
                  ? "text-text"
                  : "text-muted"
          }
        >
          {line.text}
        </span>
        {line.note && <span className="text-muted/60"> — {line.note}</span>}
        {typing && <span className="term-caret" aria-hidden="true" />}
      </span>
    </div>
  );
}

export function LiveTerminal() {
  // Start fully revealed; playback (when allowed) rewinds to 1 and steps forward.
  const [shown, setShown] = useState(SCRIPT.length);
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;
    let played = false;

    const step = (n: number) => {
      setShown(n);
      if (n < SCRIPT.length) {
        timer = setTimeout(() => step(n + 1), dwell(SCRIPT[n - 1]));
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !played) {
          played = true;
          io.disconnect();
          setShown(0);
          timer = setTimeout(() => step(1), 260);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);

    return () => {
      clearTimeout(timer);
      io.disconnect();
    };
  }, []);

  const done = shown >= SCRIPT.length;

  return (
    <figure
      ref={root}
      aria-label="A terminal running npx @cobusgreyling/loop-init: it scaffolds LOOP.md, STATE.md, loop-budget.md and loop-run-log.md into the current repo, reports a Loop Ready score of 100, prints the first /loop command, then writes a Loop Ready badge with loop-audit."
      className="not-prose overflow-hidden rounded-xl border border-border bg-bg/80 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-sm"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-2 font-mono text-[11px] uppercase tracking-widest text-muted">
          loop-init — daily-triage
        </span>
      </div>

      {/* transcript */}
      <div className="px-4 py-4 text-left font-mono text-[13px] sm:text-sm">
        {SCRIPT.slice(0, Math.max(shown, 0)).map((line, i) => (
          <LineRow key={i} line={line} typing={!done && i === shown - 1} />
        ))}
        {done && (
          <div className="mt-1 flex items-baseline gap-2.5">
            <span aria-hidden="true" className="w-3 shrink-0 text-center text-muted">
              $
            </span>
            <span className="term-caret" aria-hidden="true" />
          </div>
        )}
      </div>
    </figure>
  );
}
