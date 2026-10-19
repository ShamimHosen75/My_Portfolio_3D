// Projects shown in the horizontal Projects section.
// Put screenshots in /public/images/projects as .webp (run `npm run images` to convert PNG/JPG
// files from /assets-src). Add `video` to show a looping muted preview instead of the image.

export interface Project {
  name: string;
  description: string;
  image: string;
  video?: string;
  tags: string[];
  live?: string;
  code?: string;
}

export const projects: Project[] = [
  {
    name: "DeenHub",
    description:
      "Quran, prayer tools and full mosque management in one bilingual app.",
    image: "/images/projects/deenhub.webp",
    tags: ["React", "TypeScript", "Supabase", "Tailwind"],
    live: "https://deenhub.online/",
    code: "https://github.com/ShamimHosen75/masjid-manage-pro",
  },
  {
    name: "DocZen",
    description:
      "A 15-page medical and health template built on React 19 and Tailwind 4.",
    image: "/images/projects/doczen.webp",
    tags: ["React 19", "Tailwind 4", "Framer Motion", "Vite"],
    live: "https://doczen-medical.vercel.app/",
    code: "https://github.com/ShamimHosen75/DocZen---Medical-Health-React-Web-Template",
  },
  {
    name: "Sawlin's Lifestyle",
    description:
      "A fashion e-commerce store with live inventory, checkout and admin dashboard.",
    image: "/images/projects/sawlins.webp",
    tags: ["React", "TypeScript", "Supabase", "Framer Motion"],
    live: "https://sawlins-lifestyle.vercel.app/",
    code: "https://github.com/ShamimHosen75/Sawlin-s-Lifestyle-Ecommerce",
  },
  {
    name: "Smart Ranna",
    description:
      "An AI cooking assistant that finds recipes from a dish, ingredients or your voice.",
    image: "/images/projects/smart-ranna.webp",
    tags: ["React", "Node.js", "MongoDB", "AI"],
    live: "https://smart-ranna.vercel.app/",
    code: "https://github.com/ShamimHosen75/Smart-Ranna-App",
  },
  {
    name: "Next Gear Auto",
    description:
      "A car rental site with vehicle listings, online booking and payments.",
    image: "/images/projects/next-gear-auto.webp",
    tags: ["WordPress", "WooCommerce", "ACF", "PHP"],
    live: "https://rentnextgearauto.com/",
  },
  {
    name: "SPS Law",
    description:
      "A brand refresh and new website for a multilingual Canadian law firm.",
    image: "/images/projects/sps-law.webp",
    tags: ["WordPress", "Elementor", "Branding"],
    live: "https://spslaw.ca/",
  },
];
