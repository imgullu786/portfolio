import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LogOut, Moon, Sun } from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function SidebarUser({
  user,
  collapsed,
}: {
  user: any;
  collapsed: boolean;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={cn("p-4 border-t border-white/20", collapsed && "p-2")}>
      {!collapsed && (
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm text-white">{user.name}</p>
            <p className="text-xs text-white/60">{user.email}</p>
          </div>
        </div>
      )}

      <div className={cn("flex gap-2", collapsed && "flex-col")}>
        {!collapsed && (
          <Button asChild size="sm" variant="outline">
            <Link href="/" target="_blank">
              View Site
            </Link>
          </Button>
        )}

        <Button
          size="sm"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="dark:hidden h-4 w-4" />
          <Moon className="hidden dark:block h-4 w-4" />
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
