import Navbar from "@/components/Navbar";
import SponsorshipHero from "@/components/Sponsorship/SponsorshipHero";
import WhatIsCongress from "@/components/Sponsorship/WhatIsCongress";
import WhatYouGet from "@/components/Sponsorship/WhatYouGet";
import SponsorshipInquiry from "@/components/Sponsorship/SponsorshipInquiry";
import ContactSection from "@/components/Contact/ContactSection";

export const metadata = {
  title: "Sponsorship & Partnerships",
  description:
    "Partner with the Blue Mind Congress 2027. Discover why water neuroscience and sustainable mountain tourism matter, our mission, ROI deliverables, sponsorship packages, and direct contacts.",
};

export default function SponsorshipPage() {
  return (
    <main className="bg-paper min-h-screen">
      <Navbar />
      <SponsorshipHero />
      <WhatIsCongress />
      <WhatYouGet />
      <SponsorshipInquiry />
      <ContactSection />
    </main>
  );
}
