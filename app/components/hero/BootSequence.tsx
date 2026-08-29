"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

const BOOT_LINES = [
  { text: "PROJECT: HUMAN.EXE", delay: 0 },
  { text: "VERSION: 4.0", delay: 200 },
  { text: "STATUS: DEVELOPING...", delay: 400 },
  { text: "", delay: 600 },
  { text: "> Loading source...", delay: 800 },
  { text: "> Resolving dependencies...", delay: 1100 },
  { text: "> Running tests...", delay: 1400 },
  { text: "> Building experience...", delay: 1700 },
  { text: "", delay: 1900 },
  { text: "BUILD SUCCESSFUL.", delay: 2100 },
];

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const prefersReduced = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const skip = useCallback(() => {
    if (!isComplete) {
      setVisibleLines(BOOT_LINES.length);
      setIsComplete(true);
      setSkipped(true);
      setTimeout(onComplete, 300);
    }
  }, [isComplete, onComplete]);

  useEffect(() => {
    if (prefersReduced) {
      setVisibleLines(BOOT_LINES.length);
      setIsComplete(true);
      setTimeout(onComplete, 500);
      return;
    }

    const timers: ReturnType<typeof setTimeout>[] = [];

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
        }, line.delay)
      );
    });

    // Mark complete
    timers.push(
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(onComplete, 800);
      }, 2500)
    );

    return () => timers.forEach(clearTimeout);
  }, [prefersReduced, onComplete]);

  return (
    <div
      className="flex flex-col items-center justify-center cursor-pointer"
      onClick={skip}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && skip()}
      aria-label="Skip boot sequence"
    >
      <div className="w-full max-w-md px-4">
        <div className="space-y-1 font-mono text-sm md:text-base">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <motion.div
              key={i}
              initial={
                prefersReduced || skipped
                  ? { opacity: 1 }
                  : { opacity: 0, x: -4 }
              }
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
            >
              {line.text === "" ? (
                <div className="h-4" />
              ) : line.text === "BUILD SUCCESSFUL." ? (
                <span className="text-accent-primary font-bold">
                  {line.text}
                </span>
              ) : line.text.startsWith(">") ? (
                <span className="text-text-secondary">{line.text}</span>
              ) : line.text.startsWith("PROJECT:") ? (
                <span className="text-text-primary font-bold">{line.text}</span>
              ) : (
                <span className="text-text-secondary">{line.text}</span>
              )}
            </motion.div>
          ))}

          {/* Blinking cursor on the last visible line */}
          {visibleLines > 0 &&
            visibleLines < BOOT_LINES.length &&
            !isComplete && (
              <span className="text-accent-primary animate-pulse">█</span>
            )}
        </div>
      </div>
    </div>
  );
}
