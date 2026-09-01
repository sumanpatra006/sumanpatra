export interface Project {
  id: string;
  name: string;
  summary: string;
  stack: string[]; // skill ids
  links?: { github?: string; live?: string };
  tag?: string;
  bugStory?: {
    trigger: string;
    rootCause: string;
    fix: string;
    outcome: string;
  };
}

export const projects: Project[] = [
  {
    id: "tnp-placement-portal",
    name: "TnP Placement Portal (VSSUT)",
    summary:
      "Full-stack placement management platform for VSSUT’s Training & Placement Cell. Centralized system replacing manual spreadsheet/PDF tracking for student, company, and application data with AWS S3 storage and JWT/Zod-secured APIs.",
    stack: [
      "typescript",
      "expressjs",
      "prisma",
      "postgresql",
      "reactjs",
      "zustand",
      "aws",
      "tailwind",
      "nodejs",
      "zod",
    ],
    links: {
      github: "https://github.com/sumanpatra006",
    },
    tag: "full-stack",
  },
  {
    id: "url-shortener",
    name: "Scalable URL Shortener",
    summary:
      "Scalable MERN stack URL shortener applying system design principles for read-heavy workloads: collision-free short-code generation, indexed lookups for fast redirects, JWT auth with HTTP-only cookies, and click-analytics dashboard with Redux & TanStack Router.",
    stack: ["mongodb", "expressjs", "reactjs", "nodejs", "redux", "javascript", "zod"],
    links: {
      github: "https://github.com/sumanpatra006",
    },
    tag: "system-design",
  },
  {
    id: "gramiq-backend",
    name: "GramIQ Multi-Admin Dashboard API",
    summary:
      "Engineered 21+ RESTful APIs for a multi-admin dashboard with role-based authentication and hierarchical access control using Node.js & Express.js. Designed database schema with Prisma ORM and integrated Redis session caching for high concurrency.",
    stack: ["nodejs", "expressjs", "prisma", "redis", "sql", "javascript", "postman"],
    tag: "backend-internship",
  },
  {
    id: "jpmc-c4g",
    name: "JPMC Code For Good Winner",
    summary:
      "Led a team of 7 engineers to 1st position among 60,000+ applicants at J.P.Morgan Chase’s flagship Code For Good Hackathon.",
    stack: ["java", "git", "sql"],
    tag: "team-lead-winner",
  },
  {
    id: "jpmc-internship",
    name: "JPMC Asset Transfer Retry-Replay Engine",
    summary:
      "Designed and implemented a retry-replay mechanism with DB-based transaction status tracking to auto-recover failed asset transfers on production systems at JPMorgan Chase (Wealth Management).",
    stack: ["java", "spring-boot", "jenkins", "controlm", "splunk", "sql", "git"],
    tag: "production-resilience",
    bugStory: {
      trigger: "Transient network drops & downstream database timeouts during high-volume asset transfer transactions.",
      rootCause:
        "Production asset transfer flows lacked an automated retry-replay pipeline with stateful DB transaction tracking, requiring manual operational triage when downstream endpoints encountered transient failures.",
      fix: "Architected a DB-backed transaction status tracking engine with automatic retry-replay microservice logic in Java/Spring Boot, orchestrated batch job scheduling with Control-M and Jenkins CI/CD, and constructed real-time Splunk telemetry dashboards.",
      outcome:
        "Auto-recovered failed asset transfers across production flows with automated reconciliation, real-time error visibility on Splunk",
    },
  },
];
