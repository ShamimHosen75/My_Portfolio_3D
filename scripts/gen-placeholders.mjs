/**
 * Generates rich SVG-based placeholder WebP images for each project.
 * Run:  node scripts/gen-placeholders.mjs
 * Requires: sharp  (already in devDependencies)
 */

import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "../public/images/projects");

const W = 1280;
const H = 800;

const projects = [
  {
    filename: "deenhub",
    bg: "#0f172a",
    accent: "#10b981",
    label: "ISLAMIC APP",
    name: "DeenHub",
    category: "Islamic App and Mosque Management",
    tagline: "Your Complete Islamic Digital Companion",
    dots: ["#10b981", "#34d399", "#6ee7b7"],
  },
  {
    filename: "surprisly",
    bg: "#1e0a3c",
    accent: "#f472b6",
    label: "BIRTHDAY GIFT",
    name: "Surprisly",
    category: "Interactive Birthday Experience",
    tagline: "3D Birthday Wishes · No Sign-Up · 48h Private Link",
    dots: ["#f472b6", "#fb7185", "#fbbf24"],
  },
  {
    filename: "sssf",
    bg: "#0a2a0a",
    accent: "#ef4444",
    label: "FOUNDATION",
    name: "SSSF Foundation",
    category: "Education Foundation Portal",
    tagline: "Bilingual Bangla and English Foundation Website",
    dots: ["#22c55e", "#ef4444", "#facc15"],
  },
  {
    filename: "herbalhomes",
    bg: "#0d1f0d",
    accent: "#84cc16",
    label: "E-COMMERCE",
    name: "Herbal Homes",
    category: "Organic E-commerce Store",
    tagline: "Handmade Herbal and Natural Products",
    dots: ["#84cc16", "#4ade80", "#a3e635"],
  },
  {
    filename: "sawlins",
    bg: "#1a0a2e",
    accent: "#a855f7",
    label: "FASHION STORE",
    name: "Sawlins Lifestyle",
    category: "Fashion E-commerce Platform",
    tagline: "Modern Fashion Store with Full Admin Dashboard",
    dots: ["#a855f7", "#ec4899", "#f59e0b"],
  },
  {
    filename: "alraiyanbd",
    bg: "#1a0f00",
    accent: "#f59e0b",
    label: "PERFUME SHOP",
    name: "Al Raiyan BD",
    category: "Perfume E-commerce Platform",
    tagline: "Dynamic Branding · Multi-language · Production Ready",
    dots: ["#f59e0b", "#fb923c", "#fbbf24"],
  },
];

function hex2rgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function buildSVG(p) {
  const { r, g, b } = hex2rgb(p.accent);

  // Background gradient stops
  const gradId = `g_${p.filename}`;
  const grad = `
    <defs>
      <radialGradient id="${gradId}" cx="70%" cy="30%" r="70%">
        <stop offset="0%" stop-color="rgb(${r},${g},${b})" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${p.bg}" stop-opacity="1"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="${p.bg}"/>
    <rect width="${W}" height="${H}" fill="url(#${gradId})"/>
  `;

  // Grid lines
  const gridLines = Array.from({ length: 9 }, (_, i) => {
    const x = Math.round((W / 8) * i);
    return `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="${p.accent}" stroke-opacity="0.07" stroke-width="1"/>`;
  }).join("") +
  Array.from({ length: 6 }, (_, i) => {
    const y = Math.round((H / 5) * i);
    return `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="${p.accent}" stroke-opacity="0.07" stroke-width="1"/>`;
  }).join("");

  // Top-left corner dots
  const dots = p.dots
    .map((c, i) => `<circle cx="${72 + i * 36}" cy="52" r="8" fill="${c}" fill-opacity="0.9"/>`)
    .join("");

  // Top-right badge
  const badge = `
    <rect x="${W - 166}" y="32" width="134" height="36" rx="18"
      fill="rgb(${r},${g},${b})" fill-opacity="0.15"
      stroke="${p.accent}" stroke-opacity="0.45" stroke-width="1"/>
    <text x="${W - 99}" y="55"
      text-anchor="middle"
      font-family="ui-monospace,Menlo,monospace"
      font-size="12" font-weight="700"
      fill="${p.accent}">LIVE SITE</text>
  `;

  // Large label chip in center-top
  const chip = `
    <rect x="${W / 2 - 90}" y="${H * 0.28 - 20}" width="180" height="32" rx="16"
      fill="rgb(${r},${g},${b})" fill-opacity="0.18"
      stroke="${p.accent}" stroke-opacity="0.3" stroke-width="1"/>
    <text x="${W / 2}" y="${H * 0.28 - 1}"
      text-anchor="middle"
      font-family="ui-monospace,Menlo,monospace"
      font-size="11" font-weight="700" letter-spacing="2"
      fill="${p.accent}">${p.label}</text>
  `;

  // Project name — very large
  const name = `
    <text x="${W / 2}" y="${H * 0.52}"
      text-anchor="middle"
      font-family="ui-sans-serif,system-ui,-apple-system,sans-serif"
      font-size="72" font-weight="800" letter-spacing="-2"
      fill="white" fill-opacity="0.95">${p.name}</text>
  `;

  // Category pill
  const catPill = `
    <rect x="${W / 2 - 220}" y="${H * 0.59}" width="440" height="36" rx="18"
      fill="rgb(${r},${g},${b})" fill-opacity="0.12"/>
    <text x="${W / 2}" y="${H * 0.59 + 23}"
      text-anchor="middle"
      font-family="ui-sans-serif,system-ui,sans-serif"
      font-size="14" font-weight="500"
      fill="${p.accent}">${p.category}</text>
  `;

  // Tagline
  const tagline = `
    <text x="${W / 2}" y="${H * 0.76}"
      text-anchor="middle"
      font-family="ui-sans-serif,system-ui,sans-serif"
      font-size="15"
      fill="white" fill-opacity="0.38">${p.tagline}</text>
  `;

  // Bottom accent bar
  const bar = `<rect x="0" y="${H - 5}" width="${W}" height="5" fill="${p.accent}" fill-opacity="0.7"/>`;

  // Diagonal watermark lines
  const watermark = Array.from({ length: 5 }, (_, i) => {
    const offset = (W / 4) * i;
    return `<line x1="${offset}" y1="0" x2="${offset + H}" y2="${H}"
      stroke="${p.accent}" stroke-opacity="0.03" stroke-width="1"/>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  ${grad}
  ${watermark}
  ${gridLines}
  ${dots}
  ${badge}
  ${chip}
  ${name}
  ${catPill}
  ${tagline}
  ${bar}
</svg>`;
}

async function generate() {
  let ok = 0;
  for (const p of projects) {
    const svg = buildSVG(p);
    const outPath = path.join(OUT_DIR, `${p.filename}.webp`);
    try {
      await sharp(Buffer.from(svg))
        .resize(W, H)
        .webp({ quality: 92 })
        .toFile(outPath);
      console.log(`  generated  ${p.filename}.webp`);
      ok++;
    } catch (err) {
      console.error(`  FAILED     ${p.filename}:`, err.message);
    }
  }
  console.log(`\n${ok}/${projects.length} images written to /public/images/projects/`);
}

generate();
