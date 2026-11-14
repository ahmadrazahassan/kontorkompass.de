// Writes the logo symbol as SVG files and the favicon / app icons from the paths in src/components/ui/Logo.tsx.
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const P = ["M0 0H32V100H0Z", "M44 0H94L44 50Z", "M44 50L94 100H70L32 62Z"];
const symbol = (fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 94 100" role="img" aria-label="Kontorkompass">${P.map((d) => `<path d="${d}" fill="${fill}"/>`).join("")}</svg>\n`;
// Square canvas with padding, for icons
const square = (fill, bg, pad = 0.18) => {
  const s = 100 / (1 - 2 * pad); const off = (s - 100) / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${s.toFixed(2)} ${s.toFixed(2)}">${bg ? `<rect width="100%" height="100%" fill="${bg}"/>` : ""}<g transform="translate(${(off + 3).toFixed(2)} ${off.toFixed(2)})">${P.map((d) => `<path d="${d}" fill="${fill}"/>`).join("")}</g></svg>\n`;
};

const files = {
  "public/brand/kontorkompass-symbol-blue.svg": symbol("#006BFF"),
  "public/brand/kontorkompass-symbol-ink.svg": symbol("#0E1420"),
  "public/brand/kontorkompass-symbol-white.svg": symbol("#FFFFFF"),
  "src/app/(site)/icon.svg": square("#006BFF", null, 0.06),
};
for (const [f, c] of Object.entries(files)) writeFileSync(f, c);

await sharp(Buffer.from(square("#FFFFFF", "#006BFF", 0.2))).resize(180, 180).png().toFile("src/app/(site)/apple-icon.png");
for (const n of [32, 192, 512]) await sharp(Buffer.from(square("#FFFFFF", "#006BFF", 0.2))).resize(n, n).png().toFile(`public/brand/icon-${n}.png`);
await sharp(Buffer.from(square("#006BFF", "#FFFFFF", 0.22))).resize(1024, 1024).png().toFile("public/brand/kontorkompass-symbol-1024.png");
console.log("brand assets written");
