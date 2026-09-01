"use client";

import { motion } from "framer-motion";
import { experience } from "@/data/experience";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { GitCommit, GitBranch, Terminal } from "lucide-react";

interface GitCommitGraphProps {
  isVisible: boolean;
}

const COMMIT_META: Record<
  string,
  { hash: string; branch: string; diffAdded: string; diffRemoved: string; author: string }
> = {
  "v1.0": {
    hash: "9a2f1b0",
    branch: "main/vssut-burla",
    diffAdded: "+B.Tech IT (CGPA 9.36), +DSA/DBMS/OS/Networks",
    diffRemoved: "-0 legacy theory",
    author: "ksumanpatra06@vssut",
  },
  "v2.0": {
    hash: "f7b19a4",
    branch: "release/c4g-hackathon-1st",
    diffAdded: "+Team Lead (7 engineers), +Top 1/60,000+ applicants",
    diffRemoved: "-0 merge conflicts",
    author: "ksumanpatra06@jpmc-c4g",
  },
  "v3.0": {
    hash: "c3d84e1",
    branch: "feature/gramiq-apis-redis",
    diffAdded: "+21 REST APIs, +Prisma ORM, +Redis cache",
    diffRemoved: "-45% query latency under concurrency",
    author: "ksumanpatra06@gramiq",
  },
  "v4.0": {
    hash: "e5082b9",
    branch: "prod/wealth-management-resilience",
    diffAdded: "+Retry-Replay microservice, +Splunk dashboards, +Control-M batch",
    diffRemoved: "-100% manual triage on asset transfer failures",
    author: "ksumanpatra06@jpmorgan",
  },
  NEXT: {
    hash: "HEAD -> origin/career",
    branch: "main/seeking-fulltime",
    diffAdded: "+Ready to ship software engineering systems at scale",
    diffRemoved: "-0 blockers",
    author: "ksumanpatra06@gmail.com",
  },
};

export function GitCommitGraph({ isVisible }: GitCommitGraphProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="relative pl-6 sm:pl-8 md:pl-10 space-y-6 sm:space-y-8">
      {/* ── Illuminated Main Branch Rail with Traveling Data Pulses ── */}
      <div className="absolute left-2 sm:left-3 md:left-4 top-4 bottom-4 w-[2px] bg-gradient-to-b from-accent-primary via-accent-secondary to-accent-primary opacity-40 shadow-[0_0_10px_var(--accent-primary)]">
        {/* Animated Traveling Data Packet down the rail */}
        {!prefersReduced && (
          <motion.div
            className="w-1.5 h-3 -left-[2px] absolute bg-accent-primary rounded-full shadow-[0_0_8px_var(--accent-primary)]"
            animate={{
              top: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      {experience.map((entry, index) => {
        const meta = COMMIT_META[entry.version] || {
          hash: "7b01fa2",
          branch: "main",
          diffAdded: "+features",
          diffRemoved: "-bugs",
          author: "suman",
        };

        const isNext = entry.isNext;

        return (
          <motion.div
            key={entry.version}
            className="relative flex items-start gap-3 sm:gap-4 md:gap-6 group"
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -20 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: prefersReduced ? 0 : index * 0.15, duration: 0.5 }}
          >
            {/* Git Commit Node Diamond */}
            <div className="absolute -left-[21px] sm:-left-[27px] md:-left-[35px] top-4 z-10">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rotate-45 flex items-center justify-center border transition-all duration-300 ${
                  isNext
                    ? "bg-accent-primary border-accent-primary shadow-[0_0_14px_var(--accent-primary)]"
                    : "bg-bg-elevated border-border-accent group-hover:border-accent-primary group-hover:shadow-[0_0_10px_var(--accent-primary-dim)]"
                }`}
              >
                <div className="-rotate-45 text-[7px] sm:text-[8px] font-mono font-bold text-bg-primary">
                  {isNext ? "★" : "◆"}
                </div>
              </div>
            </div>

            {/* Holographic Git Commit Card */}
            <div
              className={`flex-1 cyber-card rounded-sm p-4 sm:p-5 md:p-6 transition-all duration-300 ${
                isNext
                  ? "border-accent-primary/60 bg-bg-surface/90 shadow-[0_0_24px_var(--accent-primary-dim)]"
                  : ""
              }`}
            >
              {/* Commit Meta Header */}
              <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-border-subtle text-[11px] sm:text-xs font-mono">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <GitCommit className="w-3.5 h-3.5 text-accent-primary flex-shrink-0" />
                  <span className="font-bold text-accent-primary">{meta.hash}</span>
                  <span className="text-neutral-bright">on</span>
                  <span className="text-accent-secondary flex items-center gap-1">
                    <GitBranch className="w-3 h-3 inline" /> {meta.branch}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-neutral-bright text-[10px] sm:text-[11px]">
                  <span>{meta.author}</span>
                  <span>•</span>
                  <span>{entry.dateRange}</span>
                </div>
              </div>

              {/* Title & Role */}
              <div className="mb-2">
                <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                  <h3 className="font-display text-text-primary text-sm sm:text-base md:text-lg font-bold">
                    {entry.title}
                  </h3>
                  <span className="text-accent-primary text-[11px] sm:text-xs font-mono font-semibold">
                    @{entry.org}
                  </span>
                </div>
                <p className="text-text-secondary text-xs sm:text-sm font-mono mt-1 leading-relaxed">
                  {entry.description}
                </p>
              </div>

              {/* Git Diff Stats */}
              <div className="my-2.5 sm:my-3 flex flex-wrap gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono bg-bg-primary/60 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded border border-border-subtle">
                <span className="text-accent-primary font-semibold flex items-center gap-1">
                  ▲ {meta.diffAdded}
                </span>
                <span className="text-accent-error font-semibold flex items-center gap-1">
                  ▼ {meta.diffRemoved}
                </span>
              </div>

              {/* Tech Chips */}
              {entry.tech.length > 0 && (
                <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2.5 sm:mt-3 pt-2">
                  {entry.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[9px] sm:text-[10px] font-mono border border-border-subtle text-text-secondary rounded bg-bg-elevated hover:border-accent-primary hover:text-text-primary transition-colors"
                    >
                      +{tech}
                    </span>
                  ))}
                </div>
              )}

              {/* Next Cursor */}
              {isNext && (
                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-border-subtle flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-accent-primary">
                  <Terminal className="w-3.5 h-3.5 animate-pulse flex-shrink-0" />
                  <span className="cursor-blink font-bold">&gt; git commit -m &quot;Next major career version&quot;</span>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
