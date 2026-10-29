// Projects in the horizontal "My Work" section.
// Put screenshots in /assets-src/projects and run `npm run images` to make the .webp files.

export interface Project {
  name: string;
  category: string;
  description: string;
  tools: string;
  image: string;
  live?: string;
  code?: string;
}

export const projects: Project[] = [
  {
    name: "DeenHub",
    category: "Islamic App & Mosque Management",
    description:
      "A full-stack Islamic companion for individuals & mosque communities — Quran reader, real-time prayer times, Zakat calculator, digital Tasbeeh, and a complete mosque admin dashboard with donation tracking, payroll & role-based access. Fully bilingual (English & Bengali).",
    tools: "React 18, TypeScript, Supabase, Tailwind CSS, shadcn/ui, Framer Motion, Recharts, React Query, Leaflet",
    image: "/images/projects/deenhub.webp",
    live: "https://deenhub.online/",
  },
  {
    name: "Surprisly",
    category: "Interactive Birthday Experience",
    description:
      "A free tool that turns a birthday wish into an interactive 3D experience sent as a single link — unwrap a gift, pop balloons, blow out candles via the mic, spin a wish wheel, and open a 3D flower with a voice note. No sign-up, works inside WhatsApp & Messenger, links auto-delete after 48 hours.",
    tools: "React, Three.js, Web Audio API, WebRTC, Framer Motion",
    image: "/images/projects/surprisly.webp",
    live: "https://www.surprisly.online/",
  },
  {
    name: "SSSF Foundation",
    category: "Education Foundation Portal",
    description:
      "A bilingual (Bangla/English) full-stack website for an education-support foundation. Features a public site, member search with division/upazila stats, student nomination & alumni forms with a review-before-submit flow, a member area, and a comprehensive admin panel — all secured with Supabase RLS.",
    tools: "React 19, TanStack Start, Tailwind CSS v4, Supabase (PostgreSQL, Auth, Storage)",
    image: "/images/projects/sssf.webp",
    live: "https://sssf23.com/",
  },
  {
    name: "Herbal Homes",
    category: "Organic E-commerce Store",
    description:
      "A Bengali-language organic e-commerce platform selling handmade herbal soaps, natural oils, skincare, and healthy food products — with a full storefront (cart, checkout, wishlist, order tracking) and a rich admin panel covering products, orders, coupons, shipping zones, and Meta Pixel analytics.",
    tools: "React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Supabase, TanStack React Query, React Hook Form, Zod, Vercel",
    image: "/images/projects/herbalhomes.webp",
    live: "https://www.herbalhomess.com/",
  },
  {
    name: "Sawlin's Lifestyle",
    category: "Fashion E-commerce Platform",
    description:
      "A modern fashion e-commerce store with a hero slider, product variants (size & color), cart & checkout, order tracking, and a fully protected admin dashboard — covering products, orders, coupons, shipping, payment methods, and a Recharts sales overview. GDPR-compliant Facebook Pixel integration included.",
    tools: "React 18, TypeScript, Vite, Tailwind CSS v3, shadcn/ui, Supabase, TanStack React Query v5, React Hook Form, Zod, Recharts, Vercel",
    image: "/images/projects/sawlins.webp",
    live: "https://www.sawlins-lifestyle.shop/",
  },
  {
    name: "Al Raiyan BD",
    category: "Perfume E-commerce Platform",
    description:
      "A production-ready e-commerce platform for selling perfumes with a full shopping flow and a comprehensive admin dashboard. Features dynamic branding (colors, currency & locale from admin), multi-language support (English, Hindi & Bengali), Facebook Pixel, and Open Graph SEO — all without touching the code.",
    tools: "React 18, TypeScript, Vite, TailwindCSS, shadcn/ui, Supabase, TanStack Query, React Hook Form, Zod, Framer Motion, Vercel",
    image: "/images/projects/alraiyanbd.webp",
    live: "https://www.alraiyanbd.com/",
  },
];
