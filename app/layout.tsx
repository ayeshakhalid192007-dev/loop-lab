import type { Metadata } from "next";
import { Inter_Tight, Inter, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Loop Engineering — Crash Course",
  description:
    "A hands-on crash course in loop engineering: build agents that run themselves. 101 lessons, 6 parts, 20 starter kits. MIT licensed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
