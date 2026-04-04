import { redirect } from "next/navigation";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;
  // Redirect to edit page since view page isn't needed for admin
  redirect(`/admin/projects/${id}/edit`);
}
