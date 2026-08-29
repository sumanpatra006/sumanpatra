"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal as TerminalIcon, CornerDownLeft } from "lucide-react";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";

interface InteractiveTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

interface CommandLog {
  id: string;
  command?: string;
  rawText?: string;
  renderedText?: string;
  isTyping?: boolean;
}

export function InteractiveTerminalModal({
  isOpen,
  onClose,
  onOpen,
}: InteractiveTerminalModalProps) {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: "init",
      rawText: "HUMAN.EXE Embedded Shell v4.0.0 [Ready]\nType 'help' to view available system commands.",
      renderedText: "HUMAN.EXE Embedded Shell v4.0.0 [Ready]\nType 'help' to view available system commands.",
      isTyping: false,
    },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when terminal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Global toggle key: ~ or `
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, onOpen]);

  // Scroll to bottom on log changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Typewriter Engine: Progressively reveals text character by character
  const triggerTypewriter = useCallback((logId: string, fullText: string) => {
    let currentIdx = 0;
    const speed = 12; // ms per char

    const interval = setInterval(() => {
      currentIdx++;
      setLogs((prev) =>
        prev.map((log) =>
          log.id === logId
            ? {
                ...log,
                renderedText: fullText.slice(0, currentIdx),
                isTyping: currentIdx < fullText.length,
              }
            : log
        )
      );

      if (currentIdx >= fullText.length) {
        clearInterval(interval);
      }
    }, speed);
  }, []);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setHistory((prev) => [...prev, trimmed]);
    setHistoryIdx(-1);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();

    const newId = Math.random().toString();
    let textResponse = "";

    switch (command) {
      case "help":
        textResponse =
          "AVAILABLE SYSTEM COMMANDS:\n" +
          "• about       - System identity & background\n" +
          "• skills      - List all loaded dependency packages\n" +
          "• projects    - List all running software services\n" +
          "• jpmc        - Inspect JPMorgan Chase production incident\n" +
          "• contact     - Show endpoint connection credentials\n" +
          "• clear       - Clear terminal output buffer\n" +
          "• exit        - Close terminal shell";
        break;

      case "about":
        textResponse =
          "K. Suman Patra — Backend Software Engineer\n" +
          "B.Tech IT Student at VSSUT Burla (CGPA 9.36).\n" +
          "Previous SWE Intern at JPMorgan Chase & Co. (Wealth Management Resilience).\n" +
          "\"I build the parts of software you don't see until they break.\"";
        break;

      case "skills":
        textResponse =
          `LOADED SYSTEM DEPENDENCIES (${skills.length}):\n` +
          skills.map((s) => `[${s.category}] ${s.label}`).join("  •  ");
        break;

      case "projects":
        textResponse =
          "RUNNING SOFTWARE PACKAGES:\n" +
          projects.map((p) => `→ ${p.name}: ${p.summary}`).join("\n");
        break;

      case "jpmc":
        textResponse =
          "INCIDENT REPORT: JPMC Retry-Replay Reliability\n" +
          "System: Consumer & Community Banking / Wealth Management\n" +
          "Engineered custom retry-replay microservice logic, Splunk anomaly dashboards, and Control-M workflow resilience.";
        break;

      case "contact":
        textResponse =
          "ENDPOINT CONTACT DATA:\n" +
          "Email:    your.email@example.com\n" +
          "GitHub:   github.com/your-username\n" +
          "LinkedIn: linkedin.com/in/your-profile\n" +
          "Resume:   /resume.pdf";
        break;

      case "clear":
        setLogs([]);
        setInputVal("");
        return;

      case "exit":
        onClose();
        setInputVal("");
        return;

      default:
        textResponse = `Unknown command: "${command}". Type 'help' for available commands.`;
        break;
    }

    setLogs((prev) => [
      ...prev,
      {
        id: newId,
        command: trimmed,
        rawText: textResponse,
        renderedText: "",
        isTyping: true,
      },
    ]);

    setInputVal("");
    triggerTypewriter(newId, textResponse);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = historyIdx + 1 < history.length ? historyIdx + 1 : historyIdx;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[history.length - 1 - nextIdx] || "");
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  return (
    <>
      {/* ── Prominent Floating Dock Trigger (Bottom-Right) ── */}
      <div className="fixed bottom-6 right-6 z-[9990]">
        <button
          onClick={onOpen}
          className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-bg-surface/95 border border-border-accent hover:border-accent-primary text-text-primary hover:text-accent-primary shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer font-mono text-xs font-bold"
          title="Open Embedded Terminal (Press ~)"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-pulse shadow-[0_0_8px_var(--accent-primary)]" />
          <TerminalIcon className="w-4 h-4 text-accent-primary" />
          <span>&gt;_ CLI Terminal</span>
          <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-bg-elevated text-[10px] text-text-secondary border border-border-subtle group-hover:text-accent-primary">
            ~
          </span>
        </button>
      </div>

      {/* ── Unified Seamless Terminal Modal (No inner dividing borders) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[10005] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="w-full max-w-2xl bg-bg-surface/98 border border-border-accent rounded-lg shadow-2xl overflow-hidden font-mono flex flex-col max-h-[85vh] backdrop-blur-xl"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Unified Terminal Header (No bottom border, seamless) */}
              <div className="flex items-center justify-between px-6 pt-5 pb-2 text-xs">
                <div className="flex items-center gap-2.5">
                  <TerminalIcon className="w-4 h-4 text-accent-primary" />
                  <span className="font-bold text-text-primary font-display text-sm tracking-wide">
                    HUMAN.EXE // Interactive Shell
                  </span>
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-accent-primary/10 text-accent-primary border border-border-accent font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary p-1.5 rounded-full hover:bg-bg-elevated transition-colors cursor-pointer"
                  title="Close Terminal (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Terminal Body (Scroll isolated to console output) */}
              <div
                ref={scrollRef}
                className="px-6 py-3 flex-1 overflow-y-auto space-y-4 text-xs md:text-sm min-h-[300px] leading-relaxed [overscroll-behavior:contain]"
                tabIndex={0}
                onWheel={(e) => e.stopPropagation()}
              >
                {logs.map((log) => (
                  <div key={log.id} className="space-y-1">
                    {log.command && (
                      <div className="flex items-center gap-2 text-accent-primary font-bold">
                        <span>&gt;</span>
                        <span className="text-text-primary">{log.command}</span>
                      </div>
                    )}
                    <pre className="pl-4 text-text-secondary font-mono whitespace-pre-wrap leading-relaxed">
                      {log.renderedText || log.rawText}
                      {log.isTyping && (
                        <span className="text-accent-primary font-bold animate-pulse">█</span>
                      )}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Unified Terminal Input Bar (No top border, seamless one-piece layout) */}
              <div className="flex items-center gap-2 px-6 pb-5 pt-2">
                <span className="text-accent-primary font-bold text-sm">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type 'help', 'about', 'skills', 'jpmc', 'contact'..."
                  className="w-full bg-transparent border-none outline-none text-text-primary text-xs font-mono placeholder:text-neutral-bright"
                />
                <button
                  onClick={() => handleCommand(inputVal)}
                  className="p-1.5 rounded hover:bg-bg-elevated text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
                  title="Execute"
                >
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
