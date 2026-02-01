"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  label: string;
  /** Custom active check function. If not provided, uses pathname matching. */
  isActiveOverride?: boolean;
}

export function NavItem({ href, label, isActiveOverride }: NavItemProps) {
  const pathname = usePathname();

  const isActive =
    isActiveOverride !== undefined
      ? isActiveOverride
      : pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={cn(
        "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
        isActive
          ? "text-primary"
          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white",
      )}
    >
      {label}
      {isActive && (
        <motion.div
          layoutId="navbar-active"
          className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-full -z-10 shadow-sm"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        />
      )}
    </Link>
  );
}
