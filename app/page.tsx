import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { LoopAnatomy } from "@/components/LoopAnatomy";
import { BuildingBlocks } from "@/components/BuildingBlocks";
import { Architecture } from "@/components/Architecture";
import { Curriculum } from "@/components/Curriculum";
import { PatternGrid } from "@/components/PatternGrid";
import { GetStarted } from "@/components/GetStarted";
import { FinalCTA } from "@/components/FinalCTA";
import { Maintainers } from "@/components/Maintainers";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

/**
 * The landing page owns the site's full JSON-LD graph.
 *
 * It used to live in app/layout.tsx, which was fine while there was one page and
 * wrong the moment there were 160: it put the FAQPage node — seven questions and
 * answers — onto every curriculum page, none of which display them. Google's
 * FAQ guidance requires the content to be visible on the page carrying the markup,
 * so that was 150 pages of invalid structured data. Curriculum pages emit their
 * own graph through DocJsonLd instead.
 */
export default function Home() {
  return (
    <>
      <JsonLd />
      <NavBar />
      <main className="flex-1">
        <Hero />
        <LoopAnatomy />
        <BuildingBlocks />
        <Architecture />
        <Curriculum />
        <PatternGrid />
        <GetStarted />
        <FinalCTA />
        <Maintainers />
      </main>
      <Footer />
    </>
  );
}
