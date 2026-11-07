import { defineField, defineType } from "sanity";

export const pressAsset = defineType({
  name: "pressAsset",
  title: "Press & Media Downloads",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Asset Title (e.g. Press Release, Fact Sheet, Logos)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "file",
      title: "Downloadable Document / File (PDF, ZIP, etc.)",
      type: "file",
      description: "Upload the actual file here. A direct download link will be generated automatically.",
    }),
    defineField({
      name: "externalUrl",
      title: "Or External Download Link (Optional)",
      type: "url",
      description: "Use this if the file is hosted on Google Drive, Dropbox, or an external CDN.",
    }),
    defineField({
      name: "customSize",
      title: "File Format & Size Label (e.g. 'PDF · 240 KB' or 'ZIP · 4.1 MB')",
      type: "string",
    }),
    defineField({
      name: "iconType",
      title: "Icon Type",
      type: "string",
      options: {
        list: [
          { title: "Document / PDF (FileText)", value: "fileText" },
          { title: "Fact Sheet (ClipboardList)", value: "clipboard" },
          { title: "Logos / Vectors (Shapes)", value: "shapes" },
          { title: "Photos (Camera)", value: "camera" },
          { title: "Videos (Video)", value: "video" },
        ],
      },
      initialValue: "fileText",
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
