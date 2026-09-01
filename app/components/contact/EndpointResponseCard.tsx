"use client";

import { motion } from "framer-motion";
import { useInView } from "@/app/hooks/useInView";
import { SectionContainer } from "@/app/components/SectionContainer";
import { Mail, Globe, Code2, FileText, Activity, Phone, MapPin, GraduationCap } from "lucide-react";
import { ContactMailerForm } from "./ContactMailerForm";

const contactData = [
  {
    key: "email",
    value: "ksumanpatra06@gmail.com",
    href: "mailto:ksumanpatra06@gmail.com",
    type: "link" as const,
    icon: Mail,
  },
  {
    key: "phone",
    value: "+91-7855925132",
    href: "tel:+917855925132",
    type: "link" as const,
    icon: Phone,
  },
  {
    key: "location",
    value: "Berhampur, Odisha, India",
    type: "text" as const,
    icon: MapPin,
  },
  {
    key: "education",
    value: "B.Tech in IT (CGPA 9.36) @ VSSUT Burla",
    type: "text" as const,
    icon: GraduationCap,
  },
  {
    key: "linkedin",
    value: "linkedin.com/in/ksumanpatra",
    href: "https://www.linkedin.com/in/ksumanpatra",
    type: "link" as const,
    icon: Globe,
  },
  {
    key: "github",
    value: "github.com/sumanpatra006",
    href: "https://github.com/sumanpatra006",
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
    value: "Open to Full-Time Backend / Platform SWE Roles",
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
            className="font-display text-text-primary text-lg sm:text-xl md:text-2xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            ENDPOINTS &amp; DIRECT TRANSMISSION
          </motion.h2>
        </div>

        <motion.p
          className="text-text-secondary text-xs sm:text-sm mb-6 sm:mb-8 font-mono max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Directly query contact payload links or dispatch a transmission (feedback, project collaboration, recruiter inquiry) straight to Suman&apos;s inbox via Resend.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-stretch">
          {/* Left: GET /contact JSON Response Card */}
          <motion.div
            className="lg:col-span-5 cyber-card rounded-md overflow-hidden flex flex-col justify-between border border-border-subtle hover:border-border-accent shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div>
              <div className="px-4 py-3 sm:px-5 sm:py-3.5 bg-bg-elevated/90 border-b border-border-subtle flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-accent-primary/20 text-accent-primary font-bold border border-border-accent text-[10px] sm:text-[11px]">
                    GET 200 OK
                  </span>
                  <span className="text-text-secondary font-medium text-[11px] sm:text-xs">/api/v1/contact</span>
                </div>
                <span className="text-neutral-bright text-[9px] sm:text-[10px]">14ms latency</span>
              </div>

              <div className="p-4 sm:p-5 md:p-6 font-mono text-[11px] sm:text-xs md:text-sm">
                <span className="text-neutral-bright">{"{"}</span>
                <div className="pl-4 space-y-3.5 my-3.5">
                  {contactData.map((item, i) => {
                    const IconComponent = item.icon;
                    return (
                      <div key={item.key} className="flex items-center gap-2 flex-wrap">
                        <IconComponent className="w-4 h-4 text-accent-primary flex-shrink-0" />
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
                            className="text-accent-primary font-bold hover:underline transition-all flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-accent-primary/10 border border-border-accent"
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
            </div>

            {/* Sub-dock status banner */}
            <div className="px-5 py-3 bg-bg-secondary/60 border-t border-border-subtle text-[11px] font-mono text-neutral-bright flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
                ENDPOINT ACTIVE
              </span>
              <span className="text-accent-primary">TLS 1.3 ENCRYPTED</span>
            </div>
          </motion.div>

          {/* Right: Interactive POST /contact/send Resend Mailer Form */}
          <motion.div
            className="lg:col-span-7 flex flex-col"
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
