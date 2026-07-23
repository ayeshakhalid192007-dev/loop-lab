import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { LoopAnatomy } from "@/components/LoopAnatomy";
import { BuildingBlocks } from "@/components/BuildingBlocks";
import { Curriculum } from "@/components/Curriculum";
import { PatternGrid } from "@/components/PatternGrid";
import { GetStarted } from "@/components/GetStarted";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-1">
        <Hero />
        <LoopAnatomy />
        <BuildingBlocks />
        <Curriculum />
        <PatternGrid />
        <GetStarted />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
