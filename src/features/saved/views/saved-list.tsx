"use client";

import { Bookmark } from "lucide-react";

import { useFeedStore } from "@/store/feed/feed-store";
import { PostCard } from "@/features/posts/components/post-card";
import { EmptyState } from "@/components/empty-state";
import { ScreenPanel } from "@/components/screen-panel";

export function SavedList() {
  const feedOrder = useFeedStore((s) => s.feedOrder);
  const savedPostIds = useFeedStore((s) => s.savedPostIds);

  const saved = feedOrder.filter((id) => savedPostIds.has(id));

  return (
    <ScreenPanel>
      <header className="shrink-0 border-b px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">Saved</h1>
        <p className="text-sm text-muted-foreground">
          {saved.length > 0
            ? `${saved.length} ${saved.length === 1 ? "post" : "posts"}`
            : "Your bookmarked posts"}
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={Bookmark}
            title="Nothing saved yet"
            description="Tap the bookmark on any post to keep it here for later."
          />
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
          {saved.map((id, i) => (
            <PostCard key={id} postId={id} priority={i < 2} />
          ))}
        </div>
      )}
    </ScreenPanel>
  );
}
