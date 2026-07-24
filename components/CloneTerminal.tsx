"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The interactive counterpart to the hero's LiveTerminal. Where that one auto-plays a
 * scaffolding session, this one is *user-triggered*: pressing Copy puts `git clone …`
 * on the clipboard AND plays a faithful git-clone transcript — enumerate, count,
 * compress, receive (with a filling brass progress bar), resolve — settling on a ✓
 * summary of what just landed. The reward for copying is a preview of what the command
 * does.
 *
 * The command itself is always real text in the DOM (screen readers, no-JS, SEO).
 * Reduced motion / no-JS: a press jumps straight to the settled transcript with the
 * bar full — no streaming, no animation.
 */

type Kind = "out" | "recv" | "ok";
type Line = { kind: Kind; text: string; note?: string };

/** Sequential transcript. `recv` is the one line the progress bar tracks. */
function buildScript(dir: string, summary: string): Line[] {
  return [
    { kind: "out", text: `Cloning into '${dir}'...` },
    { kind: "out", text: "remote: Enumerating objects: 1287, done." },
    { kind: "out", text: "remote: Counting objects: 100% (1287/1287), done." },
    { kind: "out", text: "remote: Compressing objects: 100% (642/642), done." },
    { kind: "recv", text: "Receiving objects: 100% (1287/1287), 3.4 MiB | 6.1 MiB/s, done." },
    { kind: "out", text: "Resolving deltas: 100% (418/418), done." },
    { kind: "ok", text: `Cloned into ./${dir}`, note: summary },
  ];
}

const DWELL = 300; // per-line stream cadence
const OBJECTS = 1287;

export function CloneTerminal({
  command,
  dir,
  summary,
}: {
  command: string;
  dir: string;
  summary: string;
}) {
  const script = buildScript(dir, summary);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [shown, setShown] = useState(0); // transcript lines revealed
  const [pct, setPct] = useState(0); // receiving-objects progress
  const [copied, setCopied] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const run = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable — still play the visualization.
    }

    clearTimers();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(script.length);
      setPct(100);
      setPhase("done");
      return;
    }

    setShown(0);
    setPct(0);
    setPhase("running");

    // Stream the transcript one line at a time.
    script.forEach((_, i) => {
      timers.current.push(setTimeout(() => setShown(i + 1), 120 + i * DWELL));
    });
    // Ramp the receiving bar across the run, then settle.
    const total = 120 + script.length * DWELL;
    let step = 0;
    const steps = Math.round(total / 40);
    const id = setInterval(() => {
      step += 1;
      setPct(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) clearInterval(id);
    }, 40);
    timers.current.push(id as unknown as ReturnType<typeof setTimeout>);
    timers.current.push(setTimeout(() => setPhase("done"), total + 80));
  };

  const received = Math.round((pct / 100) * OBJECTS);

  // Status bar mirrors LiveTerminal: live during the receive, summary when done.
  let status: string;
  if (phase === "done") status = `done · ${dir} · ${summary}`;
  else if (phase === "running") status = `Receiving objects: ${pct}% (${received}/${OBJECTS})`;
  else status = "public repo · MIT · git 2.x";

  return (
    <figure
      aria-label={`Terminal: run ${command} to clone the course. It clones into ${dir} — ${summary}.`}
      className="not-prose overflow-hidden rounded-xl border border-border bg-bg text-left shadow-[0_28px_70px_-34px_rgba(0,0,0,0.7)]"
    >
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
        </span>
        <span className="ml-2 truncate font-mono text-[11px] uppercase tracking-widest text-muted">
          bash — {dir}
        </span>
      </div>

      {/* command + copy/run */}
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <code className="min-w-0 truncate font-mono text-sm text-text">
          <span className="text-muted">$ </span>
          {command}
          {phase === "idle" && <span className="term-caret" aria-hidden="true" />}
        </code>
        <button
          type="button"
          onClick={run}
          aria-label={copied ? "Command copied" : "Copy command and preview the clone"}
          className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>

      {/* transcript — appears once run */}
      {phase !== "idle" && (
        <div className="border-t border-border px-4 py-3 font-mono text-[13px] leading-relaxed sm:text-sm">
          {script.slice(0, shown).map((line, i) => {
            if (line.kind === "ok") {
              return (
                <div key={i} className="term-line flex items-baseline gap-2.5">
                  <span aria-hidden="true" className="w-3 shrink-0 text-center text-olive">
                    ✓
                  </span>
                  <span className="min-w-0">
                    <span className="text-text">{line.text}</span>
                    {line.note && <span className="text-accent-2"> — {line.note}</span>}
                  </span>
                </div>
              );
            }
            const text =
              line.kind === "recv" && phase === "running"
                ? `Receiving objects: ${pct}% (${received}/${OBJECTS}), 3.4 MiB | 6.1 MiB/s`
                : line.text;
            return (
              <div key={i} className="term-line flex items-baseline gap-2.5">
                <span aria-hidden="true" className="w-3 shrink-0 text-center text-muted/70">
                  ›
                </span>
                <span className="min-w-0 text-muted">{text}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* status bar + progress fill */}
      <div className="border-t border-border px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
          <span
            aria-hidden="true"
            className={phase === "done" ? "text-olive" : phase === "running" ? "text-accent-2" : "text-muted"}
          >
            {phase === "done" ? "✓" : phase === "running" ? "▸" : "›"}
          </span>
          <span className="min-w-0 truncate">{status}</span>
        </div>
        <div
          className="mt-2 h-1 overflow-hidden rounded-full bg-border/60"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Clone progress"
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-100 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </figure>
  );
}
