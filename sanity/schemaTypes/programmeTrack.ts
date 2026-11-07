import { defineField, defineType } from "sanity";

export const programmeTrack = defineType({
  name: "programmeTrack",
  title: "Programme Tracks",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Track Number (e.g. 01, 02)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Track Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Track Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "iconType",
      title: "Icon Style",
      type: "string",
      options: {
        list: [
          { title: "Science / Flask (FlaskConical)", value: "science" },
          { title: "Adventure / Compass", value: "adventure" },
          { title: "Community / Users", value: "community" },
        ],
      },
      initialValue: "science",
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
