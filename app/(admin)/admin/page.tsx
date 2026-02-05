import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FolderKanban,
  FileText,
  Film,
  BookOpen,
  Plus,
  Settings,
  NotebookPen,
  StickyNote,
} from "lucide-react";
import { title } from "process";

async function getStats() {
  const [projects, blogs, movies, books, notes, snippets] = await Promise.all([
    db.project.count(),
    db.blog.count(),
    db.note.count(),
    db.movie.count(),
    db.book.count(),
    db.snippet.count(),
  ]);

  return { projects, blogs, movies, books, notes, snippets };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    {
      title: "Projects",
      count: stats.projects,
      icon: FolderKanban,
      href: "/admin/projects",
      newHref: "/admin/projects/new",
    },
    {
      title: "Blog Posts",
      count: stats.blogs,
      icon: FileText,
      href: "/admin/blogs",
      newHref: "/admin/blogs/new",
    },
    {
      title: "Notes",
      count: stats.books,
      icon: NotebookPen,
      href: "/admin/notes",
      newHref: "/admin/notes/new",
    },
    {
      title: "Movies",
      count: stats.movies,
      icon: Film,
      href: "/admin/movies",
      newHref: "/admin/movies/new",
    },
    {
      title: "Books",
      count: stats.books,
      icon: BookOpen,
      href: "/admin/books",
      newHref: "/admin/books/new",
    },
    {
      title: "Snippets",
      count: stats.snippets,
      icon: StickyNote,
      href: "/admin/snippets",
      newHref: "/admin/snippets/new",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s an overview of your content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {card.title}
                    </p>
                    <p className="text-4xl font-bold mt-2">{card.count}</p>
                  </div>
                  <Icon className="h-6 w-6 text-[#02AED2]" />
                </div>
                <div className="flex gap-2 mt-6">
                  <Link href={card.newHref} className="flex-1">
                    <Button
                      size="sm"
                      className="w-full bg-[#02AED2] hover:bg-[#0199AC] text-white"
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Write
                    </Button>
                  </Link>
                  <Link href={card.href} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      <Settings className="mr-1 h-3 w-3" />
                      Manage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity Section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Content
                </span>
                <span className="font-semibold">
                  {stats.projects + stats.blogs + stats.movies + stats.books}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Projects</span>
                <span className="font-semibold">{stats.projects}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Blog Posts
                </span>
                <span className="font-semibold">{stats.blogs}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your recent content updates will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
