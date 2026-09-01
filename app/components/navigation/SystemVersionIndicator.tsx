"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "hero", version: "SYS", label: "BOOT" },
  { id: "skills", version: "DEP", label: "DEPS" },
  { id: "projects", version: "PKG", label: "PKGS" },
  { id: "experience", version: "LOG", label: "LOG" },
  { id: "contact", version: "API", label: "API" },
];

export function SystemVersionIndicator() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[9990] hidden lg:flex flex-col items-center gap-1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
      aria-label="Section navigation"
    >
      {SECTIONS.map(({ id, version, label }, i) => {
        const isActive = activeSection === id;
        const isPast = SECTIONS.findIndex((s) => s.id === activeSection) > i;

        return (
          <button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`group flex items-center gap-2 px-2 py-1.5 rounded-sm transition-all cursor-pointer ${
              isActive
                ? "bg-accent-primary/10"
                : "hover:bg-bg-elevated"
            }`}
            aria-label={`Navigate to ${label} section`}
            aria-current={isActive ? "true" : undefined}
          >
            {/* Dot indicator */}
            <div
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                isActive
                  ? "bg-accent-primary shadow-[0_0_6px_var(--accent-primary-dim)]"
                  : isPast
                    ? "bg-neutral-bright"
                    : "bg-neutral-dim"
              }`}
            />
            {/* Label */}
            <span
              className={`font-mono text-[9px] tracking-wider transition-colors ${
                isActive
                  ? "text-accent-primary font-bold"
                  : isPast
                    ? "text-neutral-bright"
                    : "text-neutral-dim group-hover:text-text-secondary"
              }`}
            >
              {version}
            </span>

            {/* Connector line to next */}
            {i < SECTIONS.length - 1 && (
              <div
                className={`absolute left-[15px] mt-[28px] w-[1px] h-[8px] ${
                  isPast ? "bg-neutral-bright" : "bg-neutral-dim"
                }`}
              />
            )}
          </button>
        );
      })}
    </motion.nav>
  );
}
