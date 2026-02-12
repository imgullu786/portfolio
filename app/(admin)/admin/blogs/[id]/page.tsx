import { redirect } from "next/navigation";

interface BlogDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { id } = await params;
  // Redirect to edit page since view page isn't needed for admin
  redirect(`/admin/blogs/${id}/edit`);
}
