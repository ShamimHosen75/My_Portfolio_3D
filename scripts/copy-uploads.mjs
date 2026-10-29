/**
 * Copies user-uploaded project screenshots to /public/images/projects/
 * Run: node scripts/copy-uploads.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/images/projects");
const UP_DIR = "C:/Users/USER/.gemini/antigravity/brain/344e11c7-64c8-48af-b3c0-bf16e0ef2e30/.user_uploaded";

const map = [
  { src: "media_1793261097672_007031e3.webp", dest: "alraiyanbd.webp"  },
  { src: "media_1793261097672_4cc4ec02.webp", dest: "sawlins.webp"     },
  { src: "media_1793261097672_8becac5d.webp", dest: "sssf.webp"        },
  { src: "media_1793261097672_bc303099.webp", dest: "herbalhomes.webp" },
  { src: "media_1793261097672_693d0fd9.webp", dest: "surprisly.webp"   },
];

for (const { src, dest } of map) {
  const srcPath  = path.join(UP_DIR, src);
  const destPath = path.join(OUT_DIR, dest);
  fs.copyFileSync(srcPath, destPath);
  const kb = (fs.statSync(destPath).size / 1024).toFixed(1);
  console.log(`  copied  ${dest}  (${kb} KB)`);
}

console.log("\nDone — all 5 real screenshots are in /public/images/projects/");

