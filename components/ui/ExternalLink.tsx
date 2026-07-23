import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

/**
 * Every outbound `<a>` on the site goes through here so `target`/`rel` can't be
 * forgotten (plan §7). Use for plain text links; the CTA pills use PillButton.
 */
export function ExternalLink({
  href,
  children,
  className = "",
  ...rest
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
        className
      }
      {...rest}
    >
      {children}
    </a>
  );
}
