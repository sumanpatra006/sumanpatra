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
    dateRange: "08.2023 – Ongoing",
    title: "B.Tech in Information Technology",
    org: "VSSUT Burla (CGPA: 9.36)",
    description: "Core computer science foundation: Data Structures & Algorithms, Computer Networks, Operating Systems, DBMS, OOP, and Software Engineering.",
    tech: ["Java", "C", "C++", "Python", "SQL", "DSA", "DBMS", "OS"],
  },
  {
    version: "v2.0",
    dateRange: "2025",
    title: "JPMC Code For Good Hackathon Winner",
    org: "JPMorgan Chase & Co.",
    description:
      "Led a team of 7 engineers to 1st position among 60,000+ applicants at J.P.Morgan Chase’s hackathon.",
    tech: ["Team Leadership", "Java", "System Design", "Agile"],
  },
  {
    version: "v3.0",
    dateRange: "23.06.2025 – 30.09.2025",
    title: "Backend Development Intern",
    org: "GramIQ (Remote)",
    description:
      "Engineered 21+ RESTful APIs for a multi-admin dashboard with role-based auth & hierarchical access control using Node.js, Express.js & Prisma ORM. Integrated Redis session caching to optimize API response times under concurrent load.",
    tech: ["Node.js", "Express.js", "Prisma ORM", "Redis", "REST APIs", "SQL"],
  },
  {
    version: "v4.0",
    dateRange: "18.05.2026 – 10.07.2026",
    title: "Software Engineering Program Intern",
    org: "JPMorgan Chase & Co. — Bengaluru",
    description:
      "Consumer & Community Banking (Wealth Management). Designed & implemented a retry-replay mechanism with DB-based transaction tracking to auto-recover failed asset transfers on production. Built Splunk dashboards across 2 Spring Boot microservices, configured Control-M batch scheduling with Jenkins CI/CD on private cloud.",
    tech: ["Java", "Spring Boot", "Splunk", "Control-M", "Jenkins CI/CD", "PostgreSQL", "Agile/Scrum"],
  },
  {
    version: "NEXT",
    dateRange: "Now",
    title: "Seeking Full-Time Software Engineering & Tech Roles",
    org: "Open to High-Impact Opportunities",
    description:
      "Ready to build high-throughput services, distributed systems, and resilient infrastructure at scale.",
    tech: ["Java", "Spring Boot", "Node.js", "TypeScript", "Distributed Systems", "AWS"],
    isNext: true,
  },
];
