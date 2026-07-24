"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The hero's signature: a loop scaffolding itself, live. The transcript is the real
 * `@loop-engineering/loop-kit` workflow from the course repo — `npx
 * @loop-engineering/loop-kit daily-triage` fetches the CLI (no clone, no global
 * install), writes the kit's files into `loops/daily-triage/` and `.claude/`, reports
 * the autonomy level it ships at (L1, report-only), and prints the first `/loop`
 * command. Played back line by line once the block scrolls into view, so the animation
 * doubles as a table of contents.
 *
 * "Live" state: while a step runs, the active line carries a braille spinner and a status
 * bar under the transcript names exactly what's happening ("writing loops/…/LOOP.md",
 * with a file counter); file lines flip from spinner to ✓ as the next one starts.
 *
 * Accessibility & motion:
 *   - The full transcript is real text in the DOM, so it reads top-to-bottom for
 *     assistive tech regardless of playback (aria-label names the figure).
 *   - Reduced-motion / no-JS: every line shows at once, files settled with ✓, a steady
 *     caret, and the status bar reads the final summary — no spinners, no reveal.
 *   - Playback starts on first intersection and runs once — no looping churn.
 */

type Kind = "cmd" | "info" | "dir" | "file" | "head" | "beat";
type Line = { kind: Kind; text: string; note?: string };

const KIT = "daily-triage";

const SCRIPT: Line[] = [
  { kind: "cmd", text: `npx @loop-engineering/loop-kit ${KIT}` },
  { kind: "info", text: "fetching @loop-engineering/loop-kit", note: "no clone · no global install" },
  { kind: "info", text: `scaffolding ${KIT} into ./`, note: "Node 18+, nothing else" },
  { kind: "dir", text: `loops/${KIT}/` },
  { kind: "file", text: "LOOP.md", note: "the definition — six parts, prompt, stops" },
  { kind: "file", text: `${KIT}-state.md`, note: "the spine — commit before beat 1" },
  { kind: "file", text: "loop-budget.md", note: "caps + the 80% tripwire" },
  { kind: "file", text: "loop-constraints.md", note: "the constitution" },
  { kind: "file", text: "loop-run-log.md", note: "append-only, one line per beat" },
  { kind: "dir", text: ".claude/" },
  { kind: "file", text: `skills/${KIT}/SKILL.md`, note: "the procedure" },
  { kind: "file", text: "agents/loop-verifier.md", note: "the read-only checker" },
  { kind: "head", text: "Loop Ready  ████████████  L1 · report-only" },
  { kind: "head", text: "First loop command:" },
  { kind: "beat", text: "/loop 1d Run loop-triage. Update STATE.md. No auto-fix in week one." },
];

const FILE_COUNT = SCRIPT.filter((l) => l.kind === "file").length;

// Per-kind dwell: a typed command lingers; streamed file writes flick past.
const DWELL: Record<Kind, number> = {
  cmd: 680,
  info: 460,
  dir: 240,
  file: 190,
  head: 340,
  beat: 560,
};

const SPINNER = "⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏";

function LineRow({
  line,
  active,
  done,
  spin,
}: {
  line: Line;
  active: boolean; // the newest line, still "running"
  done: boolean; // playback finished
  spin: string; // current spinner glyph
}) {
  // A file that's still the active line reads as mid-write; otherwise it's committed.
  const writing = line.kind === "file" && active && !done;

  let glyph: React.ReactNode = " ";
  let glyphClass = "text-transparent";
  if (line.kind === "cmd") {
    glyph = "$";
    glyphClass = "text-muted";
  } else if (line.kind === "dir") {
    glyph = "▸";
    glyphClass = "text-accent-2";
  } else if (line.kind === "file") {
    glyph = writing ? spin : "✓";
    glyphClass = writing ? "text-accent-2" : "text-olive";
  } else if (line.kind === "info") {
    glyph = active && !done ? spin : "›";
    glyphClass = "text-muted";
  } else if (line.kind === "head") {
    glyph = "◇";
    glyphClass = "text-accent-2";
  } else if (line.kind === "beat") {
    glyph = <span className="pulse-dot align-middle" />;
    glyphClass = "text-accent";
  }

  const textClass =
    line.kind === "cmd"
      ? "text-text"
      : line.kind === "head"
        ? "text-accent-2"
        : line.kind === "beat"
          ? "text-text"
          : writing
            ? "text-muted"
            : line.kind === "dir"
              ? "text-text"
              : "text-muted";

  return (
    <div className="term-line flex items-baseline gap-2.5 leading-relaxed">
      <span aria-hidden="true" className={`w-3 shrink-0 text-center font-mono ${glyphClass}`}>
        {glyph}
      </span>
      <span className="min-w-0">
        <span className={textClass}>{line.text}</span>
        {line.note && <span className="text-muted/55"> — {line.note}</span>}
        {line.kind === "cmd" && active && !done && (
          <span className="term-caret" aria-hidden="true" />
        )}
      </span>
    </div>
  );
}

export function LiveTerminal() {
  // Start fully revealed; playback (when allowed) rewinds to 1 and steps forward.
  const [shown, setShown] = useState(SCRIPT.length);
  const [running, setRunning] = useState(false);
  const [frame, setFrame] = useState(0);
  const root = useRef<HTMLElement>(null);

  // Playback: reveal one line at a time, once, when scrolled into view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = root.current;
    if (!el) return;

    let timer: ReturnType<typeof setTimeout>;
    let played = false;

    const step = (n: number) => {
      setShown(n);
      if (n < SCRIPT.length) {
        timer = setTimeout(() => step(n + 1), DWELL[SCRIPT[n - 1].kind]);
      } else {
        setRunning(false);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !played) {
          played = true;
          io.disconnect();
          setShown(0);
          setRunning(true);
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

  // Spinner ticks only while a step is running — no idle animation churn.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setFrame((f) => f + 1), 80);
    return () => clearInterval(id);
  }, [running]);

  const done = shown >= SCRIPT.length;
  const spin = SPINNER[frame % SPINNER.length];
  const newest = shown - 1;

  // Status bar: what's happening right now, or the final summary.
  const filesWritten = SCRIPT.slice(0, shown).filter((l) => l.kind === "file").length;
  let status: string;
  if (done) {
    status = `done · ${FILE_COUNT} files · Node 18+ · no clone required`;
  } else {
    const current = SCRIPT[newest];
    if (!current || current.kind === "cmd") status = "running npx @loop-engineering/loop-kit…";
    else if (current.kind === "info") status = current.text;
    else if (current.kind === "dir") status = `creating ${current.text}`;
    else if (current.kind === "file")
      status = `writing ${current.text}  ·  ${filesWritten} / ${FILE_COUNT} files`;
    else status = "finishing up…";
  }

  return (
    <figure
      ref={root}
      aria-label="A terminal running npx @loop-engineering/loop-kit daily-triage: it fetches the CLI with no clone, scaffolds LOOP.md, the state spine, loop-budget.md, loop-constraints.md and loop-run-log.md into loops/daily-triage/, writes the skill and read-only verifier into .claude/, reports it ships at L1 report-only, and prints the first /loop command."
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
          loop-kit — {KIT}
        </span>
      </div>

      {/* transcript */}
      <div className="px-4 py-4 text-left font-mono text-[13px] sm:text-sm">
        {SCRIPT.slice(0, Math.max(shown, 0)).map((line, i) => (
          <LineRow key={i} line={line} active={i === newest} done={done} spin={spin} />
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

      {/* status bar — narrates what the command is doing */}
      <div className="flex items-center gap-2 border-t border-border px-4 py-2 font-mono text-[11px] text-muted">
        <span aria-hidden="true" className={done ? "text-olive" : "text-accent-2"}>
          {done ? "✓" : running ? spin : "›"}
        </span>
        <span className="min-w-0 truncate">{status}</span>
      </div>
    </figure>
  );
}
