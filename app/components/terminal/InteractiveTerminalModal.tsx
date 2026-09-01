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
          "• about        - Identity, background & focus\n" +
          "• education    - Academic credentials & coursework\n" +
          "• experience   - Internships & production engineering logs\n" +
          "• skills       - Loaded dependency packages & tech stack\n" +
          "• projects     - Software packages & case studies\n" +
          "• jpmc         - JPMorgan Chase internship & reliability engine\n" +
          "• achievements - Hackathon wins & campus leadership\n" +
          "• contact      - Endpoint connection credentials\n" +
          "• clear        - Clear terminal output buffer\n" +
          "• exit         - Close terminal shell";
        break;

      case "about":
        textResponse =
          "K. Suman Patra — Backend-leaning Software Engineer\n" +
          "Location:    Berhampur, Odisha, India\n" +
          "Education:   B.Tech IT @ VSSUT Burla (CGPA 9.36)\n" +
          "Experience:  SWE Intern @ JPMorgan Chase (Wealth Management), Backend Intern @ GramIQ\n" +
          "Philosophy:  \"I build the parts of software you don't see until they break.\"";
        break;

      case "education":
        textResponse =
          "ACADEMIC CREDENTIALS:\n" +
          "• Institution: Veer Surendra Sai University of Technology (VSSUT), Burla\n" +
          "• Degree:      Bachelor of Technology (B.Tech) in Information Technology (08.2023 – Ongoing)\n" +
          "• CGPA:        9.36\n" +
          "• Coursework:  Data Structures & Algorithms, Computer Networks, Operating Systems, DBMS, OOP, Software Engineering";
        break;

      case "experience":
        textResponse =
          "PRODUCTION EXPERIENCE:\n" +
          "1. Software Engineering Intern @ JPMorgan Chase & Co. (05.2026 – 07.2026 | Bengaluru)\n" +
          "   → Wealth Management: Retry-replay engine, DB transaction tracking, Spring Boot, Control-M, Splunk, Jenkins\n" +
          "2. Backend Development Intern @ GramIQ (06.2025 – 09.2025 | Remote)\n" +
          "   → 21+ REST APIs, RBAC auth, Prisma ORM schema design, Redis session caching under high concurrency";
        break;

      case "skills":
        textResponse =
          `LOADED SYSTEM DEPENDENCIES (${skills.length}):\n` +
          skills.map((s) => `[${s.category}] ${s.label}`).join("  •  ");
        break;

      case "projects":
        textResponse =
          "RUNNING SOFTWARE PACKAGES:\n" +
          projects.map((p) => `→ ${p.name}: ${p.summary}`).join("\n\n");
        break;

      case "jpmc":
        textResponse =
          "JPMORGAN CHASE & CO. — SWE INTERNSHIP & CODE FOR GOOD:\n" +
          "• Team: Consumer & Community Banking (Wealth Management) | Bengaluru\n" +
          "• Retry-Replay Engine: DB-backed status tracking to auto-recover failed asset transfers.\n" +
          "• Splunk Telemetry: Built real-time error monitoring across 2 Java/Spring Boot microservices.\n" +
          "• Cloud Batch: Control-M job orchestration on private cloud with Jenkins CI/CD.\n" +
          "• Hackathon Win: Led team of 7 to 1st place among 60,000+ applicants at JPMC Code For Good.";
        break;

      case "achievements":
      case "leadership":
        textResponse =
          "ACHIEVEMENTS & LEADERSHIP:\n" +
          "• JPMC Code For Good Hackathon: Team Lead (7 engineers), 1st Position among 60,000+ applicants.\n" +
          "• Google Developer Groups on Campus: Organizer / Lead for campus tech events & hackathons.\n" +
          "• AWS Cloud Club: Core Team Member organizing cloud architecture sessions.\n" +
          "• Enigma, VSSUT: Built official college fest and technical club websites.";
        break;

      case "contact":
        textResponse =
          "ENDPOINT CONTACT CREDENTIALS:\n" +
          "• Name:     K. Suman Patra\n" +
          "• Email:    ksumanpatra06@gmail.com\n" +
          "• Phone:    +91-7855925132\n" +
          "• Location: Berhampur, Odisha, India\n" +
          "• LinkedIn: linkedin.com/in/ksumanpatra\n" +
          "• GitHub:   github.com/sumanpatra006\n" +
          "• Resume:   /resume.pdf";
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
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[9990]">
        <button
          onClick={onOpen}
          className="group flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 rounded-full bg-bg-surface/95 border border-border-accent hover:border-accent-primary text-text-primary hover:text-accent-primary shadow-2xl backdrop-blur-md transition-all duration-300 cursor-pointer font-mono text-[11px] sm:text-xs font-bold"
          title="Open Embedded Terminal (Press ~)"
        >
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-accent-primary animate-pulse shadow-[0_0_8px_var(--accent-primary)]" />
          <TerminalIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-primary" />
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
            className="fixed inset-0 z-[10005] flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="w-full max-w-2xl bg-bg-surface/98 border border-border-accent rounded-lg shadow-2xl overflow-hidden font-mono flex flex-col max-h-[88vh] sm:max-h-[85vh] backdrop-blur-xl"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Unified Terminal Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 pt-3.5 sm:pt-5 pb-2 text-xs">
                <div className="flex items-center gap-2 sm:gap-2.5">
                  <TerminalIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent-primary" />
                  <span className="font-bold text-text-primary font-display text-xs sm:text-sm tracking-wide">
                    HUMAN.EXE // Shell
                  </span>
                  <span className="px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] rounded-full bg-accent-primary/10 text-accent-primary border border-border-accent font-mono font-bold">
                    ONLINE
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="text-text-secondary hover:text-text-primary p-1 sm:p-1.5 rounded-full hover:bg-bg-elevated transition-colors cursor-pointer"
                  title="Close Terminal (ESC)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Terminal Body */}
              <div
                ref={scrollRef}
                className="px-4 sm:px-6 py-2.5 sm:py-3 flex-1 overflow-y-auto space-y-3 sm:space-y-4 text-[11px] sm:text-xs md:text-sm min-h-[260px] sm:min-h-[300px] leading-relaxed [overscroll-behavior:contain]"
                tabIndex={0}
                onWheel={(e) => e.stopPropagation()}
              >
                {logs.map((log) => (
                  <div key={log.id} className="space-y-1">
                    {log.command && (
                      <div className="flex items-center gap-1.5 sm:gap-2 text-accent-primary font-bold">
                        <span>&gt;</span>
                        <span className="text-text-primary">{log.command}</span>
                      </div>
                    )}
                    <pre className="pl-3 sm:pl-4 text-text-secondary font-mono whitespace-pre-wrap leading-relaxed text-[11px] sm:text-xs md:text-sm">
                      {log.renderedText || log.rawText}
                      {log.isTyping && (
                        <span className="text-accent-primary font-bold animate-pulse">█</span>
                      )}
                    </pre>
                  </div>
                ))}
              </div>

              {/* Unified Terminal Input Bar */}
              <div className="flex items-center gap-2 px-4 sm:px-6 pb-3.5 sm:pb-5 pt-2 border-t border-border-subtle/40">
                <span className="text-accent-primary font-bold text-xs sm:text-sm">&gt;</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="type 'help', 'about', 'skills', 'jpmc', 'contact'..."
                  className="w-full bg-transparent border-none outline-none text-text-primary text-[11px] sm:text-xs font-mono placeholder:text-neutral-bright"
                />
                <button
                  onClick={() => handleCommand(inputVal)}
                  className="p-1 sm:p-1.5 rounded hover:bg-bg-elevated text-text-secondary hover:text-accent-primary transition-colors cursor-pointer"
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
