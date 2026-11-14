// Creates 1200x630 JPEG share images (Open Graph) from the photo and vector manifests.
// Run: node scripts/make-og-images.mjs
import sharp from "sharp";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public");
const out = join(root, "media", "og");
mkdirSync(out, { recursive: true });
const photos = JSON.parse(readFileSync(join(root, "media", "photo-manifest.json"), "utf8"));
const vectors = JSON.parse(readFileSync(join(root, "media", "vector-manifest.json"), "utf8"));

const items = [
  ...photos.map((p) => ({ id: p.id, src: p.webp })),
  ...vectors.filter((v) => /^(R|M)\d/.test(v.id)).map((v) => ({ id: v.id, src: v.file })),
];
let n = 0;
for (const { id, src } of items) {
  const input = join(root, src);
  if (!existsSync(input)) { console.warn("missing", src); continue; }
  await sharp(input, { density: 144 }).resize(1200, 630, { fit: "cover", position: "attention" }).flatten({ background: "#ffffff" }).jpeg({ quality: 82, mozjpeg: true }).toFile(join(out, `${id}.jpg`));
  n++;
}
console.log(`wrote ${n} share images to public/media/og`);
