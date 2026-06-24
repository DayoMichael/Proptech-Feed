"use client";

import { useRef } from "react";

import { useFeedStore } from "@/store/feed/feed-store";
import { currentUser } from "@/lib/mock/data";
import { PostBody } from "@/features/posts/components/post-body";
import { CommentPreview, type PreviewComment } from "@/features/comments/components/comment-preview";
import { ReplyComposer } from "@/features/comments/components/reply-composer";

export function PostCard({
  postId,
  priority,
}: {
  postId: string;
  priority?: boolean;
}) {
  const post = useFeedStore((s) => s.posts[postId]);
  const users = useFeedStore((s) => s.users);
  const comments = useFeedStore((s) => s.comments);
  const topLevelIds = useFeedStore((s) => s.commentsByPost[postId]);
  const commentRef = useRef<HTMLInputElement>(null);

  if (!post) return null;

  const focusComment = () => commentRef.current?.focus();

  const previewIds: string[] = [];
  if (post.topCommentId) previewIds.push(post.topCommentId);
  const myLatest = (topLevelIds ?? [])
    .filter((id) => comments[id]?.authorId === currentUser.id)
    .at(-1);
  if (myLatest && !previewIds.includes(myLatest)) previewIds.push(myLatest);

  const previewItems: PreviewComment[] = previewIds
    .map((id) => comments[id])
    .filter(Boolean)
    .map((c) => ({
      id: c.id,
      handle: users[c.authorId]?.handle ?? "",
      text: c.text,
      isMine: c.authorId === currentUser.id,
      media: c.media,
    }));

  return (
    <article className="bg-card p-4 [contain-intrinsic-size:auto_30rem] [content-visibility:auto] sm:rounded-xl sm:border">
      <PostBody postId={post.id} priority={priority} onComment={focusComment} />

      {previewItems.length > 0 && (
        <div className="ml-13 mt-4">
          <CommentPreview
            items={previewItems}
            commentCount={post.commentCount}
            postHref={`/post/${post.id}`}
          />
        </div>
      )}

      <div className="ml-13 mt-3 border-t pt-3">
        <ReplyComposer postId={post.id} inputRef={commentRef} />
      </div>
    </article>
  );
}
