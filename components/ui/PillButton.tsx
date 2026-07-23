import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "solid" | "outline";

interface PillButtonProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium " +
  "transition-[color,background-color,border-color,filter] duration-[180ms] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  solid: "bg-accent text-accent-fg hover:brightness-110",
  outline: "border border-border text-text hover:border-accent hover:text-accent",
};

/**
 * The one shared button primitive. `external` renders a raw <a> with safe rel;
 * internal links use next/link. Every outbound link on the site goes through here.
 */
export function PillButton({
  href,
  children,
  variant = "solid",
  external = false,
  className = "",
}: PillButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}
