import { notFound } from "next/navigation";
import { getBlogBySlug, incrementBlogViews } from "@/actions/blogs";
import { MarkdownRenderer } from "@/components/module/makrdown/MarkdownRenderer";
import { TableOfContents } from "@/components/module/makrdown/TableOfContent";
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

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.publishedAt?.toISOString(),
    },
  };
}

function formatFullDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
    <article className="container mx-auto px-4 py-8">
      <div className="flex justify-center gap-10">
        {/* Main Content */}
        <div className="w-full max-w-[850px] min-w-0 pt-12 sm:pt-16">
          {/* Title — large, centered */}
          <header className="mb-10 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-4">
              {blog.title}
            </h1>

            {/* Meta bar — single line like innei.in */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground flex-wrap">
              {blog.publishedAt && (
                <time dateTime={blog.publishedAt.toISOString()}>
                  {formatFullDate(blog.publishedAt)}
                </time>
              )}

              {isEdited && (
                <span className="text-muted-foreground/50">(edited)</span>
              )}

              {blog.tags.length > 0 && (
                <>
                  <span className="text-muted-foreground/30">·</span>
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
                </>
              )}

              <span className="text-muted-foreground/30">·</span>

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

        {/* Right Aside — TOC + Sponsor */}
        <aside className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            <TableOfContents content={blog.content} />
          </div>
        </aside>
      </div>
    </article>
  );
}
