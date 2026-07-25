import type { Metadata } from "next";
import { Inter_Tight, Inter, Geist_Mono, Fraunces } from "next/font/google";
import { ScrollAnimator } from "@/components/ScrollAnimator";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { JsonLd } from "@/components/JsonLd";
import "./globals.css";

// Adds `reveal-on` before first paint so reveals start hidden without a flash —
// only when motion is allowed. No-JS / reduced-motion keep the full page visible.
const revealInit =
  "try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('reveal-on')}}catch(e){}";

// Display face for headlines
const display = Inter_Tight({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

// Body sans
const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

// Monospace for the terminal block
const mono = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
});

// Premium editorial serif — used only for the brand wordmark/logo lockup
const brand = Fraunces({
  variable: "--font-brand-face",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
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
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
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
      className={`${display.variable} ${body.variable} ${mono.variable} ${brand.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        <JsonLd />
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
