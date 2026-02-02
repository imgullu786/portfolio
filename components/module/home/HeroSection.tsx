"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Linkedin, Mail, MapPin } from "lucide-react";
import { item } from "./Animations";
import { personalInfo } from "./PersonalData";

export function HeroSection() {
  return (
    <motion.section variants={item} className="text-center">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 p-0.5">
          <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
            <img src={personalInfo.avatarUrl} alt="Avatar" />
          </div>
        </div>
      </div>

      {/* Name */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
        {personalInfo.name}
      </h1>

      {/* Location & Social Links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4" />
          {personalInfo.location}
        </span>
        <Link
          href={personalInfo.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Link>
        <Link
          href={personalInfo.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Linkedin className="h-4 w-4" />
          LinkedIn
        </Link>
        <Link
          href={`mailto:${personalInfo.mail}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground transition-colors"
        >
          <Mail className="h-4 w-4" />
          Mail
        </Link>
      </div>
    </motion.section>
  );
}
