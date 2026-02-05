import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { navItems } from "./navItems";

export function SidebarNav({
  collapsed,
  pathname,
}: {
  collapsed: boolean;
  pathname: string;
}) {
  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <nav className={cn("flex-1 px-4 py-4 space-y-1", collapsed && "px-2")}>
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);

        const button = (
          <button
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 text-sm transition-all",
              collapsed && "justify-center px-2",
              active
                ? "bg-[#02AED2] text-white rounded-l-[24px]"
                : "text-white/80 hover:bg-[#2FBEDF] hover:text-white hover:rounded-l-[24px]",
            )}
          >
            <Icon className="h-4 w-4" />
            {!collapsed && item.title}
          </button>
        );

        if (collapsed) {
          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link href={item.href}>{button}</Link>
              </TooltipTrigger>
              <TooltipContent side="right">{item.title}</TooltipContent>
            </Tooltip>
          );
        }

        return (
          <Link key={item.href} href={item.href}>
            {button}
          </Link>
        );
      })}
    </nav>
  );
}
