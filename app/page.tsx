"use client";

import { useState, useCallback } from "react";
import { SystemLoader } from "@/app/components/loading/SystemLoader";
import { BootSequence } from "@/app/components/hero/BootSequence";
import { IdentityNodeReveal } from "@/app/components/hero/IdentityNodeReveal";
import { SkillGraph } from "@/app/components/skills/SkillGraph";
import { ProjectPackageCard } from "@/app/components/projects/ProjectPackageCard";
import { ChangelogTimeline } from "@/app/components/experience/ChangelogTimeline";
import { EndpointResponseCard } from "@/app/components/contact/EndpointResponseCard";
import { SystemVersionIndicator } from "@/app/components/navigation/SystemVersionIndicator";
import { InteractiveTerminalModal } from "@/app/components/terminal/InteractiveTerminalModal";
import { SectionContainer } from "@/app/components/SectionContainer";
import { projects } from "@/data/projects";
import { useInView } from "@/app/hooks/useInView";
import { motion } from "framer-motion";

import { CyberFooter } from "@/app/components/navigation/CyberFooter";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true);
  }, []);

  const handleBootComplete = useCallback(() => {
    setBootComplete(true);
  }, []);

  return (
    <>
      {/* ── 1. System Initialization Loading Screen ── */}
      {!loadingComplete && (
        <SystemLoader onComplete={handleLoadingComplete} />
      )}

      {/* ── 2. Main Portfolio Content ── */}
      {loadingComplete && (
        <>
          {/* Version indicator navigation (Desktop Right HUD) */}
          <SystemVersionIndicator />

          {/* Interactive Shell Modal & Floating Dock Trigger */}
          <InteractiveTerminalModal
            isOpen={terminalOpen}
            onOpen={() => setTerminalOpen(true)}
            onClose={() => setTerminalOpen(false)}
          />

          {/* Hero Section: 3D Background Robotic Head & Terminal Boot Reveal */}
          <section
            id="hero"
            className="min-h-screen flex flex-col items-center justify-center relative px-4 sm:px-6 pt-10"
          >
            {!bootComplete ? (
              <BootSequence onComplete={handleBootComplete} />
            ) : (
              <IdentityNodeReveal isVisible={bootComplete} />
            )}
          </section>

          {/* Skills Section: Full-Width D3 Force Network with Data Packets */}
          <SkillGraph />

          {/* Projects Section: Running Packages & JPMC Resilience Incident */}
          <ProjectsSection />

          {/* Experience Section: Kernel Evolution Log (Git Commit Branch Tree) */}
          <ChangelogTimeline />

          {/* Contact Section: GET /api/v1/contact Payload Card */}
          <EndpointResponseCard />

          {/* Futuristic Cyber Telemetry Footer */}
          <CyberFooter onOpenTerminal={() => setTerminalOpen(true)} />
        </>
      )}
    </>
  );
}

function ProjectsSection() {
  const [sectionRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <SectionContainer id="projects">
      <div ref={sectionRef}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-primary text-xs font-mono">03 //</span>
          <motion.h2
            className="font-display text-text-primary text-lg sm:text-xl md:text-2xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            RUNNING PACKAGES &amp; RESILIENCE CASE STUDIES
          </motion.h2>
        </div>

        <motion.p
          className="text-text-secondary text-xs sm:text-sm mb-6 sm:mb-8 font-mono max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Software services and production reliability case studies shipped across the engineering journey. Expand to inspect dependency trees or run interactive incident diagnostics.
        </motion.p>

        <div className="space-y-4">
          {projects.map((project, i) => (
            <ProjectPackageCard
              key={project.id}
              project={project}
              index={i}
              isVisible={isInView}
            />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
