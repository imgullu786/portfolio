import { notFound } from "next/navigation";
import { getBlogById } from "@/actions/blogs";
import { BlogForm } from "@/components/admin/BlogForm";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <BlogForm blog={blog} />
    </div>
  );
}
