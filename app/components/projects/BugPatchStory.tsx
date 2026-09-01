"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";
import { AlertTriangle, CheckCircle2, RotateCcw, Wrench } from "lucide-react";

interface BugPatchStoryProps {
  bugStory: {
    trigger: string;
    rootCause: string;
    fix: string;
    outcome: string;
  };
}

type StoryPhase = "glitching" | "investigate" | "packet_flying" | "revealed" | "fixed";

export function BugPatchStory({ bugStory }: BugPatchStoryProps) {
  const [phase, setPhase] = useState<StoryPhase>("glitching");
  const prefersReduced = useReducedMotion();

  const handleInvestigate = () => {
    setPhase("packet_flying");
    // Packet flies into the node for 600ms, then reveals root cause and fix
    setTimeout(() => {
      setPhase("revealed");
    }, 650);

    // Auto-transition to fixed state after 4.5s
    setTimeout(() => {
      setPhase("fixed");
    }, 5000);
  };

  const handleReset = () => {
    setPhase("glitching");
  };

  return (
    <div className="relative border border-accent-error/40 bg-bg-primary/95 rounded-sm p-3.5 sm:p-5 mt-3 overflow-hidden shadow-lg">
      {/* ── Data Packet Patch Animation (Travels into the node) ── */}
      {phase === "packet_flying" && !prefersReduced && (
        <motion.div
          className="absolute z-20 w-3 h-3 rounded-full bg-accent-primary shadow-[0_0_12px_var(--accent-primary)]"
          initial={{ left: "10%", top: "80%", opacity: 0 }}
          animate={{ left: "30px", top: "35px", opacity: 1, scale: [1, 1.5, 0] }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-accent-error animate-pulse flex-shrink-0" />
          <span className="text-accent-error text-xs font-mono font-bold uppercase tracking-wider">
            Production Incident Case Study
          </span>
        </div>
        <span className="text-[10px] font-mono text-neutral-bright">CCB / Wealth Management</span>
      </div>

      {/* Glitching Node & Incident Description */}
      <div className="flex items-start gap-2.5 sm:gap-3.5 mb-4">
        <motion.div
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mt-1 rotate-45 flex-shrink-0 transition-colors duration-500 ${
            phase === "fixed"
              ? "bg-accent-primary shadow-[0_0_12px_var(--accent-primary)]"
              : "bg-accent-error"
          }`}
          animate={
            phase === "glitching" && !prefersReduced
              ? {
                  x: [0, -3, 2, -2, 3, 0],
                  opacity: [1, 0.5, 1, 0.7, 1, 1],
                  boxShadow: [
                    "0 0 4px var(--accent-error-dim)",
                    "0 0 16px var(--accent-error)",
                    "0 0 4px var(--accent-error-dim)",
                  ],
                }
              : {}
          }
          transition={
            phase === "glitching"
              ? { duration: 0.25, repeat: Infinity }
              : {}
          }
        />
        <div className="flex-1 min-w-0">
          <p className="text-text-primary text-xs sm:text-sm font-mono font-bold leading-snug">
            {bugStory.trigger}
          </p>
          {phase === "glitching" && (
            <p className="text-accent-error text-[11px] sm:text-xs font-mono mt-1 animate-pulse">
              ● Anomaly detected in telemetry stream — replay execution bottleneck
            </p>
          )}
        </div>
      </div>

      {/* Step 1: Trigger Investigation Button */}
      {phase === "glitching" && (
        <motion.button
          onClick={() => setPhase("investigate")}
          className="px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-mono font-bold border border-accent-error text-accent-error rounded-sm hover:bg-accent-error/10 transition-colors cursor-pointer w-full flex items-center justify-center gap-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Wrench className="w-3.5 h-3.5 flex-shrink-0" />
          <span>[ 1. INITIALIZE SYSTEM DIAGNOSTICS ]</span>
        </motion.button>
      )}

      {/* Step 2: Log Analysis & Patch Dispatch */}
      {phase === "investigate" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="bg-bg-elevated p-2.5 sm:p-3 rounded text-[11px] sm:text-xs font-mono space-y-1.5 border border-border-subtle break-words">
            <p className="text-accent-error">
              &gt; Scanning Splunk telemetry logs... [Anomaly Identified]
            </p>
            <p className="text-text-secondary">
              &gt; Analyzing Control-M batch scheduling &amp; replay queue drops...
            </p>
            <p className="text-accent-primary">
              &gt; Ready to dispatch hotfix microservice packet.
            </p>
          </div>

          <button
            onClick={handleInvestigate}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-mono font-bold border border-border-accent text-accent-primary bg-accent-primary/10 hover:bg-accent-primary/20 transition-all cursor-pointer w-full rounded-sm flex items-center justify-center gap-2 shadow-[0_0_12px_var(--accent-primary-dim)] text-center"
          >
            <span>[ 2. DISPATCH REPAIR DATA PACKET ]</span>
          </button>
        </motion.div>
      )}

      {/* Step 3: Revealed Root Cause, Fix & Outcome */}
      <AnimatePresence>
        {(phase === "revealed" || phase === "fixed") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.4 }}
            className="space-y-3 pt-2"
          >
            <div className="bg-bg-surface p-3 sm:p-3.5 rounded border border-border-subtle space-y-3 font-mono text-xs">
              <div>
                <p className="text-accent-error text-[10px] uppercase font-bold tracking-wider mb-1">
                  [!] Root Cause Analysis
                </p>
                <p className="text-text-primary text-[11px] sm:text-xs leading-relaxed">
                  {bugStory.rootCause}
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <p className="text-accent-primary text-[10px] uppercase font-bold tracking-wider mb-1">
                  [✓] Hotfix &amp; Mechanism Applied
                </p>
                <p className="text-text-primary text-[11px] sm:text-xs leading-relaxed">
                  {bugStory.fix}
                </p>
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <p className="text-accent-secondary text-[10px] uppercase font-bold tracking-wider mb-1">
                  [★] Production Verification &amp; Metric Outcome
                </p>
                <p className="text-text-primary text-[11px] sm:text-xs leading-relaxed">
                  {bugStory.outcome}
                </p>
              </div>
            </div>

            {/* Resolved Status Bar */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2.5 border-t border-border-subtle font-mono text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-1.5 text-accent-primary font-bold text-[11px] sm:text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-primary flex-shrink-0" />
                <span>Service Restored • Replay Mechanism Stable</span>
              </div>
              <button
                onClick={handleReset}
                className="text-neutral-bright hover:text-text-primary transition-colors cursor-pointer flex items-center gap-1 text-[11px] self-end sm:self-auto"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay Incident</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
