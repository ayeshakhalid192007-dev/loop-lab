import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { Curriculum } from "@/components/Curriculum";
import { PatternGrid } from "@/components/PatternGrid";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Hero />
        <Curriculum />
        <PatternGrid />
        {/* LoopAnatomy, BuildingBlocks, GetStarted, FinalCTA land here in steps 5–6. */}
      </main>
      <Footer />
    </>
  );
}
