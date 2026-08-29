"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiagnosticLine } from "./DiagnosticLine";
import { PixelProgressBar } from "./PixelProgressBar";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

const DIAGNOSTICS = [
  { label: "Checking memory...............", status: "512MB OK", delay: 0.4 },
  { label: "Loading kernel modules........", status: "OK", delay: 0.9 },
  { label: "Scanning hardware.............", status: "OK", delay: 1.4 },
  { label: "Mounting filesystems..........", status: "OK", delay: 1.8 },
  { label: "Network interface.............", status: "CONNECTED", delay: 2.2 },
];

const TOTAL_DURATION = 4000; // 4 seconds fixed
const REDUCED_DURATION = 1000; // 1 second for reduced motion

interface SystemLoaderProps {
  onComplete: () => void;
}

export function SystemLoader({ onComplete }: SystemLoaderProps) {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<
    "post" | "diagnostics" | "progress" | "nodes" | "ready" | "done"
  >("post");
  const [progress, setProgress] = useState(0);
  const [visibleDiagnostics, setVisibleDiagnostics] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const duration = prefersReduced ? REDUCED_DURATION : TOTAL_DURATION;

  const handleSkip = useCallback(() => {
    if (phase !== "done") {
      setIsExiting(true);
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, 400);
    }
  }, [phase, onComplete]);

  // Main sequence timer
  useEffect(() => {
    if (prefersReduced) {
      // Reduced motion: quick fade, all content instant
      setPhase("diagnostics");
      setVisibleDiagnostics(DIAGNOSTICS.length);
      setProgress(100);
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setPhase("done");
          onComplete();
        }, 300);
      }, REDUCED_DURATION);
      return () => clearTimeout(timer);
    }

    // Full animation sequence
    const timers: ReturnType<typeof setTimeout>[] = [];

    // t=0.0s: POST header
    // Already in "post" phase

    // t=0.3s: Start diagnostics
    timers.push(
      setTimeout(() => {
        setPhase("diagnostics");
      }, 300)
    );

    // Reveal diagnostics one by one
    DIAGNOSTICS.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleDiagnostics(i + 1);
        }, 400 + i * 400)
      );
    });

    // Progress bar phases
    const progressSteps = [
      { time: 1200, value: 15 },
      { time: 1600, value: 35 },
      { time: 2000, value: 55 },
      { time: 2400, value: 72 },
      { time: 2700, value: 88 },
      { time: 3000, value: 100 },
    ];

    timers.push(
      setTimeout(() => {
        setPhase("progress");
      }, 1000)
    );

    progressSteps.forEach(({ time, value }) => {
      timers.push(
        setTimeout(() => {
          setProgress(value);
        }, time)
      );
    });

    // t=2.5s: Node formation
    timers.push(
      setTimeout(() => {
        setPhase("nodes");
      }, 2800)
    );

    // t=3.5s: Ready
    timers.push(
      setTimeout(() => {
        setPhase("ready");
      }, 3500)
    );

    // t=4.0s: Exit
    timers.push(
      setTimeout(() => {
        setIsExiting(true);
      }, TOTAL_DURATION)
    );

    // t=4.5s: Done
    timers.push(
      setTimeout(() => {
        setPhase("done");
        onComplete();
      }, TOTAL_DURATION + 500)
    );

    return () => timers.forEach(clearTimeout);
  }, [prefersReduced, onComplete]);

  if (phase === "done") return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-bg-primary cursor-pointer"
          onClick={handleSkip}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-[600px] px-6 md:px-8">
            {/* POST Header */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="font-pixel text-accent-primary text-xs md:text-sm tracking-wider">
                SYSTEM POST v4.0
              </h1>
              <div className="mt-2 h-[1px] bg-neutral-dim w-full" />
            </motion.div>

            {/* Diagnostic Lines */}
            <div className="space-y-2 mb-8">
              {DIAGNOSTICS.map((diag, i) => (
                <DiagnosticLine
                  key={diag.label}
                  label={diag.label}
                  status={diag.status}
                  delay={diag.delay}
                  isVisible={i < visibleDiagnostics}
                />
              ))}
            </div>

            {/* Progress Bar */}
            {(phase === "progress" ||
              phase === "nodes" ||
              phase === "ready") && (
              <motion.div
                className="mb-8"
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PixelProgressBar progress={progress} delay={0} />
              </motion.div>
            )}

            {/* Node Formation Preview */}
            {(phase === "nodes" || phase === "ready") && (
              <motion.div
                className="flex items-center justify-center gap-4 mb-8"
                initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="flex items-center gap-4">
                    <motion.div
                      className="w-3 h-3 bg-accent-primary rotate-45"
                      initial={
                        prefersReduced
                          ? { scale: 1, opacity: 1 }
                          : { scale: 0, opacity: 0 }
                      }
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: prefersReduced ? 0 : i * 0.15,
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      style={{
                        boxShadow: "0 0 8px var(--accent-primary-dim)",
                      }}
                    />
                    {i < 2 && (
                      <motion.div
                        className="w-8 h-[2px] bg-accent-primary"
                        initial={
                          prefersReduced
                            ? { scaleX: 1 }
                            : { scaleX: 0 }
                        }
                        animate={{ scaleX: 1 }}
                        transition={{
                          delay: prefersReduced ? 0 : i * 0.15 + 0.1,
                          duration: 0.3,
                        }}
                        style={{
                          transformOrigin: "left",
                          boxShadow: "0 0 4px var(--accent-primary-dim)",
                        }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Initializing / Ready message */}
            <motion.div className="text-center">
              {phase === "nodes" && (
                <motion.p
                  className="text-text-secondary text-sm font-mono"
                  initial={
                    prefersReduced ? { opacity: 1 } : { opacity: 0 }
                  }
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  &gt; Initializing HUMAN.EXE runtime...
                </motion.p>
              )}
              {phase === "ready" && (
                <motion.p
                  className="text-accent-primary text-sm font-mono font-bold"
                  initial={
                    prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.95 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  SYSTEM READY. Launching...
                </motion.p>
              )}
            </motion.div>

            {/* Skip hint */}
            <motion.p
              className="text-center text-neutral-bright text-xs mt-12 font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              click anywhere to skip
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
