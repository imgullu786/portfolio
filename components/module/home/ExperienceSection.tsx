"use client";

import { motion } from "framer-motion";
import { item } from "./Animations";
import { experience } from "./PersonalData";
import { Section } from "./Section";

export function ExperienceSection() {
  return (
    <motion.section variants={item}>
      <Section title="Experience">
        <div className="space-y-3">
          {experience.map((exp, index) => (
            <div key={index} className="block group">
              <div className="relative p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200">
                {/* Background on hover */}
                <div className="absolute inset-0 rounded-xl bg-zinc-100/50 dark:bg-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[-1]" />

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-sky-400 transition-colors duration-200">
                      {exp.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {exp.company}
                    </p>
                    <p className="text-muted-foreground/70 text-sm mt-1">
                      {exp.description}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground shrink-0">
                    {exp.period}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </motion.section>
  );
}
