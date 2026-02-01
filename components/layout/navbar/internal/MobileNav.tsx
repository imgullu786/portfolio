"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "@/components/layout/navbar/internal/AuthButton";

interface MobileNavProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileNav({ isOpen, onToggle }: MobileNavProps) {
  return (
    <div className="md:hidden flex items-center justify-between w-full max-w-md">
      <Link
        href="/"
        className="font-bold text-sm px-4 py-2 rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10"
      >
        Portfolio
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle variant="mobile" />
        <div className="rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10">
          <AuthButton />
        </div>
        <button
          onClick={onToggle}
          aria-label="Toggle menu"
          className="p-2 rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
