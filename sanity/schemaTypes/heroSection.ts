import { defineField, defineType } from "sanity";

export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow Text",
      type: "string",
      initialValue: "Water & Mountain Tourism Foundation",
    }),
    defineField({
      name: "title",
      title: "Headline",
      type: "string",
      initialValue: "Blue Mind Congress 2027",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Discover how water transforms the human mind.",
    }),
    defineField({
      name: "countdownDate",
      title: "Countdown Target Date & Time (ISO)",
      type: "datetime",
      initialValue: "2027-05-01T09:00:00.000Z",
    }),
    defineField({
      name: "videoFile",
      title: "Background Video Upload (MP4 / WebM)",
      type: "file",
      options: {
        accept: "video/mp4,video/webm",
      },
    }),
    defineField({
      name: "videoUrl",
      title: "Alternative Video URL (Direct MP4 URL)",
      type: "url",
    }),
    defineField({
      name: "registerButtonText",
      title: "Primary Button Text",
      type: "string",
      initialValue: "Register",
    }),
    defineField({
      name: "sponsorButtonText",
      title: "Secondary Button Text",
      type: "string",
      initialValue: "Become a Sponsor",
    }),
  ],
});
