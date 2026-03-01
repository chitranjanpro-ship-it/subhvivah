import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(process.cwd(), "public", "og-images");
const variants = ["og-1", "og-2", "og-3", "og-4", "og-5"];

async function ensureDir(p) {
  try { await mkdir(p, { recursive: true }); } catch {}
}

async function run() {
  await ensureDir(root);
  for (const base of variants) {
    const svgPath = resolve(root, `${base}.svg`);
    const jpgPath = resolve(root, `${base}.jpg`);
    try {
      const svg = await readFile(svgPath);
      const image = sharp(svg, { density: 300 }).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 85, mozjpeg: true });
      const buf = await image.toBuffer();
      await ensureDir(dirname(jpgPath));
      await writeFile(jpgPath, buf);
      // eslint-disable-next-line no-console
      console.log(`Generated ${base}.jpg`);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(`Skip ${base}: ${e.message}`);
    }
  }
}

run();
