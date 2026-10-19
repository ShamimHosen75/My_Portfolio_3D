// Projects in the horizontal "My Work" section.
// Put screenshots in /assets-src/projects and run `npm run images` to make the .webp files.

export interface Project {
  name: string;
  category: string;
  tools: string;
  image: string;
  live?: string;
  code?: string;
}

export const projects: Project[] = [
  {
    name: "DeenHub",
    category: "Islamic App & Mosque Manager",
    tools: "React, TypeScript, Supabase, Tailwind",
    image: "/images/projects/deenhub.webp",
    live: "https://deenhub.online/",
    code: "https://github.com/ShamimHosen75/masjid-manage-pro",
  },
  {
    name: "DocZen",
    category: "Medical & Health Template",
    tools: "React 19, Tailwind 4, Framer Motion, Vite",
    image: "/images/projects/doczen.webp",
    live: "https://doczen-medical.vercel.app/",
    code: "https://github.com/ShamimHosen75/DocZen---Medical-Health-React-Web-Template",
  },
  {
    name: "Sawlin's Lifestyle",
    category: "Fashion E-commerce",
    tools: "React, TypeScript, Supabase, Framer Motion",
    image: "/images/projects/sawlins.webp",
    live: "https://sawlins-lifestyle.vercel.app/",
    code: "https://github.com/ShamimHosen75/Sawlin-s-Lifestyle-Ecommerce",
  },
  {
    name: "Smart Ranna",
    category: "AI Cooking Assistant",
    tools: "React, Node.js, Express, MongoDB",
    image: "/images/projects/smart-ranna.webp",
    live: "https://smart-ranna.vercel.app/",
    code: "https://github.com/ShamimHosen75/Smart-Ranna-App",
  },
  {
    name: "Next Gear Auto",
    category: "Car Rental & Booking",
    tools: "WordPress, WooCommerce, ACF, PHP",
    image: "/images/projects/next-gear-auto.webp",
    live: "https://rentnextgearauto.com/",
  },
  {
    name: "SPS Law",
    category: "Law Firm Website",
    tools: "WordPress, Elementor, Branding",
    image: "/images/projects/sps-law.webp",
    live: "https://spslaw.ca/",
  },
];
