"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  variant?: "mobile" | "desktop";
  className?: string;
}

export function ThemeToggle({
  variant = "desktop",
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const baseStyles =
    variant === "mobile"
      ? "relative p-2 rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10"
      : "relative p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors";

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(baseStyles, className)}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute inset-0 m-auto h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
