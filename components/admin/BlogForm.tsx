"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { blogSchema, BlogFormData } from "@/lib/validations";
import { createBlog, updateBlog } from "@/actions/blogs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BlogFormProps {
  blog?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    published: boolean;
    featured: boolean;
    publishedAt: Date | null;
    tags: string[];
  };
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const isEditing = !!blog;

  const form = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: blog?.title || "",
      slug: blog?.slug || "",
      excerpt: blog?.excerpt || "",
      content: blog?.content || "",
      coverImage: blog?.coverImage || "",
      published: blog?.published || false,
      featured: blog?.featured || false,
      tags: blog?.tags || [],
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: BlogFormData) => {
    try {
      if (isEditing) {
        await updateBlog(blog.id, data);
        toast.success("Blog updated successfully");
      } else {
        await createBlog(data);
        toast.success("Blog created successfully");
      }
      router.push("/admin/blogs");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // Tags as raw string - parse on blur
  const [tagsInput, setTagsInput] = useState(blog?.tags?.join(", ") || "");

  const handleTagsBlur = () => {
    const tags = tagsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);
    setValue("tags", tags);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-[calc(100vh-120px)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/blogs">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">
              {isEditing ? "Edit Post" : "New Post"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Blogs · {isEditing ? "Edit" : "Write"}
            </p>
          </div>
        </div>

        {/* Published toggle + Save button */}
        <div className="flex items-center gap-4">
          <div className="group flex flex-col items-center">
            <Switch
              id="published"
              checked={watch("published")}
              onCheckedChange={(checked) => setValue("published", checked)}
            />
            <span className="text-[11px] text-muted-foreground mt-1">
              {watch("published") ? "Published" : "Draft"}
            </span>
          </div>
          <Link href="/admin/blogs">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            className="bg-[#02AED2] hover:bg-[#0199AC] text-white"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isEditing ? "Save" : "Publish"}
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Editor Column */}
        <div className="lg:col-span-3 bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-8">
          {/* Title */}
          <div className="mb-4">
            <Input
              {...register("title")}
              placeholder="Title"
              className="border-0 border-b-2 border-gray-200 dark:border-border rounded-none text-3xl font-bold px-0 py-3 focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent placeholder:text-gray-300 dark:placeholder:text-gray-600"
            />
            {errors.title && (
              <p className="text-sm text-destructive mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Slug */}
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <span className="opacity-60">/blog/</span>
            <Input
              {...register("slug")}
              placeholder="auto-generated-slug"
              className="border-0 border-b border-dashed border-gray-300 dark:border-border rounded-none px-1 py-0 h-auto text-sm focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent flex-1"
            />
          </div>

          {/* Cover URL */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-muted-foreground">Cover:</span>
            <Input
              {...register("coverImage")}
              placeholder="https://..."
              className="border-0 border-b border-dashed border-gray-300 dark:border-border rounded-none px-1 py-0 h-auto text-sm focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent flex-1"
            />
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-6 text-sm">
            <span className="text-muted-foreground">Tags:</span>
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              onBlur={handleTagsBlur}
              placeholder="react, nextjs, typescript"
              className="border-0 border-b border-dashed border-gray-300 dark:border-border rounded-none px-1 py-0 h-auto text-sm focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent flex-1"
            />
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <Input
              {...register("excerpt")}
              placeholder="Brief summary of your post..."
              className="border-0 border-b border-gray-200 dark:border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent text-muted-foreground"
            />
            {errors.excerpt && (
              <p className="text-sm text-destructive mt-1">
                {errors.excerpt.message}
              </p>
            )}
          </div>

          {/* Content Editor */}
          <div className="flex-1">
            <span>Content Editor</span>
          </div>
        </div>

        {/* Sidebar - Image Uploader */}
        <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-4">
          <span>Image Uploader</span>
        </div>
      </div>
    </form>
  );
}
