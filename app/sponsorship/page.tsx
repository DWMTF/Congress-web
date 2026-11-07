import Navbar from "@/components/Navbar";
import SponsorshipHero from "@/components/Sponsorship/SponsorshipHero";
import WhatIsCongress from "@/components/Sponsorship/WhatIsCongress";
import WhatYouGet from "@/components/Sponsorship/WhatYouGet";
import SponsorshipInquiry from "@/components/Sponsorship/SponsorshipInquiry";
import ContactSection from "@/components/Contact/ContactSection";
import { safeSanityFetch } from "@/sanity/lib/client";
import {
  SITE_SETTINGS_QUERY,
  SPONSORSHIP_PAGE_QUERY,
  SPONSORSHIP_PILLARS_QUERY,
  SPONSORSHIP_QUERY,
  type SiteSettingsData,
  type SponsorshipPageData,
  type SponsorshipPillarData,
  type SponsorshipTierData,
} from "@/sanity/lib/queries";

export const metadata = {
  title: "Sponsorship & Partnerships — Blue Mind Congress",
  description:
    "Partner with the Blue Mind Congress 2027. Discover why water neuroscience and sustainable mountain tourism matter, our mission, ROI deliverables, sponsorship packages, and direct contacts.",
};

export const revalidate = 60;

export default async function SponsorshipPage() {
  const [tiers, settings, pageData, pillars] = await Promise.all([
    safeSanityFetch<SponsorshipTierData[]>(SPONSORSHIP_QUERY, {}, ["sponsorshipTier"]),
    safeSanityFetch<SiteSettingsData>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]),
    safeSanityFetch<SponsorshipPageData>(SPONSORSHIP_PAGE_QUERY, {}, ["sponsorshipPage"]),
    safeSanityFetch<SponsorshipPillarData[]>(SPONSORSHIP_PILLARS_QUERY, {}, ["sponsorshipPillar"]),
  ]);

  return (
    <main className="bg-paper min-h-screen">
      <Navbar title={settings?.title} logoUrl={settings?.logoUrl} />
      <SponsorshipHero data={pageData} />
      <WhatIsCongress pageData={pageData} pillars={pillars} />
      <WhatYouGet
        tiers={tiers}
        heading={{
          eyebrow: pageData?.tiersEyebrow,
          title: pageData?.tiersTitle,
          subtitle: pageData?.tiersSubtitle,
        }}
      />
      <SponsorshipInquiry settings={settings} pageData={pageData} tiers={tiers} />
      <ContactSection settings={settings} />
    </main>
  );
}
