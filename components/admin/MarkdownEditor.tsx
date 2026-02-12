"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => (
    <div className="h-96 rounded-lg bg-gray-50 dark:bg-muted animate-pulse" />
  ),
});

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = useCallback(
    (val?: string) => {
      onChange(val || "");
    },
    [onChange],
  );

  const colorMode = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div
      ref={containerRef}
      className="markdown-editor-container"
      data-color-mode={colorMode}
    >
      <MDEditor
        value={value}
        onChange={handleChange}
        preview="edit"
        height={450}
        visibleDragbar={false}
        textareaProps={{
          placeholder: placeholder || "Start writing...",
        }}
      />
      <style jsx global>{`
        .markdown-editor-container .w-md-editor-toolbar {
          padding: 4px 8px !important;
          min-height: 36px !important;
        }
        .markdown-editor-container .w-md-editor-toolbar ul > li > button {
          height: 26px !important;
          width: 26px !important;
          padding: 4px !important;
        }
        .markdown-editor-container .w-md-editor-toolbar ul > li > button svg {
          width: 14px !important;
          height: 14px !important;
        }
      `}</style>
    </div>
  );
}
