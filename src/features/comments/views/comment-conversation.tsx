"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { compactNumber, relativeTime } from "@/lib/format";
import { collectAncestors } from "@/lib/thread";
import { useFeedStore } from "@/store/feed/feed-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserTypeBadge } from "@/features/posts/components/user-type-badge";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";
import { ChainRow, ReplyRow } from "@/features/comments/components/thread-rows";
import { ReplyComposer } from "@/features/comments/components/reply-composer";
import { CommentMedia } from "@/features/comments/components/comment-media";
import { EmptyState } from "@/components/empty-state";
import { ScreenPanel } from "@/components/screen-panel";

export function CommentConversation({ commentId }: { commentId: string }) {
  const comment = useFeedStore((s) => s.comments[commentId]);
  const users = useFeedStore((s) => s.users);
  const comments = useFeedStore((s) => s.comments);
  const post = useFeedStore((s) => (comment ? s.posts[comment.postId] : undefined));
  const replyIds = useFeedStore((s) => s.repliesByComment[commentId]);
  const toggleCommentLike = useFeedStore((s) => s.toggleCommentLike);

  const replyRef = useRef<HTMLInputElement>(null);
  const [showEarlier, setShowEarlier] = useState(false);

  if (!comment || !post) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">This reply doesn’t exist.</p>
        <Link href="/" className="mt-2 inline-block text-sm text-primary">
          Back to feed
        </Link>
      </div>
    );
  }

  const author = users[comment.authorId];
  const ancestors = collectAncestors(comments, commentId);
  const parentMost = ancestors.slice(0, -1);
  const immediateParentId = ancestors.at(-1);
  const replies = replyIds ?? [];

  const replyingToHandle = comment.parentId
    ? users[comments[comment.parentId]?.authorId]?.handle
    : users[post.authorId]?.handle;
  const replyingToHref = comment.parentId
    ? `/comment/${comment.parentId}`
    : `/post/${post.id}`;

  return (
    <ScreenPanel>
      <header className="flex shrink-0 items-center gap-3 border-b px-3 py-2.5 sm:px-4">
        <Link
          href={`/post/${post.id}`}
          aria-label="Back"
          className="-ml-1 flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-semibold">Thread</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
        <ChainRow
          author={users[post.authorId]}
          time={relativeTime(post.createdAt)}
          text={post.text}
          href={`/post/${post.id}`}
        />

        {parentMost.length > 0 && !showEarlier && (
          <button
            type="button"
            onClick={() => setShowEarlier(true)}
            className="flex w-full gap-3 text-left"
          >
            <div className="flex w-9 justify-center">
              <div className="w-0.5 self-stretch rounded-full bg-[repeating-linear-gradient(to_bottom,var(--border)_0_3px,transparent_3px_6px)]" />
            </div>
            <span className="py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Show {parentMost.length} earlier{" "}
              {parentMost.length === 1 ? "reply" : "replies"}
            </span>
          </button>
        )}
        {parentMost.length > 0 &&
          showEarlier &&
          parentMost.map((id) => (
            <ChainRow
              key={id}
              author={users[comments[id].authorId]}
              time={relativeTime(comments[id].createdAt)}
              text={comments[id].text}
              href={`/comment/${id}`}
            />
          ))}
        {immediateParentId && (
          <ChainRow
            author={users[comments[immediateParentId].authorId]}
            time={relativeTime(comments[immediateParentId].createdAt)}
            text={comments[immediateParentId].text}
            href={`/comment/${immediateParentId}`}
          />
        )}

        <div className="pt-1">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 shrink-0">
              <AvatarImage src={author.avatarUrl} alt="" />
              <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold">{author.name}</span>
                {author.verified && <VerifiedBadge className="size-4" />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>@{author.handle}</span>
                <span aria-hidden>·</span>
                <UserTypeBadge type={author.type} />
              </div>
            </div>
          </div>

          {replyingToHandle && (
            <p className="mt-2 text-sm text-muted-foreground">
              Replying to{" "}
              <Link href={replyingToHref} className="text-brand-strong">
                @{replyingToHandle}
              </Link>
            </p>
          )}

          {comment.text && (
            <p className="mt-2 whitespace-pre-wrap text-[0.9375rem] leading-relaxed">
              {comment.text}
            </p>
          )}
          <CommentMedia media={comment.media} />

          <div className="mt-3 flex items-center gap-5 border-t pt-3 text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => toggleCommentLike(comment.id)}
              aria-pressed={comment.likedByMe}
              aria-label={comment.likedByMe ? "Unlike" : "Like"}
              className={cn(
                "flex items-center gap-1.5 transition-colors hover:text-foreground",
                comment.likedByMe && "text-like",
              )}
            >
              <Heart
                className={cn("size-4", comment.likedByMe && "fill-current")}
              />
              {comment.likeCount > 0 && compactNumber(comment.likeCount)}
            </button>
            <span className="flex items-center gap-1.5">
              <MessageCircle className="size-4" />
              {replies.length > 0 && compactNumber(replies.length)}
            </span>
          </div>
        </div>
      </div>

        <div className="border-t p-4">
          <ReplyComposer
            postId={post.id}
            parentId={comment.id}
            placeholder={`Reply to ${author.name}…`}
            inputRef={replyRef}
          />
        </div>

        <section aria-label="Replies" className="space-y-4 border-t p-4">
          {replies.length === 0 ? (
            <EmptyState
              icon={MessageCircle}
              title="No replies yet"
              description="Be the first to join the conversation."
            />
          ) : (
            replies.map((id) => <ReplyRow key={id} commentId={id} />)
          )}
        </section>
      </div>
    </ScreenPanel>
  );
}
