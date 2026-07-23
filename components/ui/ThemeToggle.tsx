"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const noopSubscribe = () => () => {};

/** True only after the client has mounted — avoids a hydration mismatch. */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/**
 * Renders a fixed-size placeholder until mounted — next-themes can't know the
 * resolved theme during SSR/static export, and guessing risks a flash of the
 * wrong icon.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <span className="h-9 w-9" aria-hidden="true" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
