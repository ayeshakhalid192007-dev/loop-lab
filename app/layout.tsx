import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { ScrollAnimator } from "@/components/ScrollAnimator";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import "./globals.css";

// Adds `reveal-on` before first paint so reveals start hidden without a flash —
// only when motion is allowed. No-JS / reduced-motion keep the full page visible.
const revealInit =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('reveal-on')}}catch(e){}";

/**
 * Two families, down from four.
 *
 * The page was declaring 49 @font-face rules across Fraunces (18), Inter Tight
 * (14), Inter (7) and Geist Mono (6) — 194 KB of a 464 KB page, the largest
 * category after JS — while only 7 faces ever loaded. It also carried a
 * cold-cache CLS of 0.334, which is what four swapping families does to a layout.
 *
 * What went:
 *  - Inter Tight, folded into Inter. Inter Tight is Inter with tighter default
 *    tracking; every heading on the site already sets `tracking-tight`, so the
 *    two rendered nearly identically for the cost of a second family.
 *  - Fraunces, which existed for the two-word nav wordmark and nothing else.
 *    Eighteen faces for one lockup. It now renders in the display face.
 *
 * Both survivors are variable fonts subset to latin, so each is a single file
 * covering every weight rather than one file per weight. `adjustFontFallback` is
 * on by default in next/font and is what actually fixes the CLS: it derives a
 * size-adjusted local fallback so the swap does not reflow.
 */
const sans = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Code, terminal blocks, and the small-caps labels. Genuinely a third face rather
 * than an indulgence — the 150 curriculum pages are full of code blocks, and a
 * proportional font in a shell transcript is unreadable.
 *
 * `preload: false`: no monospace text is above the fold on any page, so preloading
 * it competes with the LCP element's own font for the same early bandwidth.
 */
const mono = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Kept under ~160 chars so it survives intact in a result snippet.
const description =
  "A free crash course in loop engineering: build AI agents that run themselves — on a heartbeat, checked, and human-gated. 20 loop kits, graded labs, MIT.";

// Leads with the term people search, then the two things no competitor offers.
// ~60 chars, so it fills the SERP line without truncating.
const title = "Loop Engineering Crash Course — 20 Loop Kits + Certification";

// Resolved to the real origin at deploy time via NEXT_PUBLIC_SITE_URL (the Pages
// workflow sets this to the project-site origin). The fallback matches the live
// GitHub Pages URL so absolute OG/Twitter tags are correct even without the env var.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayeshakhalid192007-dev.github.io/loop-lab";

// A real file with a real extension, generated into public/ by scripts/generate-og.mjs.
// This replaced app/opengraph-image.tsx, whose extensionless route (/opengraph-image)
// made GitHub Pages serve `application/octet-stream` while the markup declared
// image/png — Pages types responses purely from the extension, so the route could
// never be right. Declared explicitly here since removing the file convention also
// removes Next's automatic og:image injection.
const ogImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Loop Engineering — Crash Course",
  type: "image/png",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // Next.js joins this against metadataBase's pathname, so "/" resolves to the
  // full project-site URL. The trailing slash matters — next.config sets
  // trailingSlash: true, and sitemap.ts must agree with what is emitted here.
  alternates: { canonical: "/" },
  // Bing ownership. Also served as public/BingSiteAuth.xml — two independent
  // methods, so removing either one alone cannot un-verify the property.
  // Bing's index feeds Copilot and is an input to ChatGPT search.
  verification: { other: { "msvalidate.01": "4CA0CF2F5ED9090962EE9836B5919AE9" } },
  openGraph: {
    type: "website",
    siteName: "Loop Engineering — Crash Course",
    title,
    description,
    url: "/",
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      {/* Horizontal clipping lives on <html> in globals.css, not here: the two
          backdrop layers are position: fixed and escape body's overflow entirely. */}
      <body className="flex min-h-full flex-col">
        <script dangerouslySetInnerHTML={{ __html: revealInit }} />
        <ThemeProvider>
          <AnimatedBackground />
          <a
            href="#top"
            className="sr-only rounded bg-accent px-4 py-2 text-accent-fg focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100]"
          >
            Skip to content
          </a>
          {children}
          <ScrollAnimator />
        </ThemeProvider>
      </body>
    </html>
  );
}
