import { copyFile, readdir, readFile } from "node:fs/promises";
import { resolve, relative, sep, join } from "node:path";

// Windows exports may nest payloads that the browser requests as dotted files.
// https://github.com/vercel/next.js/issues/92339
const exportRoot = resolve("out");
let copied = 0;

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const source = join(directory, entry.name);
    if (entry.isDirectory()) {
      await visit(source);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith(".txt")) continue;
    const parts = relative(exportRoot, source).split(sep);
    const segmentIndex = parts.findIndex((part) => part.startsWith("__next."));
    if (segmentIndex < 0 || segmentIndex === parts.length - 1) continue;
    const target = resolve(
      exportRoot,
      ...parts.slice(0, segmentIndex),
      parts.slice(segmentIndex).join("."),
    );
    const targetRelative = relative(exportRoot, target);
    if (targetRelative.startsWith(`..${sep}`) || targetRelative === "..")
      throw new Error("Export target escaped out/");
    try {
      const existing = await readFile(target);
      if (!existing.equals(await readFile(source)))
        throw new Error(`Conflicting export payload: ${targetRelative}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      await copyFile(source, target);
      copied += 1;
    }
  }
}

await visit(exportRoot);
console.log(`Static export: normalized ${copied} nested segment payloads.`);
