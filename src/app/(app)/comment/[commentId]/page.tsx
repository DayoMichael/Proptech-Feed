import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { CommentConversation } from "@/features/comments/views/comment-conversation";

export const metadata: Metadata = pageMetadata({
  title: "Thread",
  description: "A comment thread on Expert Listing.",
  path: "/comment",
  index: false,
});

export default async function CommentPage({
  params,
}: {
  params: Promise<{ commentId: string }>;
}) {
  const { commentId } = await params;
  return <CommentConversation commentId={commentId} />;
}
