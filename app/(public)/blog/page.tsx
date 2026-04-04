import { Suspense } from "react";
import { getPaginatedBlogs, getAllTags } from "@/actions/blogs";
import { BlogContent } from "@/components/module/blog/BlogContent";

export const metadata = {
  title: "Blog",
  description:
    "Thoughts, tutorials, and insights on web development, software engineering, and technology.",
  openGraph: {
    title: "Blog",
    description:
      "Thoughts, tutorials, and insights on web development, software engineering, and technology.",
    type: "website" as const,
  },
};

interface BlogPageProps {
  searchParams: Promise<{ tag?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { tag } = await searchParams;
  const [blogData, tags] = await Promise.all([
    getPaginatedBlogs({
      published: true,
      tag: tag,
      limit: 20,
    }),
    getAllTags(),
  ]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto pt-8">
        <Suspense fallback={<BlogContentSkeleton />}>
          <BlogContent
            initialBlogs={blogData.items}
            tags={tags}
            selectedTag={tag}
            hasMore={blogData.hasMore}
            nextCursor={blogData.nextCursor}
            totalCount={blogData.totalCount}
          />
        </Suspense>
      </div>
    </div>
  );
}

function BlogContentSkeleton() {
  return (
    <div>
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="h-3 w-12 bg-muted rounded animate-pulse mb-3" />
        <div className="h-9 w-24 bg-muted rounded animate-pulse mb-3" />
        <div className="flex justify-between">
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
          <div className="flex gap-3">
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
            <div className="h-4 w-12 bg-muted rounded animate-pulse" />
            <div className="h-4 w-28 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Post list skeleton */}
        <div className="space-y-1">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="py-4 px-5 -mx-5">
              <div className="h-5 w-3/4 bg-muted rounded animate-pulse mb-2" />
              <div className="h-4 w-full bg-muted rounded animate-pulse mb-2.5" />
              <div className="flex gap-3">
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                <div className="h-3 w-12 bg-muted rounded animate-pulse ml-auto" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div className="hidden lg:block space-y-6">
          <div className="h-9 w-full bg-muted rounded-lg animate-pulse" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="h-7 rounded-full bg-muted animate-pulse"
                style={{ width: `${60 + Math.random() * 40}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
