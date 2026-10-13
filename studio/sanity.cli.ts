import { defineCliConfig } from "sanity/cli";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { studioEnvironment } from "./environment";

// This entrypoint runs only in Node; browser configuration must never import it.
const localEnvironment = fileURLToPath(
  new URL("./.env.local", import.meta.url),
);
if (existsSync(localEnvironment)) process.loadEnvFile(localEnvironment);

export default defineCliConfig({ api: studioEnvironment() });
