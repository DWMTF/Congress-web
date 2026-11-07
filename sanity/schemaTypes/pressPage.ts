import { defineField, defineType } from "sanity";

export const pressPage = defineType({
  name: "pressPage",
  title: "Press & Media Page",
  type: "document",
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      initialValue: "Press & media",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero Headline",
      type: "string",
      initialValue: "Everything you need to cover the Congress.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Approved assets, facts and figures ready to use, no permissions needed.",
    }),
  ],
});
