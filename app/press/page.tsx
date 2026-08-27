// import SiteNav from "@/components/shared/SiteNav";
import PressHero from "@/components/Press/PressHero";
import DownloadCards from "@/components/Press/DownloadCards";
// import MediaContactCard from "@/components/Press/MediaContactCard";
import ContactSection from "@/components/Contact/ContactSection";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Press & Media Kit",
};

export default function PressPage() {
  return (
    <main className="bg-paper">
      {/* <SiteNav /> */}
      <Navbar />
      <PressHero />
      <DownloadCards />
      {/* <MediaContactCard /> */}
      <ContactSection />
    </main>
  );
}
