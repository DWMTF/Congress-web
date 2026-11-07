import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemaTypes";
import { dataset, projectId } from "./sanity/env";

export default defineConfig({
  basePath: "/studio",
  name: "dwmtf_studio",
  title: "Blue Mind Congress CMS",
  projectId: projectId || "placeholder-project-id",
  dataset: dataset || "production",
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});
