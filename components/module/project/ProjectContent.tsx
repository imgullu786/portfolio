"use client";

import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";
import { motion } from "framer-motion";

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  liveUrl: string | null;
  githubUrl: string | null;
  techStack: string[];
  featured: boolean;
  readingTime: number | null;
  createdAt: Date;
}

interface ProjectContentProps {
  projects: Project[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export function ProjectContent({ projects }: ProjectContentProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase mb-2">
          Portfolio
        </p>
        <h1 className="text-4xl font-bold mb-3">Projects</h1>
        <span className="text-sm text-muted-foreground">
          {projects.length} projects
        </span>
      </div>

      {/* Project List */}
      {projects.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {projects.map((project) => {
            const projectUrl = `/projects/${project.slug}`;

            return (
              <motion.div key={project.id} variants={itemVariants}>
                <Link href={projectUrl} className="block">
                  <article className="blog-item relative px-5 py-4 -mx-5 rounded-xl cursor-pointer">
                    {/* Title + Links */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <h2 className="text-[15px] font-semibold text-foreground leading-snug">
                        {project.title}
                      </h2>
                      {project.featured && (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-amber-500 dark:text-amber-400">
                          ★
                        </span>
                      )}
                      {project.liveUrl && (
                        <span
                          role="link"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.liveUrl!, "_blank", "noopener,noreferrer");
                          }}
                          className="text-muted-foreground/50 hover:text-[#02AED2] transition-colors cursor-pointer"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </span>
                      )}
                      {project.githubUrl && (
                        <span
                          role="link"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(project.githubUrl!, "_blank", "noopener,noreferrer");
                          }}
                          className="text-muted-foreground/50 hover:text-foreground transition-colors cursor-pointer"
                        >
                          <Github className="h-3 w-3" />
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground/70 line-clamp-1 mb-2.5">
                      {project.description}
                    </p>

                    {/* Meta Row */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground/50 flex-wrap">
                      {project.techStack.length > 0 && (
                        <>
                          {project.techStack.slice(0, 4).map((tech, i) => (
                            <span key={tech}>
                              <span className="text-muted-foreground/60">
                                {tech}
                              </span>
                              {i < Math.min(project.techStack.length, 4) - 1 && (
                                <span className="text-muted-foreground/30 mx-1">
                                  /
                                </span>
                              )}
                            </span>
                          ))}
                          {project.techStack.length > 4 && (
                            <span className="text-muted-foreground/40">
                              +{project.techStack.length - 4}
                            </span>
                          )}
                        </>
                      )}

                      {project.readingTime && (
                        <>
                          <span className="text-muted-foreground/30">·</span>
                          <span>{project.readingTime} min read</span>
                        </>
                      )}
                    </div>
                  </article>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground">
            No projects yet. Check back soon!
          </p>
        </div>
      )}
    </div>
  );
}
