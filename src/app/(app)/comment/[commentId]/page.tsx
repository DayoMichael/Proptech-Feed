import { CommentConversation } from "@/features/comments/views/comment-conversation";

export default async function CommentPage({
  params,
}: {
  params: Promise<{ commentId: string }>;
}) {
  const { commentId } = await params;
  return <CommentConversation commentId={commentId} />;
}
