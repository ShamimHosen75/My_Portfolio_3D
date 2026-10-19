// Converts PNG/JPG files in /assets-src to compressed WebP in /public/images,
// keeping the folder structure. Example: assets-src/projects/deenhub.png
// becomes public/images/projects/deenhub.webp. Run with `npm run images`.
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC = path.resolve("assets-src");
const OUT = path.resolve("public/images");
const MAX_WIDTH = 1600;

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/\.(png|jpe?g)$/i.test(entry.name)) yield full;
  }
}

for await (const file of walk(SRC)) {
  const rel = path.relative(SRC, file).replace(/\.(png|jpe?g)$/i, ".webp");
  const target = path.join(OUT, rel);
  await mkdir(path.dirname(target), { recursive: true });
  const info = await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75, effort: 6 })
    .toFile(target);
  console.log(`${rel}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
