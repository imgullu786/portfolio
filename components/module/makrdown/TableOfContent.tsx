"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import GithubSlugger from "github-slugger";
import { ArrowUp } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

function extractHeadings(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = slugger.slug(text);
    headings.push({ id, text, level });
  }

  return headings;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [scrollPercent, setScrollPercent] = useState(0);
  const headings = useMemo(() => extractHeadings(content), [content]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track scroll percentage based on article content only
  useEffect(() => {
    const handleScroll = () => {
      // Find the prose/article content element
      const articleElement = document.querySelector(".prose");

      if (articleElement) {
        const rect = articleElement.getBoundingClientRect();
        const articleTop = window.scrollY + rect.top;
        const articleHeight = rect.height;
        const scrollTop = window.scrollY;
        const viewportHeight = window.innerHeight;

        // Calculate progress through the article
        const startOffset = articleTop - viewportHeight * 0.2; // Start when article is 20% into viewport
        const endOffset = articleTop + articleHeight - viewportHeight * 0.8; // End when 80% through

        let percent = 0;
        if (scrollTop >= endOffset) {
          percent = 100;
        } else if (scrollTop > startOffset) {
          percent = Math.round(
            ((scrollTop - startOffset) / (endOffset - startOffset)) * 100,
          );
        }

        setScrollPercent(Math.min(100, Math.max(0, percent)));
      } else {
        // Fallback to document-based calculation
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const percent =
          docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
        setScrollPercent(percent);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-80px 0px -80% 0px",
      threshold: 0,
    });

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [headings]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className={cn("space-y-3", className)}>
      {/* Scroll Progress & Back to Top */}
      <div className="flex items-center justify-between">
        <p className="font-semibold text-[13px] uppercase tracking-wide">
          Table of Contents
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {scrollPercent}%
          </span>
          <button
            onClick={scrollToTop}
            className="p-1 rounded hover:bg-muted transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <ul className="space-y-0.5 border-l-2 border-muted">
        {headings.map((heading, index) => (
          <li key={`${heading.id}-${index}`}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => handleClick(e, heading.id)}
              className={cn(
                "block py-0.5 text-sm transition-all duration-200 ease-in-out border-l-2 -ml-[2px]",
                activeId === heading.id
                  ? "text-sky-400 font-medium border-sky-400 pl-3"
                  : "text-muted-foreground hover:text-foreground border-transparent pl-3 hover:border-muted-foreground/50",
              )}
              style={{ paddingLeft: `${12 + (heading.level - 2) * 12}px` }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
