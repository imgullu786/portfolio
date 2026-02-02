export interface NavItem {
  href: string;
  label: string;
}

export const navItems: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blogs" },
];

export const pagesItems: NavItem[] = [
  { href: "/movies", label: "Movies" },
  { href: "/books", label: "Books" },
  { href: "/snippets", label: "Snippets" },
];
