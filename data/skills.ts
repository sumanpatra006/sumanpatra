export type SkillCategory = "languages" | "backend" | "database" | "tools";

export interface Skill {
  id: string;
  label: string;
  category: SkillCategory;
  projectIds: string[];
}

export const SKILL_CATEGORIES: Record<
  SkillCategory,
  { label: string; color: string }
> = {
  languages: { label: "Languages", color: "var(--accent-primary)" },
  backend: { label: "Backend / Frameworks", color: "var(--accent-primary)" },
  database: { label: "Databases", color: "var(--accent-primary)" },
  tools: { label: "Infra / Tools", color: "var(--accent-primary)" },
};

export const skills: Skill[] = [
  // Languages
  { id: "java", label: "Java", category: "languages", projectIds: ["jpmc-internship", "jpmc-c4g"] },
  { id: "javascript", label: "JavaScript", category: "languages", projectIds: ["tnp-placement-portal", "url-shortener"] },
  { id: "typescript", label: "TypeScript", category: "languages", projectIds: ["tnp-placement-portal"] },
  { id: "c", label: "C", category: "languages", projectIds: [] },
  { id: "cpp", label: "C++", category: "languages", projectIds: [] },
  { id: "python", label: "Python", category: "languages", projectIds: [] },
  { id: "sql", label: "SQL", category: "languages", projectIds: ["tnp-placement-portal", "jpmc-internship"] },

  // Backend / Frameworks
  { id: "spring-boot", label: "Spring Boot", category: "backend", projectIds: ["jpmc-internship"] },
  { id: "nodejs", label: "Node.js", category: "backend", projectIds: ["tnp-placement-portal", "url-shortener"] },
  { id: "expressjs", label: "Express.js", category: "backend", projectIds: ["tnp-placement-portal", "url-shortener"] },
  { id: "reactjs", label: "React.js", category: "backend", projectIds: ["tnp-placement-portal", "url-shortener"] },
  { id: "nextjs", label: "Next.js", category: "backend", projectIds: [] },
  { id: "redux", label: "Redux", category: "backend", projectIds: [] },
  { id: "zustand", label: "Zustand", category: "backend", projectIds: ["tnp-placement-portal"] },

  // Databases
  { id: "postgresql", label: "PostgreSQL", category: "database", projectIds: ["tnp-placement-portal"] },
  { id: "mongodb", label: "MongoDB", category: "database", projectIds: ["url-shortener"] },
  { id: "prisma", label: "Prisma ORM", category: "database", projectIds: ["tnp-placement-portal"] },
  { id: "redis", label: "Redis", category: "database", projectIds: [] },

  // Infra / Tools
  { id: "aws", label: "AWS", category: "tools", projectIds: ["tnp-placement-portal"] },
  { id: "docker", label: "Docker", category: "tools", projectIds: [] },
  { id: "jenkins", label: "Jenkins", category: "tools", projectIds: ["jpmc-internship"] },
  { id: "controlm", label: "Control-M", category: "tools", projectIds: ["jpmc-internship"] },
  { id: "splunk", label: "Splunk", category: "tools", projectIds: ["jpmc-internship"] },
  { id: "git", label: "Git", category: "tools", projectIds: ["tnp-placement-portal", "url-shortener", "jpmc-internship", "jpmc-c4g"] },
];
