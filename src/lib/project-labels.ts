import type { ProjectStatus } from "@/types/project";

export const projectStatusLabels: Record<ProjectStatus, string> = {
  live: "Live",
  complete: "Complete",
  "in-progress": "In progress",
};
