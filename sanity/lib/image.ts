import { createImageUrlBuilder } from "@sanity/image-url";
import type { Image } from "sanity";
import { dataset, projectId } from "../env";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "placeholder-project-id",
  dataset: dataset || "production",
});

export const urlForImage = (source: Image | null | undefined) => {
  if (!source?.asset) {
    return null;
  }
  return imageBuilder.image(source).auto("format").fit("max");
};
