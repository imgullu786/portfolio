import { notFound } from "next/navigation";
import { getBlogBySlug, incrementBlogViews } from "@/actions/blogs";
import { MarkdownRenderer } from "@/components/module/makrdown/MarkdownRenderer";
import { SideRailLines } from "@/components/module/makrdown/SideRailLines";
import { Eye, Clock } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return { title: "Not Found" };
  }

  const description = blog.excerpt || `Read "${blog.title}" on the blog.`;

  return {
    title: blog.title,
    description,
    keywords: blog.tags.length > 0 ? blog.tags : undefined,
    openGraph: {
      title: blog.title,
      description,
      type: "article" as const,
      publishedTime: blog.publishedAt?.toISOString(),
      modifiedTime: blog.updatedAt?.toISOString(),
      section: blog.tags[0] ?? undefined,
      tags: blog.tags.length > 0 ? blog.tags : undefined,
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

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog || !blog.published) {
    notFound();
  }

  // Increment views and fetch comments
  await incrementBlogViews(blog.id);

  const isEdited =
    blog.publishedAt &&
    blog.updatedAt.getTime() - blog.publishedAt.getTime() > 60000;

  return (
    <>
      {/* Side-rail lines — right edge section indicators */}
      <SideRailLines content={blog.content} />

      <article className="container max-w-[700px] mx-auto px-4 py-8">
        <div className="flex justify-center">
          {/* Centered content — no sidebar */}
          <div className="w-full min-w-0 pt-12 sm:pt-16">
            {/* Title — large serif, left-aligned (Maxime Heckel style) */}
            <header className="mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
                {blog.title}
              </h1>

              {/* Date — monospace, uppercase, muted */}
              {blog.publishedAt && (
                <time
                  dateTime={blog.publishedAt.toISOString()}
                  className="block font-mono text-sm tracking-wider text-muted-foreground/60 mb-3"
                >
                  {formatMonospaceDate(blog.publishedAt)}
                  {isEdited && (
                    <span className="text-muted-foreground/40 ml-2">
                      (edited)
                    </span>
                  )}
                </time>
              )}

              {/* Meta bar */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                {blog.tags.length > 0 && (
                  <>
                    {blog.tags.map((tag, i) => (
                      <span key={tag}>
                        <Link
                          href={`/blog?tag=${encodeURIComponent(tag)}`}
                          className="hover:text-foreground transition-colors"
                        >
                          {tag}
                        </Link>
                        {i < blog.tags.length - 1 && (
                          <span className="text-muted-foreground/30 mx-0.5">
                            /
                          </span>
                        )}
                      </span>
                    ))}
                    <span className="text-muted-foreground/30">·</span>
                  </>
                )}

                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {blog.views.toLocaleString()}
                </span>

                {blog.readingTime && (
                  <>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {blog.readingTime} min
                    </span>
                  </>
                )}
              </div>
            </header>

            {/* Article Content */}
            <MarkdownRenderer content={blog.content} />

            {/* Comments Section */}
            <div className="mt-12">Comment Section - Yet to Implement</div>
          </div>
        </div>
      </article>
    </>
  );
}
