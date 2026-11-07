import RegistrationSection from "@/components/Registration/RegistrationSection";
import ContactSection from "@/components/Contact/ContactSection";
import Navbar from "@/components/Navbar";
import { safeSanityFetch } from "@/sanity/lib/client";
import { SITE_SETTINGS_QUERY, type SiteSettingsData } from "@/sanity/lib/queries";

export const metadata = {
  title: "Register — Blue Mind Congress",
};

export const revalidate = 60;

export default async function RegisterPage() {
  const settings = await safeSanityFetch<SiteSettingsData>(
    SITE_SETTINGS_QUERY,
    {},
    ["siteSettings"]
  );

  return (
    <main className="bg-paper">
      <Navbar title={settings?.title} logoUrl={settings?.logoUrl} />
      <RegistrationSection />
      <ContactSection settings={settings} />
    </main>
  );
}
