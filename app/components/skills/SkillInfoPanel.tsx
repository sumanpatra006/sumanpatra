"use client";

import { motion } from "framer-motion";
import type { Skill } from "@/data/skills";
import type { Project } from "@/data/projects";

interface SkillInfoPanelProps {
  skill: Skill;
  projects: Project[];
  x: number;
  y: number;
}

export function SkillInfoPanel({ skill, projects }: SkillInfoPanelProps) {
  return (
    <motion.div
      className="absolute top-4 right-4 w-56 bg-bg-elevated border border-neutral-dim rounded-sm p-4 shadow-lg font-mono z-50"
      initial={{ opacity: 0, scale: 0.95, y: -4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <h4 className="text-accent-primary text-sm font-bold mb-1">
        {skill.label}
      </h4>
      <p className="text-text-secondary text-xs mb-2 capitalize">
        {skill.category}
      </p>
      <div className="border-t border-neutral-dim pt-2">
        <p className="text-xs text-text-secondary mb-1">
          Used in {projects.length} project{projects.length !== 1 ? "s" : ""}:
        </p>
        {projects.length > 0 ? (
          <ul className="space-y-1">
            {projects.map((p) => (
              <li key={p.id} className="text-xs text-text-primary flex items-center gap-1">
                <span className="text-accent-primary">◆</span> {p.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-neutral-bright italic">
            Foundation skill — used across the system
          </p>
        )}
      </div>
    </motion.div>
  );
}
