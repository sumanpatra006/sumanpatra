"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

interface GraphConnectorProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
  delay?: number;
  isVisible?: boolean;
}

/**
 * Stepped/orthogonal SVG path between two node positions.
 * Right angles (not bezier curves) — reads as circuit-board.
 * Source: docs/03-design-system.md §Pixel node & connector language
 */
export function GraphConnector({
  x1,
  y1,
  x2,
  y2,
  active = false,
  delay = 0,
  isVisible = true,
}: GraphConnectorProps) {
  const prefersReduced = useReducedMotion();

  // Create a stepped path: go halfway horizontal, then vertical, then the rest horizontal
  const midX = x1 + (x2 - x1) / 2;
  const path = `M ${x1} ${y1} L ${midX} ${y1} L ${midX} ${y2} L ${x2} ${y2}`;

  return (
    <motion.path
      d={path}
      fill="none"
      stroke={active ? "var(--accent-primary)" : "var(--neutral-dim)"}
      strokeWidth={active ? 2 : 1}
      strokeLinecap="square"
      initial={
        prefersReduced
          ? { opacity: isVisible ? (active ? 0.9 : 0.4) : 0 }
          : { pathLength: 0, opacity: 0 }
      }
      animate={
        isVisible
          ? {
              pathLength: 1,
              opacity: active ? 0.9 : 0.4,
              stroke: active ? "var(--accent-primary)" : "var(--neutral-dim)",
              strokeWidth: active ? 2 : 1,
            }
          : { pathLength: 0, opacity: 0 }
      }
      transition={{
        pathLength: {
          delay: prefersReduced ? 0 : delay,
          duration: prefersReduced ? 0 : 0.5,
          ease: "easeOut",
        },
        opacity: {
          delay: prefersReduced ? 0 : delay,
          duration: 0.3,
        },
        stroke: { duration: 0.3 },
        strokeWidth: { duration: 0.3 },
      }}
      style={
        active
          ? {
              filter:
                "drop-shadow(0 0 3px var(--accent-primary))",
            }
          : {}
      }
    />
  );
}
