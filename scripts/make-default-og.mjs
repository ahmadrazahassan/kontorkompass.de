// Default 1200x630 share image (Open Graph / LinkedIn) for pages without their own image:
// the brand lockup on white with a brand-blue rule. Run: node scripts/make-default-og.mjs
import sharp from "sharp";
import { join } from "node:path";

const lockup = join(process.cwd(), "..", "brand-input", "logo", "lockup.png");
const out = join(process.cwd(), "public", "media", "og", "default.jpg");

const trimmed = await sharp(lockup).flatten({ background: "#ffffff" }).trim({ background: "#ffffff", threshold: 40 }).toBuffer();
// The source PNG has an off-white background: push near-white pixels to pure white so no grey box shows.
const { data, info } = await sharp(trimmed).resize({ width: 820 }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
for (let i = 0; i < data.length; i += 3) {
  if (data[i] > 228 && data[i + 1] > 228 && data[i + 2] > 228) data[i] = data[i + 1] = data[i + 2] = 255;
}
const logo = await sharp(data, { raw: info }).png().toBuffer();
const { height = 0 } = await sharp(logo).metadata();

await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#ffffff" } })
  .composite([
    { input: logo, left: 190, top: Math.round((630 - 12 - height) / 2) },
    { input: { create: { width: 1200, height: 12, channels: 3, background: "#006BFF" } }, left: 0, top: 618 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(out);
console.log("wrote", out);
