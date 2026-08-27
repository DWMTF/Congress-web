// import SiteNav from "@/components/shared/SiteNav";
import RegistrationSection from "@/components/Registration/RegistrationSection";
import ContactSection from "@/components/Contact/ContactSection";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Register",
};

export default function RegisterPage() {
  return (
    <main className="bg-paper">
      {/* <SiteNav /> */}
      <Navbar />
      <RegistrationSection />
      <ContactSection />
    </main>
  );
}
