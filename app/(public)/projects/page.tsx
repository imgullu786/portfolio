import { Suspense } from "react";
import { getProjects } from "@/actions/projects";
import { ProjectContent } from "@/components/module/project/ProjectContent";

export const metadata = {
  title: "Projects",
  description:
    "A showcase of projects built with modern web technologies.",
  openGraph: {
    title: "Projects",
    description:
      "A showcase of projects built with modern web technologies.",
    type: "website" as const,
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects({ published: true });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto pt-8">
        <Suspense fallback={<ProjectContentSkeleton />}>
          <ProjectContent projects={projects} />
        </Suspense>
      </div>
    </div>
  );
}

function ProjectContentSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-3 w-16 bg-muted rounded animate-pulse mb-3" />
        <div className="h-9 w-28 bg-muted rounded animate-pulse mb-3" />
        <div className="h-4 w-20 bg-muted rounded animate-pulse" />
      </div>

      {/* Project list skeleton */}
      <div className="space-y-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4 px-5 -mx-5">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-muted rounded animate-pulse mb-2.5" />
            <div className="flex gap-3">
              <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              <div className="h-3 w-16 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
