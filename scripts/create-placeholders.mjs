import fs from "fs";
import path from "path";

const dir = "e:/Developer Shamim Projects/My-Portfolio-3D/My_Portfolio_3D/public/images/projects";
const src = path.join(dir, "deenhub.webp");
const missing = ["surprisly", "sssf", "herbalhomes", "alraiyanbd"];

for (const name of missing) {
  const dest = path.join(dir, `${name}.webp`);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log("created placeholder:", dest);
  } else {
    console.log("already exists:", name);
  }
}
