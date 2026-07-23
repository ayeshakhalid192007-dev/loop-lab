"use client";

import { useState } from "react";

/**
 * Copy-to-clipboard with a transient "Copied" state. The only interactive client
 * component in the page besides the NavBar scroll listener (plan §7). Kept tiny so
 * the surrounding GetStarted section stays a Server Component.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (insecure context / denied) — leave label unchanged.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? "Command copied" : "Copy command"}
      className="shrink-0 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}
