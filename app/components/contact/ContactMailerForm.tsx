"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle2, AlertCircle, Loader2, MessageSquare } from "lucide-react";

type IntentType = "recruiter" | "project" | "feedback" | "general";

const INTENTS: { id: IntentType; label: string; badge: string }[] = [
  { id: "recruiter", label: "Recruiting / Full-time Role", badge: "💼 Career" },
  { id: "project", label: "Project Collaboration", badge: "⚡ Project" },
  { id: "feedback", label: "Feedback & Ideas", badge: "💡 Feedback" },
  { id: "general", label: "General Ping", badge: "📡 Message" },
];

export function ContactMailerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [intent, setIntent] = useState<IntentType>("recruiter");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [statusText, setStatusText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg("Please provide your name, email, and message.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setStatusText("> Encrypting transmission payload...");

    try {
      setTimeout(() => {
        setStatusText("> Routing through Resend mail gateway...");
      }, 500);

      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          intent: INTENTS.find((i) => i.id === intent)?.label || intent,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to dispatch message.");
      }

      setStatus("success");
      setStatusText("> 200 OK — Transmission received directly in Suman's inbox!");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: unknown) {
      console.error(err);
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Network error dispatching transmission.");
    }
  };

  return (
    <div className="cyber-card rounded-md overflow-hidden p-4 sm:p-6 md:p-8 font-mono text-xs md:text-sm border border-border-subtle hover:border-border-accent shadow-lg transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-border-subtle">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-accent-primary flex-shrink-0" />
          <span className="font-display font-bold text-text-primary text-xs sm:text-sm md:text-base tracking-wide">
            POST /api/v1/contact/send
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-accent-secondary/15 text-accent-secondary text-[10px] sm:text-[11px] font-bold border border-accent-secondary/30">
          Direct Resend Mailer
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Intent Selector */}
        <div>
          <label className="block text-text-secondary text-[10px] sm:text-[11px] uppercase tracking-wider mb-2 font-semibold">
            Transmission Purpose / Intent
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
            {INTENTS.map((item) => {
              const isSelected = intent === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIntent(item.id)}
                  className={`px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-md text-left transition-all cursor-pointer text-[11px] sm:text-xs font-semibold flex items-center justify-between ${
                    isSelected
                      ? "bg-bg-elevated text-accent-primary border border-border-accent shadow-[0_0_12px_var(--accent-primary-dim)]"
                      : "bg-bg-primary/80 text-text-secondary border border-border-subtle hover:border-border-accent hover:text-text-primary"
                  }`}
                >
                  <span>{item.badge}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sender Name & Email Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-text-secondary text-[10px] sm:text-[11px] uppercase tracking-wider mb-1 font-semibold">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Turing"
              className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:shadow-[0_0_10px_var(--accent-primary-dim)] rounded-md px-3 py-2 sm:px-3.5 sm:py-2.5 text-text-primary text-xs font-mono outline-none transition-all placeholder:text-neutral-bright/60"
            />
          </div>
          <div>
            <label className="block text-text-secondary text-[10px] sm:text-[11px] uppercase tracking-wider mb-1 font-semibold">
              Your Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@company.com"
              className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:shadow-[0_0_10px_var(--accent-primary-dim)] rounded-md px-3 py-2 sm:px-3.5 sm:py-2.5 text-text-primary text-xs font-mono outline-none transition-all placeholder:text-neutral-bright/60"
            />
          </div>
        </div>

        {/* Message Field */}
        <div>
          <label className="block text-text-secondary text-[10px] sm:text-[11px] uppercase tracking-wider mb-1 font-semibold">
            Message / Feedback / Collaboration Idea
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="Share your feedback, opportunity details, or questions..."
            className="w-full bg-bg-primary border border-border-subtle focus:border-accent-primary focus:shadow-[0_0_10px_var(--accent-primary-dim)] rounded-md p-3 sm:p-3.5 text-text-primary text-xs font-mono outline-none transition-all resize-none leading-relaxed placeholder:text-neutral-bright/60"
          />
        </div>

        {/* Transmission Status Display */}
        <AnimatePresence>
          {status !== "idle" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {status === "sending" && (
                <div className="flex items-center gap-2 text-accent-primary text-[11px] sm:text-xs bg-accent-primary/10 border border-border-accent p-2.5 sm:p-3 rounded-md">
                  <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
                  <span>{statusText}</span>
                </div>
              )}
              {status === "success" && (
                <div className="flex items-center gap-2 text-accent-secondary text-[11px] sm:text-xs bg-accent-secondary/10 border border-accent-secondary/30 p-2.5 sm:p-3 rounded-md shadow-[0_0_12px_var(--accent-secondary-dim)]">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 text-accent-secondary" />
                  <span>{statusText}</span>
                </div>
              )}
              {status === "error" && (
                <div className="flex items-center gap-2 text-accent-error text-[11px] sm:text-xs bg-accent-error/10 border border-accent-error/30 p-2.5 sm:p-3 rounded-md">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dispatch Action Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full py-3 sm:py-3.5 px-4 sm:px-5 rounded-md bg-accent-primary text-bg-primary font-bold text-xs font-mono hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_18px_var(--accent-primary-dim)] disabled:opacity-50"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Packet...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Dispatch Transmission Payload</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
