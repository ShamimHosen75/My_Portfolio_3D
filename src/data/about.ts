// About section and "What I do" cards.

export const about = {
  heading: "About me",
  text: "I'm an enthusiastic programmer who has been building web applications for more than 5 years. I love writing code that makes people's daily lives easier, and I'm always eager to take on new challenges. My core skills are JavaScript, React and WordPress, and today I lead full-stack work with Next.js, Node.js, Supabase and Firebase while using AI to ship faster.",
};

export interface WhatIDoCard {
  title: string;
  description: string;
  skills: string[];
}

export const whatIDo: WhatIDoCard[] = [
  {
    title: "Develop",
    description:
      "Building fast, robust web applications and APIs with React, Next.js and Node.js. Responsive interfaces, clean data models and smooth animations, backed by Supabase, Firebase and MongoDB.",
    skills: ["React", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Supabase", "Firebase"],
  },
  {
    title: "WordPress & CMS",
    description:
      "Designing and launching WordPress and WooCommerce stores with Elementor, Divi and custom plugins. Conversion-focused layouts, booking and payment flows, and solid on-page SEO.",
    skills: ["WordPress", "WooCommerce", "Elementor", "Divi", "WPBakery", "ACF", "PHP", "Yoast SEO"],
  },
];
