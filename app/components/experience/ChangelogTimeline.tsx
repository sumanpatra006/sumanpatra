"use client";

import { motion } from "framer-motion";
import { useInView } from "@/app/hooks/useInView";
import { SectionContainer } from "@/app/components/SectionContainer";
import { GitCommitGraph } from "./GitCommitGraph";

export function ChangelogTimeline() {
  const [sectionRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <SectionContainer id="experience">
      <div ref={sectionRef}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-primary text-xs font-mono">04 //</span>
          <motion.h2
            className="font-display text-text-primary text-lg md:text-xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            KERNEL EVOLUTION LOG (GIT COMMIT TREE)
          </motion.h2>
        </div>

        <motion.p
          className="text-text-secondary text-sm mb-10 font-mono max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          The system version changelog — tracing every production release, hackathon milestone, and architecture upgrade from v1.0 to HEAD.
        </motion.p>

        {/* Reimagined Git Commit Graph */}
        <GitCommitGraph isVisible={isInView} />
      </div>
    </SectionContainer>
  );
}
