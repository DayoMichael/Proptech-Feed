import { PostConversation } from "@/features/posts/views/post-conversation";

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <PostConversation postId={postId} />;
}
