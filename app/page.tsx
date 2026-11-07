import Hero from "@/components/Hero";
import AboutSection from "@/components/About/AboutSection";
import ProgrammeSection from "@/components/Programme/ProgrammeSection";
import TimelineSection from "@/components/PreCongress/TimelineSection";
import ContactSection from "@/components/Contact/ContactSection";
import Navbar from "@/components/Navbar";
import { safeSanityFetch } from "@/sanity/lib/client";
import {
  FACTS_QUERY,
  HERO_QUERY,
  HOME_PAGE_QUERY,
  SITE_SETTINGS_QUERY,
  SPEAKERS_QUERY,
  STAGES_QUERY,
  TIMELINE_QUERY,
  TRACKS_QUERY,
  type HeroData,
  type HomePageData,
  type NeuroscienceFactData,
  type ProgrammeTrackData,
  type SiteSettingsData,
  type SpeakerData,
  type StageData,
  type TimelineEventData,
} from "@/sanity/lib/queries";

export const revalidate = 60;

export default async function Home() {
  const [
    heroData,
    factsData,
    stagesData,
    timelineData,
    speakersData,
    tracksData,
    settingsData,
    pageData,
  ] = await Promise.all([
    safeSanityFetch<HeroData>(HERO_QUERY, {}, ["heroSection"]),
    safeSanityFetch<NeuroscienceFactData[]>(FACTS_QUERY, {}, ["neuroscienceFact"]),
    safeSanityFetch<StageData[]>(STAGES_QUERY, {}, ["stage"]),
    safeSanityFetch<TimelineEventData[]>(TIMELINE_QUERY, {}, ["timelineEvent"]),
    safeSanityFetch<SpeakerData[]>(SPEAKERS_QUERY, {}, ["speaker"]),
    safeSanityFetch<ProgrammeTrackData[]>(TRACKS_QUERY, {}, ["programmeTrack"]),
    safeSanityFetch<SiteSettingsData>(SITE_SETTINGS_QUERY, {}, ["siteSettings"]),
    safeSanityFetch<HomePageData>(HOME_PAGE_QUERY, {}, ["homePage"]),
  ]);

  return (
    <main className="bg-paper">
      <Navbar title={settingsData?.title} logoUrl={settingsData?.logoUrl} />
      <Hero data={heroData} />
      <AboutSection facts={factsData} stages={stagesData} pageData={pageData} />
      <TimelineSection
        events={timelineData}
        heading={{
          eyebrow: pageData?.timelineEyebrow,
          title: pageData?.timelineTitle,
        }}
      />
      <ProgrammeSection
        speakers={speakersData}
        tracks={tracksData}
        heading={{
          eyebrow: pageData?.programmeEyebrow,
          title: pageData?.programmeTitle,
        }}
      />
      <ContactSection
        settings={settingsData}
        heading={{
          eyebrow: pageData?.contactEyebrow,
          title: pageData?.contactTitle,
          subtitle: pageData?.contactSubtitle,
        }}
      />
    </main>
  );
}
