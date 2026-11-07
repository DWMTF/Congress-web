import { defineField, defineType } from "sanity";

export const sponsorshipPillar = defineType({
  name: "sponsorshipPillar",
  title: "Sponsorship Pillars",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Pillar Title (e.g. Neuroscience of Water)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle / Tag (e.g. The Science of Healing)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
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
          { title: "Brain (Neuroscience)", value: "brain" },
          { title: "Mountain (Sustainable Tourism)", value: "mountain" },
          { title: "Users / Leadership Convergence", value: "users" },
          { title: "Leaf / Eco", value: "leaf" },
        ],
      },
      initialValue: "brain",
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
