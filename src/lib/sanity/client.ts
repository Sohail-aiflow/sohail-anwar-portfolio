import "server-only";
import { createClient } from "@sanity/client";
import { createNodeFetch } from "get-it/node";
import { portfolioQuery } from "./query";
import type { SanityReadConfig } from "./config";

// Native Node transport keeps build reads fresh without making routes dynamic.
const buildFetch = createNodeFetch();

export async function fetchPublishedContent(
  config: SanityReadConfig,
): Promise<unknown> {
  const client = createClient({
    ...config,
    perspective: "published",
    useCdn: false,
    stega: false,
    timeout: 15000,
    maxRetries: 1,
    resolveFetch: () => buildFetch,
  });
  // Public dataset, no token, no drafts, no browser client or runtime request.
  return client.fetch<unknown>(portfolioQuery);
}
