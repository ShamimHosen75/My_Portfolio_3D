// Skill groups shown in the Skills section.

export interface SkillGroup {
  title: string;
  description: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    title: "Front-end",
    description: "Interfaces that feel fast and look sharp on every screen.",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Three.js",
    ],
  },
  {
    title: "Back-end",
    description: "APIs and data layers that stay simple as products grow.",
    skills: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "Supabase",
      "Firebase",
      "MongoDB",
      "MySQL",
      "Go",
    ],
  },
  {
    title: "Tools",
    description: "The everyday kit for building, shipping and handing off.",
    skills: [
      "Git & GitHub",
      "VS Code",
      "Vite",
      "Vercel",
      "Netlify",
      "Figma",
      "WordPress",
      "WooCommerce",
    ],
  },
  {
    title: "AI workflow",
    description:
      "Using AI as a teammate to ship faster without cutting corners.",
    skills: [
      "AI-assisted coding",
      "Claude & ChatGPT",
      "Prompt design",
      "AI code review",
      "Rapid prototyping",
      "LLM-powered features",
    ],
  },
];
