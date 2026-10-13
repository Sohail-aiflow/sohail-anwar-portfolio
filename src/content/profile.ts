import type { ProjectScreenshot } from "@/types/project";

interface ContactLink {
  label: string;
  href: `https://${string}` | `mailto:${string}`;
}

interface ProfileContent {
  education: { institution: string; program: string; status: string };
  about: readonly string[];
  portrait?: ProjectScreenshot;
  contacts: readonly ContactLink[];
}

export const profile: ProfileContent = {
  education: {
    institution: "Aptech",
    program: "ACCP AI / Software Engineering",
    status: "Currently studying",
  },
  about: [
    "I’m a student software developer at Aptech, learning through practical projects. I’m interested in how the pieces of an application fit together: the interface people use, the logic behind it, and the data that makes it useful.",
    "My interests span software engineering, UI/UX design, backend development, and project management. I enjoy approaching a project from more than one angle, thinking about how it works as well as how it feels to use.",
    "Working on both independent and collaborative projects gives me different ways to approach development. I’m continuing to strengthen that foundation as I study, practise, and build.",
  ],
  contacts: [
    { label: "Email", href: "mailto:sohailanwar.ai@gmail.com" },
    { label: "GitHub", href: "https://github.com/Sohail-aiflow" },
  ],
};

export const skillGroups = [
  {
    title: "Frontend",
    icon: "frontend",
    items: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Bootstrap"],
  },
  {
    title: "Backend",
    icon: "backend",
    items: ["Node.js", "Express", "PHP", "Python", "ASP.NET Core MVC"],
  },
  {
    title: "Databases",
    icon: "database",
    items: ["MongoDB", "MySQL", "SQL Server"],
  },
  {
    title: "UI/UX",
    icon: "design",
    items: ["Figma", "Adobe XD", "Responsive interface design"],
  },
  {
    title: "Tools",
    icon: "tools",
    items: ["Git", "GitHub", "VS Code", "Visual Studio", "Postman"],
  },
  {
    title: "Project management",
    icon: "management",
    items: [
      "Collaborative development",
      "Project coordination",
      "Backend contribution in a three-member team",
    ],
  },
] as const;
