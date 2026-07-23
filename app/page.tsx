import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/Hero";
import { LoopAnatomy } from "@/components/LoopAnatomy";
import { BuildingBlocks } from "@/components/BuildingBlocks";
import { Architecture } from "@/components/Architecture";
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
        <Architecture />
        <Curriculum />
        <PatternGrid />
        <GetStarted />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
