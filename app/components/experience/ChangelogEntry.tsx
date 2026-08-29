"use client";

import { motion } from "framer-motion";
import type { ExperienceEntry } from "@/data/experience";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

interface ChangelogEntryProps {
  entry: ExperienceEntry;
  index: number;
  isVisible: boolean;
}

export function ChangelogEntry({
  entry,
  index,
  isVisible,
}: ChangelogEntryProps) {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      className="relative flex gap-4 md:gap-6"
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -16 }}
      animate={isVisible ? { opacity: 1, x: 0 } : {}}
      transition={{
        delay: prefersReduced ? 0 : index * 0.2,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {/* Version badge + vertical line */}
      <div className="flex flex-col items-center flex-shrink-0 w-14 md:w-16">
        <motion.div
          className={`px-2 py-1 font-pixel text-[8px] md:text-[9px] rounded-sm border ${
            entry.isNext
              ? "bg-accent-primary/10 border-accent-primary text-accent-primary"
              : "bg-bg-elevated border-neutral-dim text-text-primary"
          }`}
          animate={
            entry.isNext && !prefersReduced
              ? {
                  boxShadow: [
                    "0 0 4px var(--accent-primary-dim)",
                    "0 0 12px var(--accent-primary-dim)",
                    "0 0 4px var(--accent-primary-dim)",
                  ],
                }
              : {}
          }
          transition={
            entry.isNext ? { duration: 2, repeat: Infinity } : {}
          }
        >
          {entry.version}
        </motion.div>
        {/* Connector line (not on last entry) */}
        {!entry.isNext && (
          <div className="w-[1px] flex-1 mt-2 bg-neutral-dim min-h-[40px]" />
        )}
      </div>

      {/* Content */}
      <div className="pb-8 md:pb-10 flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1 flex-wrap">
          <h3 className="text-text-primary font-mono text-sm md:text-base font-bold">
            {entry.title}
          </h3>
          <span className="text-neutral-bright text-xs font-mono">
            {entry.dateRange}
          </span>
        </div>
        <p className="text-accent-primary text-xs font-mono mb-2">
          {entry.org}
        </p>
        <p className="text-text-secondary text-sm font-mono leading-relaxed mb-3">
          {entry.description}
        </p>

        {/* Tech chips — skills gained at this version */}
        {entry.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {entry.tech.map((t) => (
              <span
                key={t}
                className="px-2 py-0.5 text-[10px] font-mono border border-neutral-dim text-text-secondary rounded-sm bg-bg-primary"
              >
                +{t}
              </span>
            ))}
          </div>
        )}

        {/* NEXT entry: blinking cursor */}
        {entry.isNext && (
          <div className="mt-3">
            <span className="text-accent-primary text-sm font-mono cursor-blink">
              &gt; awaiting next commit
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
