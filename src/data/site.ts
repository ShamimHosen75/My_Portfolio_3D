// Site-wide details. Edit these to change your name, links and SEO text.

export const site = {
  name: "Billal Hosen Shamim",
  shortName: "Shamim",
  role: "MERN stack & WordPress developer",
  tagline:
    "I build high-quality websites that grow your business, plus interactive web solutions.",
  intro: [
    "MERN stack and WordPress developer from Dhaka, building web apps for 5+ years.",
    "Building the future with code and AI, one useful product at a time.",
  ],
  openToWork: true,
  location: "Dhaka, Bangladesh",
  email: "billal.shamim75@gmail.com",
  resume: "/documents/resume.pdf",
  socials: {
    github: {
      label: "GitHub",
      handle: "@ShamimHosen75",
      url: "https://github.com/ShamimHosen75",
    },
    linkedin: {
      label: "LinkedIn",
      handle: "in/billal-hosen-shamim",
      url: "https://www.linkedin.com/in/billal-hosen-shamim/",
    },
  },
  seo: {
    title: "Billal Hosen Shamim | Full-stack Web Developer",
    description:
      "Portfolio of Billal Hosen Shamim, a full-stack web developer in Dhaka building fast, interactive React, Next.js and WordPress sites.",
  },
} as const;

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "process", label: "Process" },
  { id: "projects", label: "Projects" },
] as const;
