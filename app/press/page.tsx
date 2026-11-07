import PressHero from "@/components/Press/PressHero";
import DownloadCards from "@/components/Press/DownloadCards";
import MediaContactCard from "@/components/Press/MediaContactCard";
import ContactSection from "@/components/Contact/ContactSection";
import Navbar from "@/components/Navbar";
import { safeSanityFetch } from "@/sanity/lib/client";
import {
  PRESS_ASSETS_QUERY,
  PRESS_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  type PressAssetData,
  type PressPageData,
  type SiteSettingsData,
} from "@/sanity/lib/queries";

export const metadata = {
  title: "Press & Media Kit — Blue Mind Congress",
};

export const revalidate = 60;

export default async function PressPage() {
  const [assets, settings, pressPageData] = await Promise.all([
    safeSanityFetch<PressAssetData[]>(PRESS_ASSETS_QUERY, {}, ["pressAsset"]),
    safeSanityFetch<SiteSettingsData>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]),
    safeSanityFetch<PressPageData>(PRESS_PAGE_QUERY, {}, ["pressPage"]),
  ]);

  return (
    <main className="bg-paper">
      <Navbar title={settings?.title} />
      <PressHero data={pressPageData} />
      <DownloadCards assets={assets} />
      <MediaContactCard settings={settings} />
      <ContactSection settings={settings} />
    </main>
  );
}
