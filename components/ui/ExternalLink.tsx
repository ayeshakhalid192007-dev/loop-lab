import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

interface ExternalLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: ReactNode;
}

/**
 * The site's text link. Named for what it used to be: before the curriculum was
 * published as routes, every link on the page really was outbound.
 *
 * Now it decides. A site-absolute href renders as a `next/link`, which gets the
 * deploy-time basePath applied and prefetches — and, critically, does *not* get
 * `target="_blank"`, because throwing a new tab at someone for moving between two
 * pages of the same course is hostile. Anything with a scheme keeps the
 * target/rel pair so it cannot be forgotten on a genuinely outbound link.
 *
 * The CTA pills use PillButton, which makes the same distinction.
 */
export function ExternalLink({ href, children, className = "", ...rest }: ExternalLinkProps) {
  const cls =
    "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg " +
    className;

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
      {children}
    </a>
  );
}
