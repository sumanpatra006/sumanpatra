"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/app/hooks/useReducedMotion";

export type NodeState = "rest" | "active" | "hovered" | "broken";

interface GraphNodeProps {
  x: number;
  y: number;
  label: string;
  state?: NodeState;
  size?: number;
  onClick?: () => void;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
  delay?: number;
  isVisible?: boolean;
  shape?: "diamond" | "square";
}

const stateStyles: Record<
  NodeState,
  { fill: string; stroke: string; glow: string; animate: boolean }
> = {
  rest: {
    fill: "var(--neutral-base)",
    stroke: "var(--neutral-bright)",
    glow: "none",
    animate: false,
  },
  active: {
    fill: "var(--accent-primary)",
    stroke: "var(--accent-primary)",
    glow: "0 0 8px var(--accent-primary-dim)",
    animate: true,
  },
  hovered: {
    fill: "var(--accent-primary)",
    stroke: "var(--accent-primary)",
    glow: "0 0 12px var(--accent-primary-dim), 0 0 20px var(--accent-primary-dim)",
    animate: true,
  },
  broken: {
    fill: "var(--accent-error)",
    stroke: "var(--accent-error)",
    glow: "0 0 12px var(--accent-error-dim)",
    animate: true,
  },
};

export function GraphNode({
  x,
  y,
  label,
  state = "rest",
  size = 10,
  onClick,
  onHoverStart,
  onHoverEnd,
  delay = 0,
  isVisible = true,
  shape = "diamond",
}: GraphNodeProps) {
  const prefersReduced = useReducedMotion();
  const style = stateStyles[state];
  const halfSize = size / 2;

  return (
    <motion.g
      className="cursor-pointer"
      onClick={onClick}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
      initial={
        prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0 }
      }
      animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
      transition={{
        delay: prefersReduced ? 0 : delay,
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Node shape */}
      <motion.rect
        x={x - halfSize}
        y={y - halfSize}
        width={size}
        height={size}
        rx={shape === "square" ? 1 : 0}
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={1}
        style={{
          filter:
            style.glow !== "none"
              ? `drop-shadow(0 0 4px ${state === "broken" ? "var(--accent-error)" : "var(--accent-primary)"})`
              : "none",
          transformOrigin: `${x}px ${y}px`,
          transform: shape === "diamond" ? "rotate(45deg)" : "none",
        }}
        animate={
          style.animate && !prefersReduced
            ? {
                filter: [
                  `drop-shadow(0 0 2px ${state === "broken" ? "var(--accent-error)" : "var(--accent-primary)"})`,
                  `drop-shadow(0 0 8px ${state === "broken" ? "var(--accent-error)" : "var(--accent-primary)"})`,
                  `drop-shadow(0 0 2px ${state === "broken" ? "var(--accent-error)" : "var(--accent-primary)"})`,
                ],
              }
            : {}
        }
        transition={
          style.animate
            ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
            : {}
        }
      />

      {/* Label */}
      <motion.text
        x={x}
        y={y + size + 14}
        textAnchor="middle"
        fill="var(--text-secondary)"
        fontSize={10}
        fontFamily="var(--font-mono)"
        className="select-none pointer-events-none"
        animate={{
          fill:
            state === "active" || state === "hovered"
              ? "var(--text-primary)"
              : "var(--text-secondary)",
        }}
      >
        {label}
      </motion.text>
    </motion.g>
  );
}
