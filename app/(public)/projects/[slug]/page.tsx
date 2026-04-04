import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/actions/projects";
import { MarkdownRenderer } from "@/components/module/makrdown/MarkdownRenderer";
import { SideRailLines } from "@/components/module/makrdown/SideRailLines";
import { Clock, ExternalLink, Github } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return { title: "Not Found" };
  }

  const description = project.description || `View "${project.title}" project.`;

  return {
    title: project.title,
    description,
    keywords: project.techStack.length > 0 ? project.techStack : undefined,
    openGraph: {
      title: project.title,
      description,
      type: "article" as const,
    },
  };
}

function formatMonospaceDate(date: Date): string {
  return date
    .toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    .toUpperCase()
    .replace(",", "");
}

export default async function ProjectPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project || !project.published) {
    notFound();
  }

  return (
    <>
      {/* Side-rail lines — right edge section indicators */}
      {project.content && <SideRailLines content={project.content} />}

      <article className="container max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="w-full min-w-0 pt-12 sm:pt-16">
            {/* Title — left-aligned */}
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                {project.title}
              </h1>

              {/* Date — monospace, uppercase, muted */}
              <time
                dateTime={project.createdAt.toISOString()}
                className="block font-mono text-sm tracking-wider text-muted-foreground/60 mb-3"
              >
                {formatMonospaceDate(project.createdAt)}
              </time>

              {/* Meta bar */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                {project.techStack.length > 0 && (
                  <>
                    {project.techStack.map((tech, i) => (
                      <span key={tech}>
                        <span>{tech}</span>
                        {i < project.techStack.length - 1 && (
                          <span className="text-muted-foreground/30 mx-0.5">
                            /
                          </span>
                        )}
                      </span>
                    ))}
                    <span className="text-muted-foreground/30">·</span>
                  </>
                )}

                {project.readingTime && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {project.readingTime} min
                  </span>
                )}

                {project.liveUrl && (
                  <>
                    <span className="text-muted-foreground/30">·</span>
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Live
                    </Link>
                  </>
                )}

                {project.githubUrl && (
                  <>
                    <span className="text-muted-foreground/30">·</span>
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                    >
                      <Github className="h-3.5 w-3.5" />
                      Source
                    </Link>
                  </>
                )}
              </div>
            </header>

            {/* Article Content */}
            {project.content && (
              <MarkdownRenderer content={project.content} />
            )}
          </div>
        </div>
      </article>
    </>
  );
}
