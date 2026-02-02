export const personalInfo = {
  name: "Md Gulam Gaush",
  location: "India",
  avatar: "/avatar.png",
  avatarUrl: "https://wallpapercave.com/wp/wp13521957.jpg",
  roles: ["Software Engineer", "Full Stack Developer"],
  github: "https://github.com/gulamgaush",
  linkedin: "https://www.linkedin.com/in/imgullu786/",
  mail: "gulamgaushnitrr@gmail.com",
  bio: `I'm a Passionate Software Engineer with a strong foundation in Computer Science fundamentals and hands-on
experience in building scalable, cloud-native, and full-stack applications.`,
};

export const education = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science & Engineering",
    school: "National Institute of Technology Raipur",
    period: "Nov 2022 - May 2026",
  },
];

export const experience = [
  {
    title: "Software Developer Intern",
    company: "BWH Studios",
    period: "Nov 2025 - Present",
    description: "Building scalable applications and microservices",
  },
  {
    title: "Technical Manager - Full Stack Developer",
    company: "Entrepreneurship Cell, NIT Raipur",
    period: "Mar 2024 - Apr 2025",
    description: "Developed full-stack features and improved performance",
  },
];

export const skills = [
  // Language
  { name: "C++", category: "Language" },
  { name: "JavaScript", category: "Language" },
  { name: "TypeScript", category: "Language" },

  // Web
  { name: "React.js", category: "Web" },
  { name: "Next.js", category: "Web" },
  { name: "Node.js", category: "Web" },
  { name: "Express.js", category: "Web" },
  { name: "Socket.io", category: "Web" },
  { name: "Tailwind CSS", category: "Web" },
  { name: "CSS", category: "Web" },
  { name: "HTML", category: "Web" },

  // Database
  { name: "MySQL", category: "Database" },
  { name: "MongoDB", category: "Database" },

  // Testing
  { name: "Playwright", category: "Testing" },
  { name: "Jest", category: "Testing" },
  { name: "UI Testing", category: "Testing" },
  { name: "Unit Testing", category: "Testing" },
  { name: "Integration Testing", category: "Testing" },

  // Devops & Cloud
  { name: "Docker", category: "Devops & Cloud" },
  { name: "Kubernetes", category: "Devops & Cloud" },
  { name: "AWS", category: "Devops & Cloud" },
  { name: "CI/CD Pipelines", category: "Devops & Cloud" },
  { name: "GitHub Actions", category: "Devops & Cloud" },
  { name: "Jenkins", category: "Devops & Cloud" },

  // Tools
  { name: "VSCode", category: "Tools" },
  { name: "Neovim", category: "Tools" },
  { name: "Git", category: "Tools" },
  { name: "GitHub", category: "Tools" },
  { name: "Linux", category: "Tools" },
  { name: "Nginx", category: "Tools" },
  { name: "Postman", category: "Tools" },
  { name: "Claude", category: "Tools" },

  // CS Fundamentals
  { name: "Data Structures", category: "CS Fundamentals" },
  { name: "Algorithms", category: "CS Fundamentals" },
  { name: "Operating Systems", category: "CS Fundamentals" },
  { name: "Database Management Systems", category: "CS Fundamentals" },
];

// Type exports
export type PersonalInfo = typeof personalInfo;
export type Education = (typeof education)[number];
export type Experience = (typeof experience)[number];
export type Skill = (typeof skills)[number];
