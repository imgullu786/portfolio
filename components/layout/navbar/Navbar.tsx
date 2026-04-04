"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems, pagesItems } from "./config";
import { useScrollVisibility, useLockBodyScroll, useDrawerDrag } from "./hooks";
import { DesktopNav } from "./DesktopNav";
import { ThemeToggle } from "./ThemeToggle";
import { AuthButton } from "./AuthButton";
import { PageIcon } from "@/components/icons/pageIcon";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const isVisible = useScrollVisibility();

  // Lock body scroll when drawer is open
  useLockBodyScroll(isOpen);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-300",
          !isVisible && "-translate-y-full",
        )}
      >
        {/* Mobile Nav Bar */}
        <div className="md:hidden flex items-center justify-between w-full max-w-md">
          <Link
            href="/"
            className="font-bold text-sm px-4 py-2 rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10"
          >
            Md Gulam Gaush
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle variant="mobile" />
            <div className="rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10">
              <AuthButton />
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="p-2 rounded-full bg-zinc-50/70 dark:bg-zinc-900/70 backdrop-blur-md ring-1 ring-zinc-900/5 dark:ring-white/10"
            >
              {isOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <DesktopNav />
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

// ─── Mobile Drawer ───────────────────────────────────────────

function MobileDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { handleDragEnd } = useDrawerDrag(onClose);
  const pathname = usePathname();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="bg-zinc-50 dark:bg-zinc-900 rounded-t-3xl shadow-2xl">
              {/* Drawer Handle */}
              <div className="flex justify-center py-3">
                <div className="w-10 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" />
              </div>

              {/* Drawer Content */}
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
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

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
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
