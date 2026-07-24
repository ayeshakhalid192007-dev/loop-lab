import { ExternalLink } from "@/components/ui/ExternalLink";
import { CopyButton } from "@/components/ui/CopyButton";
import { footer, nav } from "@/lib/content";

/**
 * Footer: a brand column (wordmark, tagline, copyable scaffold command) beside three
 * grouped link columns, then a thin meta bar. Internal anchors (`#…`) render as plain
 * same-page links; every outbound link goes through ExternalLink so target/rel stay safe.
 */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const cls =
    "text-sm text-muted transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded-sm";
  return href.startsWith("#") ? (
    <a href={href} className={cls}>
      {children}
    </a>
  ) : (
    <ExternalLink href={href} className={cls}>
      {children}
    </ExternalLink>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
          {/* brand column */}
          <div className="max-w-sm">
            <p className="font-display text-lg font-extrabold tracking-tight text-text">
              {nav.wordmark}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{footer.tagline}</p>

            <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-border bg-bg/60 px-3 py-2">
              <code className="min-w-0 truncate font-mono text-[13px] text-text">
                <span className="text-muted">$ </span>
                {footer.install}
              </code>
              <CopyButton text={footer.install} />
            </div>
          </div>

          {/* link groups */}
          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3">
            {footer.groups.map((group) => (
              <div key={group.heading}>
                <h2 className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-2">
                  {group.heading}
                </h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* meta bar */}
        <div className="mt-14 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {footer.meta.copyright}
          </p>
          <p className="max-w-md text-xs text-muted/70 sm:text-right">{footer.meta.attribution}</p>
        </div>
      </div>
    </footer>
  );
}
