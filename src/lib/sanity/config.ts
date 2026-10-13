export interface SanityReadConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
}

export function getSanityConfig(
  env: Record<string, string | undefined> = process.env,
): SanityReadConfig | null {
  const source = env.PORTFOLIO_CONTENT_SOURCE?.trim() || "auto";
  if (!["auto", "local", "sanity"].includes(source))
    throw new Error(
      "Invalid PORTFOLIO_CONTENT_SOURCE; use auto, local, or sanity.",
    );
  if (source === "local") return null;
  const projectId = env.SANITY_PROJECT_ID?.trim();
  const dataset = env.SANITY_DATASET?.trim();
  if (!projectId && !dataset && source === "auto") return null;
  if (!projectId || !dataset)
    throw new Error(
      "Set both SANITY_PROJECT_ID and SANITY_DATASET, or select local content explicitly.",
    );
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9][a-z0-9_-]*$/.test(dataset))
    throw new Error("Invalid Sanity project or dataset configuration.");
  const apiVersion = env.SANITY_API_VERSION?.trim() || "2026-10-13";
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(apiVersion) ||
    Number.isNaN(Date.parse(apiVersion))
  )
    throw new Error("Invalid pinned SANITY_API_VERSION.");
  return { projectId, dataset, apiVersion };
}
