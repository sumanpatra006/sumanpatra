export interface ExperienceEntry {
  version: string;
  dateRange: string;
  title: string;
  org: string;
  description: string;
  tech: string[];
  isNext?: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    version: "v1.0",
    dateRange: "08.2023 – present",
    title: "B.Tech Information Technology",
    org: "VSSUT Burla",
    description: "Started the system. CGPA 9.36 — building a strong foundation in CS fundamentals.",
    tech: ["C", "C++", "Python", "Java", "SQL"],
  },
  {
    version: "v2.0",
    dateRange: "06.2025 – 09.2025",
    title: "Backend Development Intern",
    org: "GramIQ (Remote)",
    description:
      "First real-world dependencies loaded. RESTful APIs, caching layers, and ORM patterns.",
    tech: ["Node.js", "Express.js", "Prisma ORM", "Redis"],
  },
  {
    version: "v3.0",
    dateRange: "2025",
    title: "Code For Good Hackathon Winner",
    org: "JPMorgan Chase & Co.",
    description:
      "Stress-tested under pressure. Led team of 7 to 1st place among 60,000+ applicants.",
    tech: ["Java", "Team Leadership", "System Design"],
  },
  {
    version: "v4.0",
    dateRange: "05.2026 – 07.2026",
    title: "Software Engineering Program Intern",
    org: "JPMorgan Chase & Co. — Bengaluru",
    description:
      "Production-grade upgrade. Retry-replay mechanism, Splunk dashboards, Java/Spring Boot microservices, Control-M, Jenkins CI/CD.",
    tech: ["Java", "Spring Boot", "Splunk", "Control-M", "Jenkins"],
  },
  {
    version: "NEXT",
    dateRange: "Now",
    title: "Seeking Full-Time SWE Roles",
    org: "Backend-Focused",
    description:
      "System is stable. Looking for the next major version — a team building real software at scale.",
    tech: [],
    isNext: true,
  },
];
