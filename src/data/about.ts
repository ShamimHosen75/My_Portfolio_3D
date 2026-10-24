// About section and "What I do" cards.

export const about = {
  heading: "About me",
  text: "I'm an aspiring software engineer and enthusiastic programmer with 6 years of experience building web applications people use every day. Right now I'm a full-stack developer at Gtation, shipping products like Surprisly and Tourigo with React, Next.js, Node.js, Supabase and Firebase, alongside WordPress and WooCommerce stores for clients worldwide. I also build AI agents and automated QA, and with AI as my co-pilot there's no problem I can't solve and nothing I can't create.",
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
