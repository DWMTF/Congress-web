import { defineField, defineType } from "sanity";

export const sponsorshipTier = defineType({
  name: "sponsorshipTier",
  title: "Sponsorship Tiers",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tier Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Badge Text",
      type: "string",
    }),
    defineField({
      name: "price",
      title: "Price Display (e.g. 25,000 LKR or Custom)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "highlight",
      title: "Highlight / Featured Tier (Glass styling)",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "iconType",
      title: "Icon Style",
      type: "string",
      options: {
        list: [
          { title: "Heart", value: "heart" },
          { title: "Zap / Innovation", value: "zap" },
          { title: "Star", value: "star" },
          { title: "Award", value: "award" },
        ],
      },
      initialValue: "heart",
    }),
    defineField({
      name: "features",
      title: "Features / Inclusions List",
      type: "array",
      of: [{ type: "string" }],
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
