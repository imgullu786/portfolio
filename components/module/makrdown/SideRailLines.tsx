"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import GithubSlugger from "github-slugger";

interface TocItem {
  id: string;
  text: string;
  level: number;
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

export function SideRailLines({ content }: { content: string }) {
  const [activeId, setActiveId] = useState<string>("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const headings = useMemo(() => extractHeadings(content), [content]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length > 0) {
        const sorted = visible.sort(
          (a, b) => a.boundingClientRect.top - b.boundingClientRect.top,
        );
        setActiveId(sorted[0].target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-80px 0px -80% 0px",
      threshold: 0,
    });

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [headings]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setActiveId(id);
    }
  }, []);

  if (headings.length === 0) return null;

  const activeIndex = headings.findIndex((h) => h.id === activeId);

  return (
    <nav
      className={cn(
        "fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end transition-all duration-500",
        isScrolled
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-2 pointer-events-none",
      )}
      aria-label="Section progress"
    >
      {headings.map((heading, index) => {
        const isActive = activeId === heading.id;
        const isPast = activeIndex > index;
        const isHovered = hoveredId === heading.id;

        return (
          <div
            key={`${heading.id}-${index}`}
            className="relative flex items-center"
          >
            {/* Section label — plain text beside the line */}
            <span
              className={cn(
                "absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap text-[12px] transition-all duration-200 pointer-events-none",
                isHovered
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-1",
                isActive
                  ? "text-foreground font-medium"
                  : "text-muted-foreground/70",
              )}
            >
              {heading.text}
            </span>

            {/* Clickable area — tall padding for easy hover, thin visual line inside */}
            <button
              onClick={() => scrollToSection(heading.id)}
              onMouseEnter={() => setHoveredId(heading.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="flex items-center py-2 cursor-pointer"
              aria-label={heading.text}
            >
              <span
                className={cn(
                  "block rounded-full transition-all duration-300 ease-out h-[3px]",
                  isActive
                    ? "w-8 bg-foreground"
                    : isPast
                      ? "w-4 bg-muted-foreground/35 hover:w-6 hover:bg-muted-foreground/60"
                      : "w-4 bg-muted-foreground/12 hover:w-6 hover:bg-muted-foreground/30",
                )}
              />
            </button>
          </div>
        );
      })}
    </nav>
  );
}
