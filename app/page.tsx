import Hero from "@/components/Hero";
import AboutSection from "@/components/About/AboutSection";
import ProgrammeSection from "@/components/Programme/ProgrammeSection";
import TimelineSection from "@/components/PreCongress/TimelineSection";
import ContactSection from "@/components/Contact/ContactSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="bg-paper">
      <Navbar />
      <Hero />
      <AboutSection />
      <TimelineSection />
      <ProgrammeSection />
      <ContactSection />
    </main>
  );
}
