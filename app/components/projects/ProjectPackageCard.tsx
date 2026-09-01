"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/data/projects";
import { skills } from "@/data/skills";
import { BugPatchStory } from "./BugPatchStory";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { ChevronRight, Package, ExternalLink, Code2, Cpu } from "lucide-react";

interface ProjectPackageCardProps {
  project: Project;
  index: number;
  isVisible: boolean;
}

export function ProjectPackageCard({
  project,
  index,
  isVisible,
}: ProjectPackageCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const prefersReduced = useReducedMotion();

  const stackLabels = project.stack
    .map((sid) => skills.find((s) => s.id === sid)?.label || sid)
    .filter(Boolean);

  return (
    <motion.div
      className="cyber-card rounded-sm overflow-hidden"
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: prefersReduced ? 0 : index * 0.12, duration: 0.4 }}
    >
      {/* Header — collapsed view */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group cursor-pointer transition-colors hover:bg-bg-elevated/40"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 min-w-0 w-full">
          {/* Title Row & Badges */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 flex-wrap min-w-0">
              <Package className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5 sm:mt-0" />
              <span className="text-text-primary font-mono text-sm sm:text-base md:text-lg font-bold group-hover:text-accent-primary transition-colors break-words">
                {project.name}
              </span>
            </div>
            
            {/* Desktop Quick Indicator */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <span className="px-2 py-0.5 text-[11px] font-mono bg-bg-elevated border border-border-subtle text-text-secondary rounded">
                {stackLabels.length} deps
              </span>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-text-secondary group-hover:text-accent-primary"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.div>
            </div>
          </div>

          {/* Tags */}
          {(project.tag || project.bugStory) && (
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {project.tag && (
                <span className="px-2 py-0.5 text-[10px] font-mono bg-accent-primary/10 text-accent-primary border border-border-accent rounded uppercase font-bold">
                  {project.tag}
                </span>
              )}
              {project.bugStory && (
                <span className="px-2 py-0.5 text-[10px] font-mono bg-accent-error/10 text-accent-error border border-accent-error/30 rounded uppercase font-bold animate-pulse">
                  ⚠ Case Study
                </span>
              )}
            </div>
          )}

          {/* Summary */}
          <p className="text-text-secondary text-xs sm:text-sm font-mono leading-relaxed">
            {project.summary}
          </p>

          {/* Mobile Bottom Quick Action Bar */}
          <div className="sm:hidden flex items-center justify-between pt-2.5 mt-2 border-t border-border-subtle/50 text-[11px] font-mono">
            <span className="text-neutral-bright text-[10px]">
              {stackLabels.length} dependencies loaded
            </span>
            <div className="flex items-center gap-1 text-accent-primary font-semibold">
              <span>{isExpanded ? "Collapse" : "Inspect Stack"}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </motion.div>
            </div>
          </div>
        </div>
      </button>

      {/* Expanded view */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 md:px-6 pb-5 sm:pb-6 border-t border-border-subtle pt-4 sm:pt-5 space-y-4 sm:space-y-5">
              {/* Tech stack dependency tags */}
              <div>
                <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-neutral-bright mb-2 sm:mb-2.5 uppercase tracking-wider font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-accent-primary" />
                  <span>Loaded Stack Architecture</span>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {stackLabels.map((label) => (
                    <span
                      key={label}
                      className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-mono border border-border-subtle text-text-secondary rounded bg-bg-primary hover:border-accent-primary hover:text-text-primary transition-colors"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {project.links && (
                <div className="flex flex-wrap gap-2 sm:gap-3 pt-1 sm:pt-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-mono font-semibold border border-border-subtle text-text-secondary rounded hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/10 transition-all flex items-center gap-1.5 sm:gap-2"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Source Repo</span>
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-mono font-semibold border border-border-accent text-accent-primary rounded bg-accent-primary/10 hover:bg-accent-primary/20 transition-all flex items-center gap-1.5 sm:gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              )}

              {/* Bug/Patch Story */}
              {project.bugStory && (
                <div className="pt-2">
                  <BugPatchStory bugStory={project.bugStory} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
