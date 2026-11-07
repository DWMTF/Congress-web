import { defineField, defineType } from "sanity";

export const stage = defineType({
  name: "stage",
  title: "Congress Stages",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Stage Label (e.g. Stage 1)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Stage Title (e.g. Pre-Congress, Congress, Post-Congress)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "year",
      title: "Year (e.g. 2027)",
      type: "string",
      initialValue: "2027",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Stage Image",
      type: "image",
      options: {
        hotspot: true,
      },
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
