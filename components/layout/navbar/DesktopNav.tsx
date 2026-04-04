"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./config";
import { NavItem } from "./NavItem";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";

export function DesktopNav() {
  const pathname = usePathname();

  const isInPagesSection =
    pathname === "/pages" ||
    pathname.startsWith("/movies") ||
    pathname.startsWith("/books") ||
    pathname.startsWith("/snippets");

  return (
    <div className="hidden md:flex items-center justify-between w-full max-w-4xl">
      {/* Portfolio Logo - Left */}
      <Link
        href="/"
        className="font-bold text-sm px-4 py-2 rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10"
      >
        Md Gulam Gaush
      </Link>

      {/* Navigation Capsule - Middle */}
      <nav className="flex items-center gap-1 px-1 py-1 rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10 shadow-lg shadow-zinc-800/5">
        {navItems.map((item) => (
          <NavItem key={item.href} href={item.href} label={item.label} />
        ))}

        {/* Divider */}
        <div className="w-px h-5 bg-zinc-300 dark:bg-zinc-700 mx-1" />

        {/* Pages Link */}
        <NavItem
          href="/pages"
          label="Pages"
          isActiveOverride={isInPagesSection}
        />
      </nav>

      {/* Right Side - Theme Toggle & Auth Button */}
      <div className="flex items-center gap-2">
        <ThemeToggle variant="mobile" />
        <div className="rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
