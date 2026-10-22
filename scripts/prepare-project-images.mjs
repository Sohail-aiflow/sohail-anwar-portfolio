// Node-only preparation using the image tooling already installed with Next.js.
// Reads approved originals; never edits PNGs, captures a site, or contacts Sanity.
import sharp from "sharp";
import { stat } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { projectGalleries } from "../src/data/project-galleries.ts";

const root = resolve("public/images/projects");
for (const images of Object.values(projectGalleries)) {
  for (const image of images) {
    const output = resolve("public", image.src.slice(1));
    if (!output.startsWith(root + sep) || !output.endsWith(".webp"))
      throw new Error("Unexpected gallery output path.");
    const prefix = output.slice(0, -5);
    const original = `${prefix}.png`;
    const info = await sharp(original).metadata();
    if (info.width !== image.width || info.height !== image.height)
      throw new Error(`Image dimensions changed: ${original}`);
    await sharp(original).webp({ quality: 90 }).toFile(output);
    await sharp(original)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(`${prefix}-preview.webp`);
    await sharp(original)
      .resize(240, 160, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(`${prefix}-thumb.webp`);
    for (const width of [480, 960, 1440].filter((width) => width < image.width))
      await sharp(original)
        .resize({ width })
        .webp({ quality: 85 })
        .toFile(`${prefix}-${width}.webp`);
    console.log(
      `${image.id}: ${(await stat(output)).size} bytes; original preserved`,
    );
  }
}
