import { defineField, defineType } from "sanity";

export const neuroscienceFact = defineType({
  name: "neuroscienceFact",
  title: "Neuroscience Facts",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Fact Title (e.g. Alpha waves rise)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "text",
      title: "Fact Explanation",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "iconType",
      title: "Icon Type",
      type: "string",
      options: {
        list: [
          { title: "Waves (Alpha waves)", value: "waves" },
          { title: "HeartPulse (Cortisol)", value: "heartPulse" },
          { title: "Eye (Attention)", value: "eye" },
          { title: "Wind (Breathing)", value: "wind" },
        ],
      },
      initialValue: "waves",
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
});
