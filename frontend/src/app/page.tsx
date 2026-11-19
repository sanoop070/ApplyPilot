import AIMatching from "@/components/landing/AIMatching";
import Hero from "@/components/landing/Hero";
import ResumeIntelligence from "@/components/landing/ResumeIntelligence";
import Timeline from "@/components/landing/Timeline";

export default function Home() {
  return (
    <main>
      <Hero />
      <AIMatching />
      <Timeline />
      <ResumeIntelligence />
    </main>
  );
}
