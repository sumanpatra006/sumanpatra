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
    name: "tnp-placement-portal",
    summary:
      "End-to-end placement portal — auth, file storage, and a full application flow, built solo.",
    stack: [
      "typescript",
      "expressjs",
      "prisma",
      "postgresql",
      "reactjs",
      "zustand",
      "aws",
      "javascript",
      "nodejs",
      "sql",
    ],
    links: {
      github: "https://github.com",  // [FILL: actual GitHub URL]
    },
  },
  {
    id: "url-shortener",
    name: "url-shortener",
    summary:
      "A URL shortener web app — classic system-design exercise done as a real, working project.",
    stack: ["mongodb", "expressjs", "reactjs", "nodejs", "javascript"],
    links: {
      github: "https://github.com",  // [FILL: actual GitHub URL]
    },
  },
  {
    id: "jpmc-c4g",
    name: "jpmc-code-for-good",
    summary:
      "Led a team of 7 to 1st place among 60,000+ applicants at JPMorgan Chase's Code For Good Hackathon.",
    stack: ["java", "git"],
    tag: "team-lead",
  },
  {
    id: "jpmc-internship",
    name: "jpmc-retry-replay",
    summary:
      "Production reliability engineering — retry-replay mechanism for Consumer & Community Banking, Wealth Management systems.",
    stack: ["java", "spring-boot", "jenkins", "controlm", "splunk", "sql", "git"],
    bugStory: {
      trigger: "Retry-replay mechanism — production reliability issue",
      rootCause:
        "[FILL: Describe what was failing in the retry/replay flow — e.g., what was retried, what condition caused failures, what Splunk dashboards surfaced]",
      fix: "[FILL: The mechanism/change you implemented — e.g., Java/Spring Boot microservice change, Control-M scheduling adjustment]",
      outcome:
        "[FILL: The measurable result — e.g., fewer failed jobs, faster detection via Splunk dashboards]",
    },
  },
];
