"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, ProjectFormData } from "@/lib/validations";
import { createProject, updateProject } from "@/actions/projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProjectFormProps {
  project?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    content: string | null;
    liveUrl: string | null;
    githubUrl: string | null;
    techStack: string[];
    featured: boolean;
    published: boolean;
    sortOrder: number;
  };
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!project;

  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title || "",
      slug: project?.slug || "",
      description: project?.description || "",
      content: project?.content || "",
      liveUrl: project?.liveUrl || "",
      githubUrl: project?.githubUrl || "",
      techStack: project?.techStack || [],
      featured: project?.featured || false,
      published: project?.published || false,
      sortOrder: project?.sortOrder || 0,
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (isEditing) {
        await updateProject(project.id, data);
        toast.success("Project updated successfully");
      } else {
        await createProject(data);
        toast.success("Project created successfully");
      }
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  // Tech stack as raw string - parse on blur
  const [techInput, setTechInput] = useState(
    project?.techStack?.join(", ") || "",
  );

  const handleTechBlur = () => {
    const tech = techInput
      .split(",")
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 0);
    setValue("techStack", tech);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-[calc(100vh-120px)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">
              {isEditing ? "Edit Project" : "New Project"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Projects · {isEditing ? "Edit" : "Create"}
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
          <Link href="/admin/projects">
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
            {isEditing ? "Save" : "Create"}
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
              placeholder="Project Title"
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
            <span className="opacity-60">/projects/</span>
            <Input
              {...register("slug")}
              placeholder="auto-generated-slug"
              className="border-0 border-b border-dashed border-gray-300 dark:border-border rounded-none px-1 py-0 h-auto text-sm focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent flex-1"
            />
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-muted-foreground">Tech:</span>
            <Input
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onBlur={handleTechBlur}
              placeholder="react, nextjs, typescript"
              className="border-0 border-b border-dashed border-gray-300 dark:border-border rounded-none px-1 py-0 h-auto text-sm focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent flex-1"
            />
          </div>

          {/* Live URL */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-muted-foreground">Live:</span>
            <Input
              {...register("liveUrl")}
              placeholder="https://example.com"
              className="border-0 border-b border-dashed border-gray-300 dark:border-border rounded-none px-1 py-0 h-auto text-sm focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent flex-1"
            />
          </div>

          {/* GitHub URL */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <span className="text-muted-foreground">GitHub:</span>
            <Input
              {...register("githubUrl")}
              placeholder="https://github.com/..."
              className="border-0 border-b border-dashed border-gray-300 dark:border-border rounded-none px-1 py-0 h-auto text-sm focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent flex-1"
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <Input
              {...register("description")}
              placeholder="Brief description of the project..."
              className="border-0 border-b border-gray-200 dark:border-border rounded-none px-0 py-2 focus-visible:ring-0 focus-visible:border-[#02AED2] bg-transparent text-muted-foreground"
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Content Editor */}
          <div className="flex-1">
            <MarkdownEditor
              value={watch("content") || ""}
              onChange={(value) => setValue("content", value)}
              placeholder="Write about the project..."
            />
            {errors.content && (
              <p className="text-sm text-destructive mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
        </div>

        {/* Sidebar - Image Uploader */}
        <div className="bg-white dark:bg-card rounded-xl border border-gray-200 dark:border-border p-4">
          <ImageUploader contentType="projects" modelId={project?.id} />
        </div>
      </div>
    </form>
  );
}
