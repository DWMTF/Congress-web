import type { Image } from "sanity";

export interface HeroData {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  countdownDate?: string;
  videoFileUrl?: string;
  videoUrl?: string;
  registerButtonText?: string;
  sponsorButtonText?: string;
}

export interface SpeakerData {
  _id: string;
  name: string;
  title: string;
  bio: string;
  image?: Image;
  order?: number;
}

export interface ProgrammeTrackData {
  _id: string;
  number: string;
  title: string;
  description: string;
  iconType?: string;
  order?: number;
}

export interface TimelineEventData {
  _id: string;
  yearOrMonth: string;
  title: string;
  description: string;
  image?: Image;
  order?: number;
}

export interface PressAssetData {
  _id: string;
  title: string;
  description: string;
  fileUrl?: string;
  externalUrl?: string;
  customSize?: string;
  iconType?: string;
  order?: number;
}

export interface SponsorshipTierData {
  _id: string;
  name: string;
  badge?: string;
  price: string;
  description?: string;
  highlight?: boolean;
  iconType?: string;
  features?: string[];
  order?: number;
}

export interface SponsorshipPillarData {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  iconType?: string;
  order?: number;
}

export interface StageData {
  _id: string;
  label: string;
  title: string;
  year: string;
  description: string;
  image?: Image;
  order?: number;
}

export interface NeuroscienceFactData {
  _id: string;
  title: string;
  text: string;
  iconType?: string;
  order?: number;
}

export interface SiteSettingsData {
  title?: string;
  organizationName?: string;
  footerCopyright?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
  mapLocationQuery?: string;
  newsletterEyebrow?: string;
  newsletterDescription?: string;
  newsletterSuccessMessage?: string;
  partnershipsOfficeTitle?: string;
  partnershipsOfficeSubtitle?: string;
  partnershipsEmail?: string;
  partnershipsPhone?: string;
  partnershipsHours?: string;
  prospectusFileUrl?: string;
  prospectusExternalUrl?: string;
  prospectusButtonLabel?: string;
  mediaContactName?: string;
  mediaContactEmail?: string;
  mediaContactPhone?: string;
  mediaContactResponseTime?: string;
}

export interface HomePageData {
  neuroscienceEyebrow?: string;
  neuroscienceTitle?: string;
  neuroscienceSubtitle?: string;
  stagesEyebrow?: string;
  stagesTitle?: string;
  timelineEyebrow?: string;
  timelineTitle?: string;
  programmeEyebrow?: string;
  programmeTitle?: string;
  contactEyebrow?: string;
  contactTitle?: string;
  contactSubtitle?: string;
}

export interface PressPageData {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export interface SponsorshipPageData {
  heroEyebrow?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  partnerButtonText?: string;
  tiersButtonText?: string;
  whatIsCongressEyebrow?: string;
  whatIsCongressTitle?: string;
  whatIsCongressSubtitle?: string;
  manifestoQuote?: string;
  manifestoAttribution?: string;
  tiersEyebrow?: string;
  tiersTitle?: string;
  tiersSubtitle?: string;
  inquiryEyebrow?: string;
  inquiryTitle?: string;
  inquirySubtitle?: string;
  inquiryFormTitle?: string;
  inquiryFormSubtitle?: string;
  inquirySuccessTitle?: string;
  inquirySuccessMessage?: string;
}

export const HERO_QUERY = `*[_type == "heroSection"][0]{
  eyebrow,
  title,
  subtitle,
  countdownDate,
  "videoFileUrl": videoFile.asset->url,
  videoUrl,
  registerButtonText,
  sponsorButtonText
}`;

export const SPEAKERS_QUERY = `*[_type == "speaker"] | order(order asc) {
  _id,
  name,
  title,
  bio,
  image,
  order
}`;

export const TRACKS_QUERY = `*[_type == "programmeTrack"] | order(order asc) {
  _id,
  number,
  title,
  description,
  iconType,
  order
}`;

export const TIMELINE_QUERY = `*[_type == "timelineEvent"] | order(order asc) {
  _id,
  yearOrMonth,
  title,
  description,
  image,
  order
}`;

export const PRESS_ASSETS_QUERY = `*[_type == "pressAsset"] | order(order asc) {
  _id,
  title,
  description,
  "fileUrl": file.asset->url,
  externalUrl,
  customSize,
  iconType,
  order
}`;

export const SPONSORSHIP_QUERY = `*[_type == "sponsorshipTier"] | order(order asc) {
  _id,
  name,
  badge,
  price,
  description,
  highlight,
  iconType,
  features,
  order
}`;

export const SPONSORSHIP_PILLARS_QUERY = `*[_type == "sponsorshipPillar"] | order(order asc) {
  _id,
  title,
  subtitle,
  description,
  iconType,
  order
}`;

export const STAGES_QUERY = `*[_type == "stage"] | order(order asc) {
  _id,
  label,
  title,
  year,
  description,
  image,
  order
}`;

export const FACTS_QUERY = `*[_type == "neuroscienceFact"] | order(order asc) {
  _id,
  title,
  text,
  iconType,
  order
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  title,
  organizationName,
  footerCopyright,
  instagramUrl,
  facebookUrl,
  twitterUrl,
  linkedinUrl,
  contactEmail,
  contactPhone,
  contactAddress,
  mapLocationQuery,
  newsletterEyebrow,
  newsletterDescription,
  newsletterSuccessMessage,
  partnershipsOfficeTitle,
  partnershipsOfficeSubtitle,
  partnershipsEmail,
  partnershipsPhone,
  partnershipsHours,
  "prospectusFileUrl": prospectusFile.asset->url,
  prospectusExternalUrl,
  prospectusButtonLabel,
  mediaContactName,
  mediaContactEmail,
  mediaContactPhone,
  mediaContactResponseTime
}`;

export const HOME_PAGE_QUERY = `*[_type == "homePage"][0]{
  neuroscienceEyebrow,
  neuroscienceTitle,
  neuroscienceSubtitle,
  stagesEyebrow,
  stagesTitle,
  timelineEyebrow,
  timelineTitle,
  programmeEyebrow,
  programmeTitle,
  contactEyebrow,
  contactTitle,
  contactSubtitle
}`;

export const PRESS_PAGE_QUERY = `*[_type == "pressPage"][0]{
  heroEyebrow,
  heroTitle,
  heroSubtitle
}`;

export const SPONSORSHIP_PAGE_QUERY = `*[_type == "sponsorshipPage"][0]{
  heroEyebrow,
  heroTitle,
  heroSubtitle,
  partnerButtonText,
  tiersButtonText,
  whatIsCongressEyebrow,
  whatIsCongressTitle,
  whatIsCongressSubtitle,
  manifestoQuote,
  manifestoAttribution,
  tiersEyebrow,
  tiersTitle,
  tiersSubtitle,
  inquiryEyebrow,
  inquiryTitle,
  inquirySubtitle,
  inquiryFormTitle,
  inquiryFormSubtitle,
  inquirySuccessTitle,
  inquirySuccessMessage
}`;
