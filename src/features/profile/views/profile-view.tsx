"use client";

import { useState } from "react";
import {
  Bookmark,
  CalendarDays,
  MapPin,
  PenSquare,
  UserRound,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { currentUser } from "@/lib/mock/data";
import { useFeedStore } from "@/store/feed/feed-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserTypeBadge } from "@/features/posts/components/user-type-badge";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";
import { PostCard } from "@/features/posts/components/post-card";
import { EmptyState } from "@/components/empty-state";
import { ScreenPanel } from "@/components/screen-panel";
import { useComposer } from "@/providers/composer-provider";
import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/providers/auth-provider";

type Tab = "posts" | "saved";

export function ProfileView() {
  const { open } = useComposer();
  const { openSignIn } = useAuth();
  const signedIn = useAuthStore((s) => Boolean(s.user));
  const feedOrder = useFeedStore((s) => s.feedOrder);
  const posts = useFeedStore((s) => s.posts);
  const savedPostIds = useFeedStore((s) => s.savedPostIds);
  const [tab, setTab] = useState<Tab>("posts");

  const mine = feedOrder.filter((id) => posts[id].authorId === currentUser.id);
  const saved = feedOrder.filter((id) => savedPostIds.has(id));
  const list = tab === "posts" ? mine : saved;

  if (!signedIn) {
    return (
      <ScreenPanel>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <UserRound className="size-7" />
          </span>
          <div className="space-y-1">
            <p className="text-base font-semibold">
              Sign in to view your profile
            </p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Your posts, saved listings and activity live here once you sign
              in.
            </p>
          </div>
          <Button onClick={openSignIn} className="gap-2">
            Sign in
          </Button>
        </div>
      </ScreenPanel>
    );
  }

  return (
    <ScreenPanel>
      <div className="flex-1 overflow-y-auto">
        <div className="h-28 bg-gradient-to-r from-primary to-brand" />

        <div className="px-4 pb-4">
          <div className="-mt-11 flex items-end justify-between">
            <Avatar className="size-22 ring-4 ring-card">
              <AvatarImage src={currentUser.avatarUrl} alt="" />
              <AvatarFallback className="text-lg">
                {currentUser.name.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <Button onClick={() => open()} size="sm" className="gap-1.5">
              <PenSquare className="size-4" />
              Create post
            </Button>
          </div>

          <div className="mt-3">
            <h1 className="flex items-center gap-1 text-xl font-bold">
              {currentUser.name}
              {currentUser.verified && <VerifiedBadge />}
            </h1>
            <p className="text-sm text-muted-foreground">
              @{currentUser.handle}
            </p>
          </div>

          <p className="mt-3 text-sm">
            House hunting in Lagos 🏡 Sharing listings, market notes and the
            occasional rant about traffic.
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="size-4" />
              Lagos, Nigeria
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="size-4" />
              Joined 2024
            </span>
            <span className="capitalize">
              <UserTypeBadge type={currentUser.type} />
            </span>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm">
            <span>
              <span className="font-semibold">{mine.length}</span>{" "}
              <span className="text-muted-foreground">Posts</span>
            </span>
            <span>
              <span className="font-semibold">{saved.length}</span>{" "}
              <span className="text-muted-foreground">Saved</span>
            </span>
          </div>
        </div>

        <div role="tablist" className="sticky top-0 z-10 flex border-y bg-card">
          {(["posts", "saved"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={cn(
                "relative flex-1 py-3 text-sm font-medium capitalize transition-colors",
                tab === t
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-8 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <EmptyState
            icon={tab === "posts" ? PenSquare : Bookmark}
            title={tab === "posts" ? "No posts yet" : "Nothing saved yet"}
            description={
              tab === "posts"
                ? "Share a listing or an update  it'll show up here."
                : "Bookmark posts to find them here later."
            }
          />
        ) : (
          <div className="space-y-4 p-3 sm:p-4">
            {list.map((id, i) => (
              <PostCard key={id} postId={id} priority={i < 2} />
            ))}
          </div>
        )}
      </div>
    </ScreenPanel>
  );
}
