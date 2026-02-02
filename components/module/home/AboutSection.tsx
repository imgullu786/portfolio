"use client";

import { motion } from "framer-motion";
import { item } from "./Animations";
import { personalInfo } from "./PersonalData";
import { Section } from "./Section";

export function AboutSection() {
  return (
    <motion.section variants={item}>
      <Section title="About">
        <div className="space-y-4">
          {/* Roles */}
          <p className="text-muted-foreground">
            {personalInfo.roles.map((role, i) => (
              <span key={role}>
                {role}
                {i < personalInfo.roles.length - 1 && " | "}
              </span>
            ))}
          </p>

          {/* Bio */}
          <p className="text-muted-foreground leading-relaxed">
            {personalInfo.bio}
          </p>
        </div>
      </Section>
    </motion.section>
  );
}
