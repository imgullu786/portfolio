import { SidebarNav } from "./SidebarNav";
import { SidebarUser } from "./SidebarUser";

export function SidebarContent({
  collapsed,
  pathname,
  user,
}: {
  collapsed: boolean;
  pathname: string;
  user: any;
}) {
  return (
    <div className="h-screen flex flex-col fixed">
      <SidebarNav collapsed={collapsed} pathname={pathname} />
      <SidebarUser collapsed={collapsed} user={user} />
    </div>
  );
}
