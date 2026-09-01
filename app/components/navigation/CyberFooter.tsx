"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Terminal, Mail, FileText, Radio } from "lucide-react";

interface CyberFooterProps {
  onOpenTerminal?: () => void;
}

export function CyberFooter({ onOpenTerminal }: CyberFooterProps) {
  const [latency, setLatency] = useState(14);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Dynamic simulated latency fluctuation
    const interval = setInterval(() => {
      setLatency(Math.floor(12 + Math.random() * 6));
    }, 4000);

    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + " UTC");
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(clockInterval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-border-subtle bg-bg-secondary/80 backdrop-blur-xl font-mono text-xs text-text-secondary relative overflow-hidden">
      {/* Top Cyber Accent Line */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-accent-primary to-transparent opacity-60" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-border-subtle/60">
          {/* Col 1: System Brand & Status */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse shadow-[0_0_10px_var(--accent-primary)]" />
              <span className="font-display text-text-primary text-base font-bold tracking-wide">
                K. SUMAN PATRA
              </span>
              <span className="px-2 py-0.5 rounded bg-accent-secondary/15 text-accent-secondary text-[10px] font-bold border border-accent-secondary/30">
                human.exe v4.2
              </span>
            </div>
            <p className="text-text-secondary text-xs max-w-md leading-relaxed">
              Backend-leaning Software Engineer building high-throughput systems, event-driven architectures, and resilient cloud services.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-neutral-bright pt-1">
              <span className="flex items-center gap-1">
                <Radio className="w-3 h-3 text-accent-secondary" />
                STATUS: ALL SERVICES NOMINAL
              </span>
              <span>•</span>
              <span className="text-accent-primary">{currentTime}</span>
            </div>
          </div>

          {/* Col 2: Telemetry Node Metrics */}
          <div className="space-y-2.5">
            <span className="text-text-primary font-bold text-[11px] uppercase tracking-wider block">
              SYSTEM TELEMETRY
            </span>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between text-neutral-bright">
                <span>PING LATENCY:</span>
                <span className="text-accent-primary font-bold">{latency}ms</span>
              </div>
              <div className="flex items-center justify-between text-neutral-bright">
                <span>GATEWAY REGION:</span>
                <span className="text-text-secondary">IN-BLR-01</span>
              </div>
              <div className="flex items-center justify-between text-neutral-bright">
                <span>SYSTEM UPTIME:</span>
                <span className="text-accent-secondary font-bold">99.99%</span>
              </div>
              <div className="flex items-center justify-between text-neutral-bright">
                <span>SYSTEM KERNEL:</span>
                <span className="text-accent-primary font-bold">ONLINE (v4.2)</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation & Network Dock */}
          <div className="space-y-2.5">
            <span className="text-text-primary font-bold text-[11px] uppercase tracking-wider block">
              QUICK COMMANDS
            </span>
            <div className="flex flex-col gap-1.5">
              {onOpenTerminal && (
                <button
                  onClick={onOpenTerminal}
                  className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors text-left cursor-pointer group"
                >
                  <Terminal className="w-3.5 h-3.5 text-accent-primary group-hover:animate-pulse" />
                  <span>Launch CLI Terminal (~)</span>
                </button>
              )}
              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors group"
              >
                <FileText className="w-3.5 h-3.5 text-accent-secondary" />
                <span>Download Resume (PDF)</span>
              </a>
              <button
                onClick={scrollToTop}
                className="flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors text-left cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5 text-accent-primary" />
                <span>Return to Top (^)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Social Links & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/sumanpatra006"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-accent-primary text-text-secondary hover:text-accent-primary transition-all shadow-sm flex items-center justify-center"
              title="GitHub (sumanpatra006)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/ksumanpatra"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-md bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-accent-primary text-text-secondary hover:text-accent-primary transition-all shadow-sm flex items-center justify-center"
              title="LinkedIn (ksumanpatra)"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
            <a
              href="mailto:ksumanpatra06@gmail.com"
              className="p-2 rounded-md bg-bg-surface hover:bg-bg-elevated border border-border-subtle hover:border-accent-primary text-text-secondary hover:text-accent-primary transition-all shadow-sm"
              title="Email Transmission (ksumanpatra06@gmail.com)"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <div className="text-center sm:text-right text-[11px] text-neutral-bright">
            <p>© {new Date().getFullYear()} K. Suman Patra • human.exe runtime environment.</p>
            <p className="mt-0.5 text-text-secondary/70">Engineered with Next.js 16, Three.js, Tailwind &amp; Web Audio API</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
