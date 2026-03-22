"use client";

import { useState, useCallback, useRef } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockCardProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
}

/**
 * Shiro-inspired code block card wrapper.
 * Features: rounded card, language label, animated copy button on hover.
 */
export function CodeBlockCard({
  children,
  className,
  language,
}: CodeBlockCardProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef<HTMLDivElement>(null);

  const handleCopy = useCallback(() => {
    const codeEl = codeRef.current?.querySelector("code");
    if (!codeEl) return;
    navigator.clipboard.writeText(codeEl.textContent || "");
    setCopied(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div
      className={cn(
        "code-card group relative my-4 overflow-hidden rounded-lg border border-border/40",
        className,
      )}
    >
      {/* Language label — bottom-right, subtle */}
      {language && (
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-3 right-3 z-[2] text-xs font-medium opacity-40 select-none"
        >
          {language.toUpperCase()}
        </div>
      )}

      {/* Copy button — appears on hover, top-right */}
      <button
        onClick={handleCopy}
        className={cn(
          "absolute right-2 top-2 z-[3] flex items-center justify-center",
          "rounded-md border border-border/30 bg-background/80 p-1.5 backdrop-blur",
          "text-muted-foreground transition-opacity duration-200",
          "opacity-0 group-hover:opacity-100",
          "hover:bg-muted",
        )}
        aria-label="Copy code"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-green-500" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Code content */}
      <div
        ref={codeRef}
        className="overflow-auto py-3 text-[14px] leading-[1.7]"
      >
        {children}
      </div>
    </div>
  );
}
