import type { PortfolioContent } from "@/types/portfolio";
import type { SanityReadConfig } from "@/lib/sanity/config";
import { adaptSanityContent } from "./adapter";

export async function loadPortfolioContent(
  local: PortfolioContent,
  config: SanityReadConfig | null,
  fetcher: (config: SanityReadConfig) => Promise<unknown>,
): Promise<PortfolioContent> {
  if (!config) return local;
  let payload: unknown;
  try {
    payload = await fetcher(config);
  } catch {
    throw new Error(
      "Configured Sanity read failed. The build stopped; no stale local fallback was used. Check dataset access and connectivity.",
    );
  }
  return adaptSanityContent(payload, local);
}
