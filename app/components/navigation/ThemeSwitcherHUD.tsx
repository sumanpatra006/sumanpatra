"use client";

import { useState, useEffect } from "react";
import { Palette, Terminal } from "lucide-react";

type ThemeOption = "cyan" | "amber" | "green" | "aurora";

const THEMES: { id: ThemeOption; label: string; color: string }[] = [
  { id: "cyan", label: "CYAN", color: "#00f0ff" },
  { id: "amber", label: "AMBER", color: "#ff9e3b" },
  { id: "green", label: "GREEN", color: "#39ff88" },
  { id: "aurora", label: "AURORA", color: "#00f5a0" },
];

interface ThemeSwitcherHUDProps {
  onOpenTerminal?: () => void;
}

export function ThemeSwitcherHUD({ onOpenTerminal }: ThemeSwitcherHUDProps) {
  const [currentTheme, setCurrentTheme] = useState<ThemeOption>("cyan");

  const changeTheme = (themeId: ThemeOption) => {
    setCurrentTheme(themeId);
    if (themeId === "cyan") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", themeId);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[9995] flex items-center gap-2 bg-bg-surface/85 backdrop-blur-md border border-border-subtle p-1.5 rounded-sm shadow-xl font-mono text-xs">
      <div className="flex items-center gap-1 px-2 py-1 text-text-secondary border-r border-border-subtle">
        <Palette className="w-3.5 h-3.5 text-accent-primary" />
        <span className="hidden sm:inline text-[11px]">THEME:</span>
      </div>

      <div className="flex items-center gap-1">
        {THEMES.map((t) => {
          const isActive = currentTheme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className={`px-2 py-1 rounded-[2px] transition-all cursor-pointer text-[10px] font-bold flex items-center gap-1.5 ${
                isActive
                  ? "bg-bg-elevated text-accent-primary border border-border-accent shadow-[0_0_8px_var(--accent-primary-dim)]"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/50"
              }`}
              title={`Switch to ${t.label} theme`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: t.color }}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {onOpenTerminal && (
        <button
          onClick={onOpenTerminal}
          className="ml-1 px-2 py-1 rounded-[2px] bg-accent-primary/10 border border-border-accent text-accent-primary hover:bg-accent-primary/20 transition-colors flex items-center gap-1 text-[10px] font-bold cursor-pointer"
          title="Open Terminal (Press ~)"
        >
          <Terminal className="w-3 h-3" />
          <span className="hidden md:inline">CLI (~)</span>
        </button>
      )}
    </div>
  );
}
