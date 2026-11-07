import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings & Global Contacts",
  type: "document",
  fields: [
    // ── Brand & General ──────────────────────────────
    defineField({
      name: "title",
      title: "Congress Title / Brand Name",
      type: "string",
      initialValue: "Blue Mind Congress 2027",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Site Logo (Navbar)",
      type: "image",
      description: "Primary brand logo displayed in the website header/navbar navigation.",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "favicon",
      title: "Browser Favicon",
      type: "image",
      description: "Website favicon displayed in browser tabs (.ico or .png).",
    }),
    defineField({
      name: "organizationName",
      title: "Organization Name",
      type: "string",
      initialValue: "Water & Mountain Tourism Foundation",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "footerCopyright",
      title: "Footer Copyright Text",
      type: "string",
      initialValue: "© 2027 Water & Mountain Tourism Foundation. All rights reserved.",
    }),

    // ── Social Media Links ───────────────────────────
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "facebookUrl",
      title: "Facebook URL",
      type: "url",
    }),
    defineField({
      name: "twitterUrl",
      title: "Twitter / X URL",
      type: "url",
    }),
    defineField({
      name: "linkedinUrl",
      title: "LinkedIn URL",
      type: "url",
    }),

    // ── General Contacts ─────────────────────────────
    defineField({
      name: "contactEmail",
      title: "General Contact Email",
      type: "string",
      initialValue: "hello@bluemindcongress.org",
    }),
    defineField({
      name: "contactPhone",
      title: "General Contact Phone",
      type: "string",
      initialValue: "+94 11 234 5678",
    }),
    defineField({
      name: "contactAddress",
      title: "Headquarters Physical Address",
      type: "text",
      rows: 3,
      initialValue: "Water & Mountain Tourism Foundation\nKelani River Valley, Sri Lanka",
    }),
    defineField({
      name: "mapLocationQuery",
      title: "Google Maps Location Query",
      type: "string",
      initialValue: "Kelani River Valley, Sri Lanka",
    }),

    // ── Newsletter Section Copy ──────────────────────
    defineField({
      name: "newsletterEyebrow",
      title: "Newsletter Eyebrow",
      type: "string",
      initialValue: "Newsletter",
    }),
    defineField({
      name: "newsletterDescription",
      title: "Newsletter Description",
      type: "string",
      initialValue: "One email a month. Programme updates, speaker announcements, no noise.",
    }),
    defineField({
      name: "newsletterSuccessMessage",
      title: "Newsletter Success Message",
      type: "string",
      initialValue: "You're on the list! Thank you.",
    }),

    // ── Partnerships Office Contacts ─────────────────
    defineField({
      name: "partnershipsOfficeTitle",
      title: "Partnerships Office Card Title",
      type: "string",
      initialValue: "Get in Touch",
    }),
    defineField({
      name: "partnershipsOfficeSubtitle",
      title: "Partnerships Office Description",
      type: "text",
      rows: 2,
      initialValue: "Our team is available for tailored proposals, co-curation calls, and private briefing decks.",
    }),
    defineField({
      name: "partnershipsEmail",
      title: "Partnerships Direct Email",
      type: "string",
      initialValue: "partnerships@bluemindcongress.org",
    }),
    defineField({
      name: "partnershipsPhone",
      title: "Partnerships Direct Phone / WhatsApp",
      type: "string",
      initialValue: "+94 11 234 5678",
    }),
    defineField({
      name: "partnershipsHours",
      title: "Partnerships Office Working Hours",
      type: "string",
      initialValue: "Mon – Fri · 9:00 AM – 6:00 PM IST",
    }),
    defineField({
      name: "prospectusFile",
      title: "Partnership Prospectus / Fact Sheet (Upload PDF/ZIP)",
      type: "file",
      description: "Upload the latest Sponsorship Prospectus or Fact Sheet document.",
    }),
    defineField({
      name: "prospectusExternalUrl",
      title: "Or External Prospectus Link (Google Drive / CDN)",
      type: "url",
    }),
    defineField({
      name: "prospectusButtonLabel",
      title: "Prospectus Download Button Text",
      type: "string",
      initialValue: "Download Congress Fact Sheet (PDF)",
    }),

    // ── Media Relations Contacts ─────────────────────
    defineField({
      name: "mediaContactName",
      title: "Media Contact Person & Title",
      type: "string",
      initialValue: "Nadeeka Rathnayake, Communications Lead",
    }),
    defineField({
      name: "mediaContactEmail",
      title: "Media Contact Email",
      type: "string",
      initialValue: "press@bluemindcongress.org",
    }),
    defineField({
      name: "mediaContactPhone",
      title: "Media Contact Phone",
      type: "string",
      initialValue: "+94 77 123 4567",
    }),
    defineField({
      name: "mediaContactResponseTime",
      title: "Media Response Time Note",
      type: "string",
      initialValue: "Replies within 1 business day",
    }),
  ],
});
