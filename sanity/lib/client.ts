import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const isSanityConfigured = Boolean(
  projectId && projectId.trim() !== "" && projectId !== "dummy-project-id"
);

export const client = createClient({
  projectId: projectId || "placeholder-project-id",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
});

/**
 * Safe fetch wrapper that catches unconfigured errors or network errors
 * and returns null so components can cleanly fall back to hardcoded defaults.
 */
export async function safeSanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  tags: string[] = []
): Promise<T | null> {
  if (!isSanityConfigured) {
    return null;
  }

  try {
    const data = await client.fetch<T>(query, params, {
      next: {
        revalidate: process.env.NODE_ENV === "development" ? 0 : 60,
        tags,
      },
    });
    return data;
  } catch (error) {
    console.warn("Sanity fetch failed or unconfigured, using fallback content:", error);
    return null;
  }
}
