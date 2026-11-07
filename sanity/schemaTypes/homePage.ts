import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page Headings",
  type: "document",
  fields: [
    // Neuroscience section
    defineField({
      name: "neuroscienceEyebrow",
      title: "Neuroscience Section Eyebrow",
      type: "string",
      initialValue: "The neuroscience",
    }),
    defineField({
      name: "neuroscienceTitle",
      title: "Neuroscience Section Title",
      type: "string",
      initialValue: "Why water changes the mind.",
    }),
    defineField({
      name: "neuroscienceSubtitle",
      title: "Neuroscience Section Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Not a metaphor, a measurable shift in brain and body chemistry.",
    }),

    // Stages section
    defineField({
      name: "stagesEyebrow",
      title: "Stages Section Eyebrow",
      type: "string",
      initialValue: "The Congress, in three stages",
    }),
    defineField({
      name: "stagesTitle",
      title: "Stages Section Title",
      type: "string",
      initialValue: "A journey, not just an agenda.",
    }),

    // Timeline section
    defineField({
      name: "timelineEyebrow",
      title: "Timeline Section Eyebrow",
      type: "string",
      initialValue: "The road to the river",
    }),
    defineField({
      name: "timelineTitle",
      title: "Timeline Section Title",
      type: "string",
      initialValue: "A journey, mapped",
    }),

    // Programme / Speakers section
    defineField({
      name: "programmeEyebrow",
      title: "Speakers Section Eyebrow",
      type: "string",
      initialValue: "Speaking at the Congress",
    }),
    defineField({
      name: "programmeTitle",
      title: "Speakers Section Title",
      type: "string",
      initialValue: "Voices of the valley",
    }),

    // Contact section
    defineField({
      name: "contactEyebrow",
      title: "Contact Section Eyebrow",
      type: "string",
      initialValue: "Contact",
    }),
    defineField({
      name: "contactTitle",
      title: "Contact Section Title",
      type: "string",
      initialValue: "Let's stay in touch",
    }),
    defineField({
      name: "contactSubtitle",
      title: "Contact Section Subtitle",
      type: "text",
      rows: 2,
      initialValue: "Questions about the Congress, the programme, or the valley itself. we're glad to help.",
    }),
  ],
});
