// "My career & experience" timeline, newest first.

export interface CareerItem {
  title: string;
  place: string;
  year: string;
  description: string;
}

export const career: CareerItem[] = [
  {
    title: "Full Stack Developer",
    place: "Gtation",
    year: "NOW",
    description:
      "Building and shipping products like Surprisly and Tourigo end to end with React, Next.js, Node.js, Supabase and Firebase, plus AI agents and automated QA.",
  },
  {
    title: "Web Developer",
    place: "Ashma Tech Limited",
    year: "2026",
    description:
      "Leading full-stack development with React, Next.js and Node.js, building backends on Supabase and Firebase, and shipping WooCommerce stores with Woodmart and Elementor.",
  },
  {
    title: "Web Developer",
    place: "Radius ICT",
    year: "2025",
    description:
      "Built and maintained full-stack web apps with React, Next.js, Supabase and Firebase, and customised WordPress stores for a wide range of clients.",
  },
  {
    title: "Lead Web Developer",
    place: "Ethical Den",
    year: "2024",
    description: "Led front-end and WordPress projects as team lead using Elementor, Divi, WPBakery and WooCommerce.",
  },
  {
    title: "Web Developer",
    place: "bdCalling IT LTD",
    year: "2023",
    description: "Delivered WordPress projects with Elementor, Divi, WPBakery and WooCommerce.",
  },
  {
    title: "Frontend Engineer Intern",
    place: "App Coderz, USA",
    year: "2022",
    description: "Worked on MERN stack front ends and WordPress CMS projects for a remote US team.",
  },
];
