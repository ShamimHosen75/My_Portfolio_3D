// Site-wide details. Edit these to change your name, links and SEO text.

export const site = {
  name: "Billal Hosen Shamim",
  /** The two big lines in the hero. */
  heroName: ["Billal Hosen", "Shamim"],
  /** Titles that cycle in the hero: "<prefix> / <highlight> <role>". */
  heroTitles: [
    { prefix: "An Aspiring", highlight: "Software", role: "Engineer" },
    { prefix: "A Creative", highlight: "Full Stack", role: "Developer" },
    { prefix: "A Passionate", highlight: "QA Automation", role: "Engineer" },
    { prefix: "A Detail-Oriented", highlight: "WordPress", role: "Developer" },
    { prefix: "An Innovative", highlight: "AI Agent", role: "Developer" },
    { prefix: "An Enthusiastic", highlight: "AI/ML", role: "Learner" },
    { prefix: "An AI-Assisted", highlight: "Problem", role: "Solver" },
  ],
  role: "MERN Stack & WordPress Developer",
  location: "Dhaka, Bangladesh",
  email: "billal.shamim75@gmail.com",
  resume: "/documents/resume.pdf",
  socials: [
    { label: "Github", url: "https://github.com/ShamimHosen75", icon: "github" },
    { label: "Linkedin", url: "https://www.linkedin.com/in/billal-hosen-shamim/", icon: "linkedin" },
    { label: "Facebook", url: "https://www.facebook.com/billal.hosen.shamim96", icon: "facebook" },
    { label: "Twitter", url: "https://twitter.com/ShamimHosen75", icon: "twitter" },
  ],
  seo: {
    title: "Billal Hosen Shamim | MERN Stack & WordPress Developer",
    description:
      "Portfolio of Billal Hosen Shamim, a MERN stack and WordPress developer from Dhaka, Bangladesh, building high-quality websites and interactive web solutions.",
  },
} as const;

export const navLinks = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
] as const;

/** Words in the loader marquee. */
export const loaderWords = ["A Creative Developer", "A Creative Designer"];
