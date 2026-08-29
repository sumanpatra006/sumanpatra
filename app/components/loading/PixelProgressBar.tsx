"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

interface PixelProgressBarProps {
  progress: number; // 0–100
  delay?: number;
}

export function PixelProgressBar({
  progress,
  delay = 0,
}: PixelProgressBarProps) {
  const prefersReduced = useReducedMotion();
  const totalSegments = 30;
  const filledSegments = Math.round((progress / 100) * totalSegments);

  return (
    <div className="flex items-center gap-3 font-mono">
      {/* Progress bar container */}
      <div className="flex items-center gap-0">
        <span className="text-neutral-bright text-sm">&#91;</span>
        <div className="flex gap-[1px]">
          {Array.from({ length: totalSegments }).map((_, i) => (
            <motion.div
              key={i}
              className="w-[8px] md:w-[10px] h-[14px] md:h-[16px]"
              initial={
                prefersReduced
                  ? {
                      backgroundColor:
                        i < filledSegments
                          ? "var(--accent-primary)"
                          : "var(--neutral-dim)",
                    }
                  : { backgroundColor: "var(--neutral-dim)" }
              }
              animate={{
                backgroundColor:
                  i < filledSegments
                    ? "var(--accent-primary)"
                    : "var(--neutral-dim)",
              }}
              transition={{
                delay: prefersReduced ? 0 : delay + i * 0.06,
                duration: 0.05,
              }}
              style={{
                boxShadow:
                  i < filledSegments
                    ? "0 0 4px var(--accent-primary-dim)"
                    : "none",
              }}
            />
          ))}
        </div>
        <span className="text-neutral-bright text-sm">&#93;</span>
      </div>

      {/* Percentage */}
      <motion.span
        className="text-accent-primary font-bold text-sm md:text-base min-w-[48px] text-right"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReduced ? 0 : delay + 0.3 }}
      >
        {progress}%
      </motion.span>
    </div>
  );
}
