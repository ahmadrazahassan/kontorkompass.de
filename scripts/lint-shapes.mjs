// Fails if pill shapes are used outside allowed files (Avatar).
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const allowed = ["Avatar.tsx"];
const bad = [];
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts|css)$/.test(f) && !allowed.includes(f)) {
      const t = readFileSync(p, "utf8");
      if (/rounded-full|border-radius:\s*9999/.test(t)) bad.push(p);
    }
  }
}
walk("src");
if (bad.length) { console.error("Pill shapes found:\n" + bad.join("\n")); process.exit(1); }
console.log("lint:shapes OK");
