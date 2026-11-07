import { defineField, defineType } from "sanity";

export const sponsorshipPage = defineType({
  name: "sponsorshipPage",
  title: "Sponsorship Page Content",
  type: "document",
  fields: [
    // Hero Banner
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      initialValue: "Partnerships & Sponsorship 2027",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Headline",
      type: "string",
      initialValue: "Champion the Future of Water, Mind & Mountain Tourism.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Position your brand at the forefront of global neuroscience, sustainable travel, and environmental stewardship in the Kelani River Valley.",
    }),
    defineField({
      name: "partnerButtonText",
      title: "Primary Button Text",
      type: "string",
      initialValue: "Become a Partner",
    }),
    defineField({
      name: "tiersButtonText",
      title: "Secondary Button Text",
      type: "string",
      initialValue: "Explore Sponsorship Tiers",
    }),

    // What Is Congress Section
    defineField({
      name: "whatIsCongressEyebrow",
      title: "What Is Congress Eyebrow",
      type: "string",
      initialValue: "The Congress Explained",
    }),
    defineField({
      name: "whatIsCongressTitle",
      title: "What Is Congress Title",
      type: "string",
      initialValue: "What is Blue Mind Congress 2027?",
    }),
    defineField({
      name: "whatIsCongressSubtitle",
      title: "What Is Congress Subtitle",
      type: "text",
      rows: 2,
      initialValue: "A landmark international summit exploring how water, nature, and neuroscience can reshape global tourism, mental health, and ecological conservation.",
    }),

    // Manifesto Quote
    defineField({
      name: "manifestoQuote",
      title: "Manifesto Quote Text",
      type: "text",
      rows: 3,
      initialValue: "“We are beginning to understand what humans have intuitively felt for millennia: being near, in, on, or under water makes us healthier, happier, and more connected.”",
    }),
    defineField({
      name: "manifestoAttribution",
      title: "Manifesto Attribution",
      type: "string",
      initialValue: "— Blue Mind Congress 2027 Manifesto · Kelani River Valley, Sri Lanka",
    }),

    // Tiers Section
    defineField({
      name: "tiersEyebrow",
      title: "Tiers Section Eyebrow",
      type: "string",
      initialValue: "Deliverables & Tiers",
    }),
    defineField({
      name: "tiersTitle",
      title: "Tiers Section Title",
      type: "string",
      initialValue: "What You Can Get",
    }),
    defineField({
      name: "tiersSubtitle",
      title: "Tiers Section Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Meaningful ROI through global brand prestige, executive networking, and verified sustainability impact.",
    }),

    // Inquiry Section
    defineField({
      name: "inquiryEyebrow",
      title: "Inquiry Section Eyebrow",
      type: "string",
      initialValue: "Direct Contacts",
    }),
    defineField({
      name: "inquiryTitle",
      title: "Inquiry Section Title",
      type: "string",
      initialValue: "Let’s Create an Impactful Partnership",
    }),
    defineField({
      name: "inquirySubtitle",
      title: "Inquiry Section Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Speak directly with our partnership director or send a brief inquiry to receive the comprehensive 2027 Sponsorship Prospectus.",
    }),
    defineField({
      name: "inquiryFormTitle",
      title: "Inquiry Form Title",
      type: "string",
      initialValue: "Partnership Inquiry Form",
    }),
    defineField({
      name: "inquiryFormSubtitle",
      title: "Inquiry Form Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Tell us about your brand and the scope of partnership you are exploring.",
    }),
    defineField({
      name: "inquirySuccessTitle",
      title: "Inquiry Success Confirmation Title",
      type: "string",
      initialValue: "Inquiry Received",
    }),
    defineField({
      name: "inquirySuccessMessage",
      title: "Inquiry Success Confirmation Message",
      type: "text",
      rows: 3,
      initialValue: "Thank you for reaching out. Our Partnership Director will connect with you within 24 business hours with the full deck and scheduling details.",
    }),
  ],
});
