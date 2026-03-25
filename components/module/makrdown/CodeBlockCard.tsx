"use client";

import { useState, useCallback, useRef } from "react";
import { Check, Copy, FileCode2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CodeBlockCardProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  fileName?: string;
}

export function CodeBlockCard({
  children,
  className,
  language,
  fileName,
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
  const headerLabel = fileName || (language ? language.toUpperCase() : null);

  return (
    <div
      className={cn(
        "code-card group relative my-4 overflow-hidden rounded-lg border border-border/40",
        className,
      )}
    >
      {/* Header bar — shows for both filename and language-only blocks */}
      {headerLabel ? (
        <div className="flex items-center justify-between border-b border-border/40 bg-muted/40 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <FileCode2 className="h-3.5 w-3.5 shrink-0 opacity-70" />
            <span className="truncate font-mono">{headerLabel}</span>
          </div>
          <button
            onClick={handleCopy}
            className={cn(
              "flex items-center justify-center rounded-md p-1 transition-colors",
              "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted",
            )}
            aria-label="Copy code"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-green-500" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      ) : (
        /* Fallback copy button — only when no language/filename */
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
      )}

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
