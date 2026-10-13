import "server-only";
import { getLocalContent } from "./local";
import { loadPortfolioContent } from "./load";
import { getSanityConfig } from "@/lib/sanity/config";
import { fetchPublishedContent } from "@/lib/sanity/client";
import type { PortfolioContent } from "@/types/portfolio";

let snapshot: Promise<PortfolioContent> | undefined;
export function getPortfolioContent(): Promise<PortfolioContent> {
  snapshot ??= loadPortfolioContent(
    getLocalContent(),
    getSanityConfig(),
    fetchPublishedContent,
  ).then((content) => {
    for (const warning of content.warnings)
      console.warn(`[content] ${warning}`);
    return content;
  });
  return snapshot;
}
