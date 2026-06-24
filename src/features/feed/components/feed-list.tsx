"use client";

import { useEffect, useRef, useState } from "react";
import { SearchX } from "lucide-react";

import { useFeedStore } from "@/store/feed/feed-store";
import { useAuthStore } from "@/store/auth-store";
import { matchesFilters } from "@/features/filters/filters";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/posts/components/post-card";
import { PostCardSkeleton } from "@/features/posts/components/post-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/providers/auth-provider";

const PAGE_SIZE = 5;
const SIGN_IN_PROMPT_AT = 5;

export function FeedList() {
  const feedOrder = useFeedStore((s) => s.feedOrder);
  const posts = useFeedStore((s) => s.posts);
  const users = useFeedStore((s) => s.users);
  const filters = useFeedStore((s) => s.filters);
  const resetFilters = useFeedStore((s) => s.resetFilters);
  const signedIn = useAuthStore((s) => Boolean(s.user));
  const { openSignIn } = useAuth();

  const visible = feedOrder.filter((id) =>
    matchesFilters(posts[id], users[posts[id].authorId], filters),
  );

  const [count, setCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const gateRef = useRef<HTMLDivElement>(null);
  const promptedRef = useRef(false);

  const limit = signedIn ? count : PAGE_SIZE;
  const shown = visible.slice(0, limit);
  const hasMore = signedIn && count < visible.length;
  const lockedMore = !signedIn && visible.length > shown.length;

  useEffect(() => {
    if (signedIn) {
      promptedRef.current = false;
      return;
    }
    const el = gateRef.current;
    if (!el || promptedRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !promptedRef.current) {
          promptedRef.current = true;
          openSignIn();
          io.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [signedIn, openSignIn, shown.length]);

  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCount((c) => Math.min(c + PAGE_SIZE, visible.length));
        }
      },
      { rootMargin: "1200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, visible.length]);

  if (visible.length === 0) {
    return (
      <div className="rounded-xl border bg-card pb-5">
        <EmptyState
          icon={SearchX}
          title="No posts match your filters"
          description="Try widening your search or clearing the filters."
        />
        <div className="flex justify-center">
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
          >
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {shown.map((postId, i) => (
        <div key={postId}>
          <PostCard postId={postId} priority={i < 2} />
          {!signedIn && i === SIGN_IN_PROMPT_AT - 1 && (
            <div ref={gateRef} aria-hidden className="h-px" />
          )}
        </div>
      ))}

      {hasMore && (
        <div ref={sentinelRef} aria-hidden className="space-y-4">
          <PostCardSkeleton />
          <PostCardSkeleton />
        </div>
      )}

      {lockedMore && (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card px-6 py-8 text-center">
          <p className="font-semibold">Sign in to see more</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Create an account to keep scrolling listings, save posts and message
            agents.
          </p>
          <Button onClick={openSignIn} className="rounded-full px-6">
            Sign in
          </Button>
        </div>
      )}
    </div>
  );
}
