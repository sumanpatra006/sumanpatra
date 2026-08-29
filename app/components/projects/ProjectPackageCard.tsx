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
        className="w-full text-left p-5 md:p-6 flex items-start justify-between gap-4 group cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Package className="w-4 h-4 text-accent-primary flex-shrink-0" />
            <span className="text-text-primary font-mono text-base md:text-lg font-bold group-hover:text-accent-primary transition-colors">
              {project.name}
            </span>
            {project.tag && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-accent-primary/10 text-accent-primary border border-border-accent rounded uppercase font-bold">
                {project.tag}
              </span>
            )}
            {project.bugStory && (
              <span className="px-2 py-0.5 text-[10px] font-mono bg-accent-error/10 text-accent-error border border-accent-error/30 rounded uppercase font-bold animate-pulse">
                ⚠ Production Case Study
              </span>
            )}
          </div>
          <p className="text-text-secondary text-xs md:text-sm font-mono leading-relaxed">
            {project.summary}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 pt-1">
          <span className="px-2.5 py-1 text-[11px] font-mono bg-bg-elevated border border-border-subtle text-text-secondary rounded">
            {stackLabels.length} deps
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-text-secondary group-hover:text-accent-primary"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
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
            <div className="px-5 md:px-6 pb-6 border-t border-border-subtle pt-5 space-y-5">
              {/* Tech stack dependency tags */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-bright mb-2.5 uppercase tracking-wider font-semibold">
                  <Cpu className="w-3.5 h-3.5 text-accent-primary" />
                  <span>Loaded Stack Architecture</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {stackLabels.map((label) => (
                    <span
                      key={label}
                      className="px-2.5 py-1 text-xs font-mono border border-border-subtle text-text-secondary rounded bg-bg-primary hover:border-accent-primary hover:text-text-primary transition-colors"
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {project.links && (
                <div className="flex gap-3 pt-2">
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-mono font-semibold border border-border-subtle text-text-secondary rounded hover:border-accent-primary hover:text-accent-primary hover:bg-accent-primary/10 transition-all flex items-center gap-2"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Source Repository</span>
                    </a>
                  )}
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-xs font-mono font-semibold border border-border-accent text-accent-primary rounded bg-accent-primary/10 hover:bg-accent-primary/20 transition-all flex items-center gap-2"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Production Demo</span>
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
