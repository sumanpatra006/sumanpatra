"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

interface DiagnosticLineProps {
  label: string;
  status: string;
  delay: number;
  isVisible: boolean;
  statusColor?: string;
}

export function DiagnosticLine({
  label,
  status,
  delay,
  isVisible,
  statusColor = "var(--accent-primary)",
}: DiagnosticLineProps) {
  const prefersReduced = useReducedMotion();

  if (!isVisible) return null;

  return (
    <motion.div
      className="flex items-center gap-2 font-mono text-sm md:text-base"
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: prefersReduced ? 0 : delay, duration: 0.3 }}
    >
      <span className="text-text-secondary min-w-[260px] md:min-w-[320px]">
        {label}
      </span>
      <motion.span
        style={{ color: statusColor }}
        className="font-bold"
        initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          delay: prefersReduced ? 0 : delay + 0.25,
          duration: 0.2,
          type: "spring",
          stiffness: 300,
        }}
      >
        {status}
      </motion.span>
    </motion.div>
  );
}
