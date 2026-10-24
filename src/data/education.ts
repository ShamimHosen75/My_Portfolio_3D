// "My academic journey": education on the left, certifications on the right.

export interface Education {
  degree: string;
  school: string;
  years: string;
  location: string;
  grade: string;
  description: string;
  tags: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  year: string;
  description: string;
}

export const education: Education[] = [
  {
    degree: "B.Sc in Computer Science and Engineering (CSE)",
    school: "World University of Bangladesh",
    years: "2026 – 2029",
    location: "Dhaka, Bangladesh",
    grade: "CGPA: In progress",
    description:
      "Focused on the core pillars of computer science: data structures, algorithms, object-oriented programming and database management systems, applied to real problems in my personal and professional projects.",
    tags: ["Data Structures", "Algorithms", "OOP", "DBMS"],
  },
  {
    degree: "Diploma in Engineering – Computer Science and Technology",
    school: "Habiganj Polytechnic Institute",
    years: "2019 – 2023",
    location: "Habiganj, Bangladesh",
    grade: "CGPA: 3.59 / 4.00",
    description:
      "Completed a diploma in computer science and engineering covering data structures, algorithms, OOP, database management systems, operating systems and computer networks.",
    tags: ["General Mechanics", "Technical Studies"],
  },
  {
    degree: "Secondary School Certificate – General Mechanics",
    school: "D.C.P High School",
    years: "2014 – 2019",
    location: "Chunarughat, Bangladesh",
    grade: "CGPA: 4.79 / 5.00",
    description: "Completed secondary education with a focus on technical subjects and general mechanics.",
    tags: [],
  },
];

export const certifications: Certification[] = [
  {
    title: "Asset Skills Competition 2023 – 1st Place",
    issuer: "Asset Institute",
    year: "2023",
    description: "Won first place in a national programming competition focused on web development and problem solving.",
  },
  {
    title: "Complete Web Development by Jhankar Mahbub",
    issuer: "Programming Hero",
    year: "2022",
    description:
      "Comprehensive MERN-stack certification: HTML5, CSS3, JavaScript, React, Node.js, MongoDB, Firebase, Netlify and Vercel.",
  },
  {
    title: "Advanced WordPress Development",
    issuer: "Online certification",
    year: "2021",
    description: "Advanced WordPress development, custom themes and plugin development.",
  },
];

export const learning = {
  title: "Continuous learning",
  text: "Always staying up to date with the latest technologies and industry trends through online courses, workshops and hands-on projects.",
  tags: ["Problem Solving", "Leadership", "Team Work", "Innovation"],
};
