"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, pagesItems } from "../config";
import { PageIcon } from "@/components/icons/pageIcon";

interface MobileDrawerContentProps {
  onClose: () => void;
}

export function MobileDrawerContent({ onClose }: MobileDrawerContentProps) {
  const pathname = usePathname();

  return (
    <nav className="px-6 pb-10">
      {/* Main Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <PageIcon />
          <span className="text-sm font-medium">Main</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "py-2 text-sm transition-colors",
                  isActive
                    ? "text-primary font-medium"
                    : "text-zinc-600 dark:text-zinc-400 active:text-zinc-900 dark:active:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Pages Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <PageIcon />
          <span className="text-sm font-medium">Pages</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          {pagesItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "py-2 text-sm transition-colors",
                  isActive
                    ? "text-primary font-medium"
                    : "text-zinc-600 dark:text-zinc-400 active:text-zinc-900 dark:active:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
