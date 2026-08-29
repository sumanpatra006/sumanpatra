"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { CyberCatCompanion } from "@/app/components/3d/CyberCatCompanion";

interface IdentityNodeRevealProps {
  isVisible: boolean;
}

export function IdentityNodeReveal({ isVisible }: IdentityNodeRevealProps) {
  const prefersReduced = useReducedMotion();

  if (!isVisible) return null;

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 px-4 py-8">
      {/* ── Left Hero Copy ── */}
      <motion.div
        className="flex-1 text-left flex flex-col items-start"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -25 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Status Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-bg-surface/85 border border-border-accent rounded-full text-xs font-mono mb-5 backdrop-blur-md shadow-[0_0_16px_var(--accent-primary-dim)]"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: prefersReduced ? 0 : 0.2 }}
        >
          <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse shadow-[0_0_8px_var(--accent-primary)]" />
          <span className="text-text-secondary">SYSTEM CORE:</span>
          <span className="text-accent-primary font-bold">ONLINE (v4.0)</span>
        </motion.div>

        {/* Name in Chakra Petch display font */}
        <motion.h1
          className="font-display text-text-primary text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-3"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReduced ? 0 : 0.3, duration: 0.6 }}
        >
          K. Suman Patra
        </motion.h1>

        {/* Role */}
        <motion.p
          className="text-text-secondary text-base sm:text-lg lg:text-xl font-mono font-medium mb-6"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReduced ? 0 : 0.4, duration: 0.6 }}
        >
          Backend-leaning Software Engineer, in progress.
        </motion.p>

        {/* Punchline Sub-box */}
        <motion.div
          className="bg-bg-surface/90 backdrop-blur-md px-5 py-3 rounded-sm border border-border-accent shadow-xl max-w-lg mb-8"
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: prefersReduced ? 0 : 0.5, duration: 0.6 }}
        >
          <p className="text-accent-primary text-xs sm:text-sm font-mono font-semibold leading-relaxed">
            &quot;I build the parts of software you don&apos;t see until they break.&quot;
          </p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="flex items-center gap-3 text-neutral-bright text-xs font-mono"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.8 }}
        >
          <span className="w-1.5 h-1.5 bg-accent-primary rounded-full animate-ping" />
          <span className="tracking-wider uppercase font-semibold">
            Scroll down to inspect system architecture
          </span>
        </motion.div>
      </motion.div>

      {/* ── Right: 3D Cybernetic Robotic Cat Companion (NEKO.EXE) ── */}
      <motion.div
        className="flex-shrink-0 flex items-center justify-center"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: prefersReduced ? 0 : 0.4, duration: 0.8, type: "spring" }}
      >
        <CyberCatCompanion />
      </motion.div>
    </div>
  );
}
