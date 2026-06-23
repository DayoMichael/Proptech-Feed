"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

import { useFeedStore } from "@/store/feed/feed-store";
import { PostBody } from "@/features/posts/components/post-body";
import { ReplyComposer } from "@/features/comments/components/reply-composer";
import { ReplyRow } from "@/features/comments/components/thread-rows";
import { EmptyState } from "@/components/empty-state";
import { ScreenPanel } from "@/components/screen-panel";

export function PostConversation({ postId }: { postId: string }) {
  const post = useFeedStore((s) => s.posts[postId]);
  const replyIds = useFeedStore((s) => s.commentsByPost[postId]);
  const replyRef = useRef<HTMLInputElement>(null);

  const focusReply = () => replyRef.current?.focus();

  if (!post) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-muted-foreground">This post doesn’t exist.</p>
        <Link href="/" className="mt-2 inline-block text-sm text-primary">
          Back to feed
        </Link>
      </div>
    );
  }

  const replies = replyIds ?? [];

  return (
    <ScreenPanel>
      <header className="flex shrink-0 items-center gap-3 border-b px-3 py-2.5 sm:px-4">
        <Link
          href="/"
          aria-label="Back"
          className="-ml-1 flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="font-semibold">Post</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <PostBody postId={post.id} priority onComment={focusReply} />
        </div>

        <div className="border-t p-4">
          <ReplyComposer
            postId={post.id}
            placeholder="Post your reply"
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
