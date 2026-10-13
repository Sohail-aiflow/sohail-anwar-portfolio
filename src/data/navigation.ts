export const navigationItems = [
  { id: "home", label: "Home" },
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "connect", label: "Connect" },
] as const;

export type SectionId = (typeof navigationItems)[number]["id"];
