import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Library,
  Camera,
  Film,
  StickyNote,
} from "lucide-react";

export const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Projects", href: "/admin/projects", icon: FolderKanban },
  { title: "Blogs", href: "/admin/blogs", icon: FileText },
  { title: "Notes", href: "/admin/notes", icon: StickyNote },
  { title: "Movies", href: "/admin/movies", icon: Film },
  { title: "Books", href: "/admin/books", icon: Library },
  { title: "Snippets", href: "/admin/snippets", icon: Camera },
];