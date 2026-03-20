"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <article
      className={cn(
        "prose prose-sm prose-neutral dark:prose-invert max-w-none",
        "prose-p:leading-relaxed prose-li:leading-relaxed",
        "prose-headings:scroll-mt-20",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:text-sm",
        "prose-pre:bg-muted prose-pre:border prose-pre:text-sm",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
        components={{
          img: ({ node, ...props }) => (
            <span className="block my-8 text-center">
              <img
                {...props}
                className="inline-block rounded-xl shadow-lg border border-border/50 max-h-[500px] max-w-full object-contain"
                loading="lazy"
              />
            </span>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
