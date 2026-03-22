"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import { cn } from "@/lib/utils";
import { CodeBlockCard } from "./CodeBlockCard";

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
        // Typography — compact, readable
        "prose-p:leading-[1.7] prose-p:my-3",
        "prose-li:leading-[1.7]",
        "prose-headings:scroll-mt-24 prose-headings:font-semibold",
        "prose-h2:mt-8 prose-h2:mb-3 prose-h3:mt-6 prose-h3:mb-2",
        // Links
        "prose-a:text-primary prose-a:no-underline prose-a:border-b prose-a:border-primary/30 hover:prose-a:border-primary",
        // Inline code
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-code:bg-muted prose-code:text-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[0.85em]",
        // Pre — reset since we style via CodeBlockCard
        "prose-pre:bg-transparent prose-pre:p-0 prose-pre:border-0 prose-pre:m-0",
        // Blockquote
        "prose-blockquote:border-l-2 prose-blockquote:border-primary/30 prose-blockquote:not-italic prose-blockquote:text-muted-foreground",
        // HR
        "prose-hr:border-border/50 prose-hr:my-6",
        // Images
        "prose-img:rounded-xl prose-img:shadow-md prose-img:border prose-img:border-border/30 prose-img:my-4",
        className,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeSlug]}
        components={{
          pre: ({ children, ...props }) => {
            let language: string | undefined;
            if (
              children &&
              typeof children === "object" &&
              "props" in (children as any)
            ) {
              const codeProps = (children as any).props;
              const codeClassName = codeProps?.className || "";
              const match = codeClassName.match(/language-(\w+)/);
              if (match) language = match[1];
            }

            return (
              <CodeBlockCard language={language}>
                <pre
                  {...props}
                  className="!bg-transparent !m-0 !py-0 !px-4 !border-0 !text-[14px] !leading-[1.7]"
                >
                  {children}
                </pre>
              </CodeBlockCard>
            );
          },
          code: ({ children, className: codeClassName, node, ...props }) => {
            // Block code (inside pre) — check if parent is pre
            const isBlock =
              node?.position && codeClassName?.includes("language-");
            if (isBlock || (node as any)?.tagName === "code") {
              // If inside a CodeBlockCard pre, render with proper block styling
              // Check if this code has a language class (it's a block code)
              if (codeClassName) {
                return (
                  <code
                    {...props}
                    className={cn(
                      codeClassName,
                      "!bg-transparent !p-0 block !text-[14px] !leading-[1.7]",
                    )}
                  >
                    {children}
                  </code>
                );
              }
            }
            // Inline code — no special treatment
            return (
              <code {...props} className={codeClassName}>
                {children}
              </code>
            );
          },
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
