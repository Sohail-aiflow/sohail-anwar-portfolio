import { defineConfig } from "@playwright/test";

// Pure Node content tests: no browser, credentials, or prebuilt out/ required.
export default defineConfig({
  testDir: "./tests",
  testMatch: "content.spec.ts",
  outputDir: "test-results/content",
  workers: 1,
  reporter: "list",
});
