"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { SidebarContent } from "./SidebarContent";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function AdminSidebar({ user, children }: any) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => setIsOpen(false), [pathname]);

  return (
    <TooltipProvider>
      <div className="flex min-h-screen">
        {/* Mobile sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 w-64 z-50 lg:hidden bg-linear-to-b from-[#02AED2] to-[#2FBEDF]",
            isOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <SidebarContent collapsed={false} pathname={pathname} user={user} />
        </aside>

        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden md:flex flex-col relative bg-linear-to-b from-[#02AED2] to-[#2FBEDF] transition-all border-white",
            isCollapsed ? "w-16" : "w-64",
          )}
        >
          <SidebarContent
            collapsed={isCollapsed}
            pathname={pathname}
            user={user}
          />

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-20 bg-[#02AED2] rounded-full p-1"
          >
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <div className="md:hidden p-2 border-b">
            <Button size="icon" variant="ghost" onClick={() => setIsOpen(true)}>
              <Menu />
            </Button>
          </div>
          <div className="p-6">{children}</div>
        </main>
      </div>
    </TooltipProvider>
  );
}
