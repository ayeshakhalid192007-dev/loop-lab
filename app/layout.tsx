import type { Metadata } from "next";
import { Inter_Tight, Inter, Geist_Mono, Fraunces } from "next/font/google";
import { ScrollAnimator } from "@/components/ScrollAnimator";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AnimatedBackground } from "@/components/AnimatedBackground";
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

const description =
  "A hands-on crash course in loop engineering: build agents that run themselves — on a heartbeat, checked, and human-gated. 6 parts, 20 starter kits, 11 projects. MIT licensed.";

// Resolved to the real origin at deploy time via NEXT_PUBLIC_SITE_URL (deploy-loop
// sets this); the fallback only affects the absolute OG-image URL, not the markup.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://loop-engineering.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Loop Engineering — Crash Course",
  description,
  openGraph: {
    type: "website",
    siteName: "Loop Engineering — Crash Course",
    title: "Loop Engineering — Crash Course",
    description,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loop Engineering — Crash Course",
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
