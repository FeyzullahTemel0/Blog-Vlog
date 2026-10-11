import { PostForm } from "@/components/admin/PostForm";

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PostForm postId={id} />;
}
