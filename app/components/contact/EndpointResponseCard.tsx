"use client";

import { motion } from "framer-motion";
import { useInView } from "@/app/hooks/useInView";
import { SectionContainer } from "@/app/components/SectionContainer";
import { Mail, Globe, Code2, FileText, Activity } from "lucide-react";
import { ContactMailerForm } from "./ContactMailerForm";

const contactData = [
  {
    key: "email",
    value: "your.email@example.com", // [FILL: actual email]
    href: "mailto:your.email@example.com",
    type: "link" as const,
    icon: Mail,
  },
  {
    key: "linkedin",
    value: "linkedin.com/in/your-profile", // [FILL: actual LinkedIn]
    href: "https://linkedin.com",
    type: "link" as const,
    icon: Globe,
  },
  {
    key: "github",
    value: "github.com/your-username", // [FILL: actual GitHub]
    href: "https://github.com",
    type: "link" as const,
    icon: Code2,
  },
  {
    key: "resume",
    value: "/resume.pdf",
    href: "/resume.pdf",
    type: "download" as const,
    icon: FileText,
  },
  {
    key: "status",
    value: "open to backend/platform SWE roles",
    type: "text" as const,
    icon: Activity,
  },
];

export function EndpointResponseCard() {
  const [sectionRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <SectionContainer id="contact">
      <div ref={sectionRef}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-primary text-xs font-mono">05 //</span>
          <motion.h2
            className="font-display text-text-primary text-xl md:text-2xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            ENDPOINTS &amp; DIRECT TRANSMISSION
          </motion.h2>
        </div>

        <motion.p
          className="text-text-secondary text-sm mb-8 font-mono max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Directly query contact payload links or dispatch a transmission (feedback, project collaboration, recruiter inquiry) straight to Suman&apos;s inbox via Resend.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: GET /contact JSON Response Card */}
          <motion.div
            className="lg:col-span-5 cyber-card rounded-sm overflow-hidden"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="px-5 py-3 bg-bg-elevated/90 border-b border-border-subtle flex items-center justify-between font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <span className="px-2 py-0.5 rounded bg-accent-primary/20 text-accent-primary font-bold border border-border-accent">
                  GET 200 OK
                </span>
                <span className="text-text-secondary">/api/v1/contact</span>
              </div>
              <span className="text-neutral-bright text-[10px]">14ms</span>
            </div>

            <div className="p-5 md:p-6 font-mono text-xs md:text-sm">
              <span className="text-neutral-bright">{"{"}</span>
              <div className="pl-4 space-y-3 my-3">
                {contactData.map((item, i) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={item.key} className="flex items-center gap-2 flex-wrap">
                      <IconComponent className="w-3.5 h-3.5 text-accent-primary flex-shrink-0" />
                      <span className="text-accent-secondary font-semibold">
                        &quot;{item.key}&quot;
                      </span>
                      <span className="text-neutral-bright">: </span>

                      {item.type === "link" ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-text-primary hover:text-accent-primary transition-colors underline underline-offset-4 decoration-border-subtle hover:decoration-accent-primary break-all"
                        >
                          &quot;{item.value}&quot;
                        </a>
                      ) : item.type === "download" ? (
                        <a
                          href={item.href}
                          download
                          className="text-accent-primary font-bold hover:underline transition-all flex items-center gap-1.5 px-2 py-0.5 rounded bg-accent-primary/10 border border-border-accent"
                        >
                          <span>&quot;{item.value}&quot;</span>
                          <span className="text-[10px] text-text-secondary">(pdf)</span>
                        </a>
                      ) : (
                        <span className="text-accent-primary font-bold">
                          &quot;{item.value}&quot;
                        </span>
                      )}

                      {i < contactData.length - 1 && (
                        <span className="text-neutral-bright">,</span>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="text-neutral-bright">{"}"}</span>
            </div>
          </motion.div>

          {/* Right: Interactive POST /contact/send Resend Mailer Form */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <ContactMailerForm />
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  );
}
