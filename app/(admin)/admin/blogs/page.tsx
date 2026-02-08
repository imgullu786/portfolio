"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Blog } from "@/generated/prisma/client";
import { formatDate } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { Plus, Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Blog deleted successfully");
        setBlogs(blogs.filter((b) => b.id !== id));
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      toast.error("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#02AED2]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button className="bg-[#02AED2] hover:bg-[#0199AC] text-white">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Button>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground mb-4">
              No blog posts yet, Create one to get started
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-card border border-gray-200 dark:border-border overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 dark:border-border bg-gray-50 dark:bg-muted/50 text-sm font-medium text-muted-foreground">
            <div className="col-span-5">Title</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-border">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 dark:hover:bg-muted/30 transition-colors"
              >
                {/* Title */}
                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{blog.title}</span>
                    {blog.featured && (
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    )}
                    {blog.published && (
                      <Link href={`/blog/${blog.slug}`} target="_blank">
                        <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-[#02AED2]" />
                      </Link>
                    )}
                  </div>
                  {blog.tags.length > 0 && (
                    <div className="flex gap-1 mt-1">
                      {blog.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{blog.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  <Badge
                    variant={blog.published ? "default" : "outline"}
                    className={
                      blog.published
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0"
                        : ""
                    }
                  >
                    {blog.published ? (
                      <>
                        <Eye className="mr-1 h-3 w-3" />
                        Published
                      </>
                    ) : (
                      <>
                        <EyeOff className="mr-1 h-3 w-3" />
                        Draft
                      </>
                    )}
                  </Badge>
                </div>

                {/* Date */}
                <div className="col-span-2 text-sm text-muted-foreground">
                  {blog.publishedAt && formatDate(new Date(blog.publishedAt))}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex items-center justify-end gap-1">
                  <Link href={`/admin/blogs/${blog.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleDelete(blog.id, blog.title)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
