"use client";

import { motion } from "framer-motion";
import { useInView } from "@/app/hooks/useInView";
import { SectionContainer } from "@/app/components/SectionContainer";
import { ForceGraphEngine } from "./ForceGraphEngine";

export function SkillGraph() {
  const [sectionRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.1 });

  return (
    <SectionContainer id="skills" wide>
      <div ref={sectionRef}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-primary text-xs font-mono">02 //</span>
          <motion.h2
            className="font-display text-text-primary text-lg md:text-xl font-bold tracking-wide"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
          >
            DEPENDENCIES LOADED
          </motion.h2>
        </div>

        <motion.p
          className="text-text-secondary text-sm mb-6 font-mono max-w-2xl"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          Dynamic force-directed dependency network. Repels overlap automatically via physics — drag any node to reorganize or hover to view project relations.
        </motion.p>

        {/* Dynamic D3 Force Engine */}
        <ForceGraphEngine />
      </div>
    </SectionContainer>
  );
}
