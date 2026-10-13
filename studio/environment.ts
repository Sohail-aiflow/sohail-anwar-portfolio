export function studioEnvironment() {
  // Sanity's Vite bundler statically replaces these public identifiers.
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = process.env.SANITY_STUDIO_DATASET;
  if (!projectId || !dataset)
    throw new Error(
      "Studio setup required: set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET in studio/.env.local.",
    );
  if (!/^[a-z0-9]+$/.test(projectId) || !/^[a-z0-9][a-z0-9_-]*$/.test(dataset))
    throw new Error("Invalid Studio project ID or dataset.");
  return { projectId, dataset };
}
