"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { compactNumber, relativeTime } from "@/lib/format";
import { useFeedStore } from "@/store/feed/feed-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserTypeBadge } from "@/features/posts/components/user-type-badge";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";
import { ReplyComposer } from "@/features/comments/components/reply-composer";
import { CommentMedia } from "@/features/comments/components/comment-media";
import type { User } from "@/types";

function Meta({ author, time }: { author: User; time: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-1.5 text-sm">
      <span className="font-medium">{author.name}</span>
      {author.verified && <VerifiedBadge className="size-3.5" />}
      <span aria-hidden className="text-muted-foreground">
        ·
      </span>
      <UserTypeBadge type={author.type} />
      <span aria-hidden className="text-muted-foreground">
        ·
      </span>
      <span className="text-xs text-muted-foreground">{time}</span>
    </div>
  );
}

/** An ancestor in the chain above the focal comment. The whole row navigates
 * to that comment's own page; a connector line links it to the row below. */
export function ChainRow({
  author,
  time,
  text,
  href,
}: {
  author: User;
  time: string;
  text: string;
  href: string;
}) {
  return (
    <Link href={href} className="flex gap-3">
      <div className="flex flex-col items-center">
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={author.avatarUrl} alt="" loading="lazy" />
          <AvatarFallback className="text-xs">
            {author.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="mt-1 w-0.5 flex-1 rounded-full bg-border" />
      </div>
      <div className="min-w-0 flex-1 pb-4">
        <Meta author={author} time={time} />
        <p className="mt-0.5 line-clamp-4 whitespace-pre-wrap text-sm">{text}</p>
      </div>
    </Link>
  );
}

/** A direct reply under the focal post/comment. Tapping the body opens its own
 * conversation page; Reply opens an inline composer and, on send, navigates to
 * that comment's detail page. */
export function ReplyRow({ commentId }: { commentId: string }) {
  const comment = useFeedStore((s) => s.comments[commentId]);
  const author = useFeedStore((s) =>
    comment ? s.users[comment.authorId] : undefined,
  );
  const replyCount = useFeedStore((s) => s.repliesByComment[commentId]?.length);
  const toggleCommentLike = useFeedStore((s) => s.toggleCommentLike);
  const router = useRouter();
  const [replying, setReplying] = useState(false);

  if (!comment || !author) return null;

  const href = `/comment/${comment.id}`;

  return (
    <article className="flex gap-3">
      <Link href={href} aria-label={`Open ${author.name}'s reply`}>
        <Avatar className="size-9 shrink-0">
          <AvatarImage src={author.avatarUrl} alt="" loading="lazy" />
          <AvatarFallback className="text-xs">
            {author.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={href} className="block">
          <Meta author={author} time={relativeTime(comment.createdAt)} />
          {comment.text && (
            <p className="mt-0.5 whitespace-pre-wrap text-sm">{comment.text}</p>
          )}
        </Link>
        <CommentMedia media={comment.media} />

        <div className="mt-1.5 flex items-center gap-4 text-xs text-muted-foreground">
          <button
            type="button"
            onClick={() => toggleCommentLike(comment.id)}
            aria-pressed={comment.likedByMe}
            aria-label={comment.likedByMe ? "Unlike" : "Like"}
            className={cn(
              "flex items-center gap-1 transition-colors hover:text-foreground",
              comment.likedByMe && "text-like",
            )}
          >
            <Heart
              className={cn("size-3.5", comment.likedByMe && "fill-current")}
            />
            {comment.likeCount > 0 && compactNumber(comment.likeCount)}
          </button>
          <button
            type="button"
            onClick={() => setReplying((v) => !v)}
            aria-expanded={replying}
            className="flex items-center gap-1 font-medium transition-colors hover:text-foreground"
          >
            <MessageCircle className="size-3.5" />
            {replyCount ? compactNumber(replyCount) : "Reply"}
          </button>
        </div>

        {replying && (
          <div className="mt-2">
            <ReplyComposer
              postId={comment.postId}
              parentId={comment.id}
              placeholder={`Reply to ${author.name}…`}
              autoFocus
              onCancel={() => setReplying(false)}
              onSubmitted={(newId) => {
                setReplying(false);
                router.push(`/comment/${newId}`);
              }}
            />
          </div>
        )}
      </div>
    </article>
  );
}
