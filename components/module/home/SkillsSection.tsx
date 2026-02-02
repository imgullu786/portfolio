"use client";

import { motion } from "framer-motion";
import { item } from "./Animations";
import { skills } from "./PersonalData";
import { Section } from "./Section";

export function SkillsSection() {
  const skillCategories = [...new Set(skills.map((s) => s.category))];

  return (
    <motion.section variants={item}>
      <Section title="Skills">
        <div className="space-y-5">
          {skillCategories.map((category) => (
            <div
              key={category}
              className="flex flex-col md:flex-row md:items-start gap-3"
            >
              <h3 className="text-sm text-foreground md:w-32 shrink-0">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <span
                      key={skill.name}
                      className="px-3 py-1 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-sky-400 hover:border-sky-400/50 transition-all cursor-default"
                    >
                      {skill.name}
                    </span>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
    </motion.section>
  );
}
