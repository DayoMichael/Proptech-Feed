"use client";

import { Rocket } from "lucide-react";

import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock/data";
import { useFeedStore } from "@/store/feed/feed-store";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { PostCard } from "@/features/posts/components/post-card";
import { EmptyState } from "@/components/empty-state";
import { ScreenPanel } from "@/components/screen-panel";
import { useAuth } from "@/providers/auth-provider";
import { useComposer } from "@/providers/composer-provider";

export function BoostsView() {
  const signedIn = useAuthStore((s) => Boolean(s.user));
  const { openSignIn } = useAuth();
  const { open } = useComposer();
  const feedOrder = useFeedStore((s) => s.feedOrder);
  const posts = useFeedStore((s) => s.posts);
  const boosted = useFeedStore((s) => s.boostedPostIds);
  const toggleBoost = useFeedStore((s) => s.toggleBoost);

  if (!signedIn) {
    return (
      <ScreenPanel>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Rocket className="size-7" />
          </span>
          <div className="space-y-1">
            <p className="text-base font-semibold">Sign in to manage boosts</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Boost your listings to reach more buyers and renters.
            </p>
          </div>
          <Button onClick={openSignIn}>Sign in</Button>
        </div>
      </ScreenPanel>
    );
  }

  const mine = feedOrder.filter((id) => posts[id].authorId === currentUser.id);
  const ordered = [...mine].sort(
    (a, b) => Number(boosted.has(b)) - Number(boosted.has(a)),
  );
  const activeCount = mine.filter((id) => boosted.has(id)).length;

  return (
    <ScreenPanel>
      <header className="shrink-0 border-b px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">My Boosts</h1>
        <p className="text-sm text-muted-foreground">
          {activeCount > 0
            ? `${activeCount} active boost${activeCount > 1 ? "s" : ""}`
            : "Boost a listing to reach more people"}
        </p>
      </header>

      {mine.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <EmptyState
            icon={Rocket}
            title="No listings to boost yet"
            description="Create a post, then boost it to reach more buyers and renters."
          />
          <Button onClick={() => open("property")}>Create a listing</Button>
        </div>
      ) : (
        <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
          {ordered.map((id) => {
            const isBoosted = boosted.has(id);
            return (
              <div key={id} className="space-y-2">
                <div
                  className={cn(
                    "flex items-center justify-between gap-3 rounded-xl border px-3 py-2",
                    isBoosted
                      ? "border-primary/40 bg-primary/10"
                      : "bg-surface-sunken",
                  )}
                >
                  <span className="flex items-center gap-2 text-sm">
                    <Rocket
                      className={cn(
                        "size-4",
                        isBoosted ? "text-primary" : "text-muted-foreground",
                      )}
                    />
                    {isBoosted ? "Boosted — reaching more people" : "Not boosted"}
                  </span>
                  <Button
                    size="sm"
                    variant={isBoosted ? "secondary" : "default"}
                    onClick={() => toggleBoost(id)}
                    className="shrink-0 rounded-full"
                  >
                    {isBoosted ? "Remove" : "Boost"}
                  </Button>
                </div>
                <PostCard postId={id} />
              </div>
            );
          })}
        </div>
      )}
    </ScreenPanel>
  );
}
