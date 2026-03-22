"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, Heart, Loader2, Search } from "lucide-react";
import { motion } from "framer-motion";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  readingTime: number | null;
  views: number;
  publishedAt: Date | null;
  updatedAt: Date;
  tags: string[];
}

interface TagData {
  name: string;
  count: number;
}

type SortMode = "latest" | "oldest";

interface BlogContentProps {
  initialBlogs: Blog[];
  tags: TagData[];
  selectedTag?: string;
  hasMore: boolean;
  nextCursor?: string;
  totalCount?: number;
}

function formatRelativeDate(date: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  }

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function wasEdited(blog: Blog): boolean {
  if (!blog.publishedAt) return false;
  const published = new Date(blog.publishedAt).getTime();
  const updated = new Date(blog.updatedAt).getTime();
  // Consider edited if updated more than 1 minute after publishing
  return updated - published > 60000;
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

export function BlogContent({
  initialBlogs,
  tags,
  selectedTag,
  hasMore: initialHasMore,
  nextCursor: initialNextCursor,
  totalCount = 0,
}: BlogContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setBlogs(initialBlogs);
    setHasMore(initialHasMore);
    setNextCursor(initialNextCursor);
  }, [initialBlogs, initialHasMore, initialNextCursor, selectedTag]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || !nextCursor) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("cursor", nextCursor);
      params.set("sort", sortMode);
      if (selectedTag) {
        params.set("tag", selectedTag);
      }

      const res = await fetch(`/api/blogs?${params.toString()}`);
      const data = await res.json();

      setBlogs((prev) => [...prev, ...data.items]);
      setHasMore(data.hasMore);
      setNextCursor(data.nextCursor);
    } catch (error) {
      console.error("Failed to load more blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, nextCursor, selectedTag, sortMode]);

  // Re-fetch when sort mode changes
  useEffect(() => {
    const fetchSorted = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("sort", sortMode);
        params.set("limit", "20");
        if (selectedTag) {
          params.set("tag", selectedTag);
        }

        const res = await fetch(`/api/blogs?${params.toString()}`);
        const data = await res.json();

        setBlogs(data.items);
        setHasMore(data.hasMore);
        setNextCursor(data.nextCursor);
      } catch (error) {
        console.error("Failed to fetch sorted blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Only re-fetch if sort changed (skip initial render)
    if (sortMode !== "latest") {
      fetchSorted();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortMode]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observerRef.current.observe(sentinelRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);

  const handleTagClick = (tagName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagName === selectedTag) {
      params.delete("tag");
    } else {
      params.set("tag", tagName);
    }
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  const clearTag = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tag");
    router.push(`/blog?${params.toString()}`, { scroll: false });
  };

  // Filter blogs locally by search query
  const filteredBlogs = searchQuery
    ? blogs.filter(
        (b) =>
          b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (b.excerpt &&
            b.excerpt.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    : blogs;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase mb-2">
          Blog
        </p>
        <h1 className="text-4xl font-bold mb-3">Posts</h1>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {totalCount} posts
            {selectedTag && (
              <span>
                {" "}
                tagged with{" "}
                <button
                  onClick={clearTag}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  #{selectedTag} ×
                </button>
              </span>
            )}
          </span>

          {/* Sort Tabs */}
          <div className="flex items-center gap-3 text-sm">
            {(["latest", "oldest"] as SortMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={`transition-colors duration-200 capitalize ${
                  sortMode === mode
                    ? "text-foreground underline underline-offset-4 decoration-foreground/50"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">
        {/* Blog List */}
        <div>
          {filteredBlogs.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key={sortMode + (selectedTag || "")}
            >
              {filteredBlogs.map((blog) => {
                const blogUrl = `/blog/${blog.slug}`;

                return (
                  <motion.div key={blog.id} variants={itemVariants}>
                    <Link href={blogUrl} className="block">
                      <article className="blog-item relative px-5 py-4 -mx-5 rounded-xl cursor-pointer">
                        {/* Title */}
                        <h2 className="text-[15px] font-semibold text-foreground leading-snug mb-1.5">
                          {blog.title}
                        </h2>

                        {/* Excerpt */}
                        {blog.excerpt && (
                          <p className="text-sm text-muted-foreground/70 line-clamp-1 mb-2.5">
                            {blog.excerpt}
                          </p>
                        )}

                        {/* Meta Row */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground/50 flex-wrap">
                          <span>{formatRelativeDate(blog.publishedAt)}</span>

                          {wasEdited(blog) && (
                            <span className="text-muted-foreground/40">
                              (edited)
                            </span>
                          )}

                          {blog.tags.length > 0 && (
                            <>
                              <span className="text-muted-foreground/30">
                                ·
                              </span>
                              {blog.tags.slice(0, 2).map((tag, i) => (
                                <span key={tag}>
                                  <span className="text-muted-foreground/60 hover:text-foreground transition-colors">
                                    {tag}
                                  </span>
                                  {i < Math.min(blog.tags.length, 2) - 1 && (
                                    <span className="text-muted-foreground/30 mx-1">
                                      /
                                    </span>
                                  )}
                                </span>
                              ))}
                            </>
                          )}

                          <span className="ml-auto flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {blog.views.toLocaleString()}
                            </span>
                          </span>
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
                {selectedTag
                  ? "No posts with this tag yet."
                  : searchQuery
                    ? "No posts match your search."
                    : "No blog posts yet. Check back soon!"}
              </p>
            </div>
          )}

          {/* Infinite scroll sentinel */}
          <div
            ref={sentinelRef}
            className="h-10 flex items-center justify-center mt-4"
          >
            {isLoading && (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50 rounded-lg text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-600 transition-all"
              />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 12).map((tag) => (
                  <button
                    key={tag.name}
                    onClick={() => handleTagClick(tag.name)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border transition-all duration-200 ${
                      selectedTag === tag.name
                        ? "bg-foreground text-background border-foreground"
                        : "bg-transparent border-zinc-300 dark:border-zinc-700 text-muted-foreground hover:text-foreground hover:border-zinc-400 dark:hover:border-zinc-500"
                    }`}
                  >
                    {tag.name}
                    <span className="text-muted-foreground/40">
                      ({tag.count})
                    </span>
                  </button>
                ))}
              </div>
            )}

            {tags.length > 12 && (
              <Link
                href="/archive/blog"
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
              >
                All tags
              </Link>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
