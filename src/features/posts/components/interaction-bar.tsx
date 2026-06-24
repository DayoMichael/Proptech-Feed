"use client";

import { useState } from "react";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { compactNumber } from "@/lib/format";
import { useFeedStore } from "@/store/feed/feed-store";
import { press } from "@/motions";
import { useAuth } from "@/providers/auth-provider";

interface InteractionBarProps {
  postId: string;
  onComment?: () => void;
}

export function InteractionBar({ postId, onComment }: InteractionBarProps) {
  const post = useFeedStore((s) => s.posts[postId]);
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const toggleSave = useFeedStore((s) => s.toggleSave);
  const { requireAuth } = useAuth();
  const [shared, setShared] = useState(false);

  if (!post) return null;

  async function share() {
    const url = `${window.location.origin}/?post=${postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Expert Listing", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      window.setTimeout(() => setShared(false), 1500);
    } catch {
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <ActionButton
          label={post.likedByMe ? "Unlike" : "Like"}
          active={post.likedByMe}
          activeClassName="text-like"
          onClick={() => requireAuth(() => toggleLike(postId))}
          count={post.likeCount}
        >
          <Heart
        className={cn(
          "size-5 transition-transform",
          post.likedByMe && "fill-current motion-safe:animate-in motion-safe:zoom-in-50",
        )}
      />
        </ActionButton>

        <ActionButton
          label="Comment"
          onClick={onComment}
          count={post.commentCount}
        >
          <MessageCircle className="size-5" />
        </ActionButton>

        <ActionButton
          label={shared ? "Link copied" : "Share"}
          onClick={share}
          count={post.shareCount}
        >
          <Share2 className={cn("size-5", shared && "text-primary")} />
        </ActionButton>
      </div>

      <ActionButton
        label={post.savedByMe ? "Remove bookmark" : "Save"}
        active={post.savedByMe}
        activeClassName="text-primary"
        onClick={() => requireAuth(() => toggleSave(postId))}
        count={post.bookmarkCount}
      >
        <Bookmark className={cn("size-5", post.savedByMe && "fill-current")} />
      </ActionButton>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  count?: number;
  active?: boolean;
  activeClassName?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

function ActionButton({
  label,
  count,
  active,
  activeClassName,
  onClick,
  children,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 rounded-full px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground",
        press,
        active && activeClassName,
      )}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className="tabular-nums">{compactNumber(count)}</span>
      )}
    </button>
  );
}
