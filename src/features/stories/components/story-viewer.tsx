"use client";

import { useEffect, useRef, useState } from "react";
import { Heart, Send, Share2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/format";
import { isLocalUrl } from "@/lib/media";
import { useFeedStore } from "@/store/feed/feed-store";
import { useChatStore } from "@/store/chat-store";
import type { Story } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";
import { BlurImage } from "@/components/media/blur-image";
import { useStoryPlayer } from "@/features/stories/hooks/use-story-player";

const TAP_MS = 250;

export function StoryViewer({
  stories,
  startIndex,
  onClose,
}: {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}) {
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 left-0 top-0 z-50 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center rounded-none border-0 bg-black p-0 ring-0 sm:max-w-none"
      >
        <StoryStage stories={stories} startIndex={startIndex} onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}

function StoryStage({
  stories,
  startIndex,
  onClose,
}: {
  stories: Story[];
  startIndex: number;
  onClose: () => void;
}) {
  const users = useFeedStore((s) => s.users);
  const markStorySeen = useFeedStore((s) => s.markStorySeen);
  const player = useStoryPlayer(stories, startIndex, onClose);
  const { story, segIndex, progress, paused, next, prev, setPaused } = player;

  const segment = story.segments[segIndex];
  const author = users[story.userId];
  const videoRef = useRef<HTMLVideoElement>(null);
  const pressRef = useRef<{ t: number; x: number } | null>(null);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const sendMessageToUser = useChatStore((s) => s.sendMessageToUser);

  useEffect(() => {
    markStorySeen(story.id);
  }, [story.id, markStorySeen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  // Keep the video element in sync with the paused state.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (paused) el.pause();
    else void el.play().catch(() => {});
  }, [paused, segIndex, story.id]);

  function onPointerDown(e: React.PointerEvent) {
    pressRef.current = { t: e.timeStamp, x: e.clientX };
    setPaused(true);
  }

  function onPointerUp(e: React.PointerEvent) {
    const press = pressRef.current;
    pressRef.current = null;
    setPaused(false);
    if (!press) return;
    if (e.timeStamp - press.t < TAP_MS) {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      if (ratio < 0.33) prev();
      else next();
    }
  }

  function cancelPress() {
    if (pressRef.current) {
      pressRef.current = null;
      setPaused(false);
    }
  }

  const isLiked = liked.has(segment.id);

  function toggleLike() {
    setLiked((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(segment.id)) nextSet.delete(segment.id);
      else nextSet.add(segment.id);
      return nextSet;
    });
  }

  return (
    <div className="relative mx-auto flex h-full w-full max-w-[440px] flex-col">
      {/* Progress bars */}
      <div className="absolute inset-x-0 top-0 z-20 flex gap-1 px-3 pt-3">
        {story.segments.map((s, i) => (
          <span
            key={s.id}
            className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
          >
            <span
              className="block h-full bg-white"
              style={{
                width:
                  i < segIndex ? "100%" : i === segIndex ? `${progress * 100}%` : "0%",
                transition: i === segIndex ? "none" : undefined,
              }}
            />
          </span>
        ))}
      </div>

      {/* Header */}
      <div className="absolute inset-x-0 top-0 z-20 flex items-center gap-2 px-3 pb-3 pt-6">
        <Avatar className="size-8 ring-2 ring-white/70">
          <AvatarImage src={author?.avatarUrl} alt="" />
          <AvatarFallback className="text-xs">
            {author?.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <span className="flex items-center gap-1 text-sm font-semibold text-white drop-shadow">
          {author?.name}
          {author?.verified && <VerifiedBadge />}
        </span>
        <span className="text-xs text-white/70 drop-shadow">
          {relativeTime(segment.createdAt)}
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close stories"
          className="ml-auto flex size-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Media + tap zones */}
      <div
        className="relative flex-1 touch-none select-none"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={cancelPress}
        onPointerCancel={cancelPress}
      >
        {segment.media.type === "video" ? (
          <video
            key={segment.id}
            ref={videoRef}
            src={segment.media.url}
            poster={segment.media.poster}
            muted
            playsInline
            autoPlay
            className="absolute inset-0 size-full object-contain"
            onTimeUpdate={(e) => {
              const v = e.currentTarget;
              if (v.duration)
                player.reportProgress(Math.min(0.999, v.currentTime / v.duration));
            }}
            onEnded={() => next()}
          />
        ) : isLocalUrl(segment.media.url) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={segment.id}
            src={segment.media.url}
            alt={segment.media.alt}
            className="absolute inset-0 size-full object-contain"
          />
        ) : (
          <BlurImage
            key={segment.id}
            src={segment.media.url}
            alt={segment.media.alt}
            sizes="(min-width: 440px) 440px, 100vw"
            priority
            blurDataURL={segment.media.blurDataURL}
            className="object-contain"
          />
        )}
      </div>

      {sent && (
        <div className="pointer-events-none absolute inset-x-0 bottom-20 z-20 flex justify-center">
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            Sent · check Messages
          </span>
        </div>
      )}

      {/* Footer actions */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!message.trim()) return;
          // A story reply becomes a DM to the author (dummy socket handles it).
          sendMessageToUser(story.userId, message);
          setMessage("");
          setSent(true);
          window.setTimeout(() => setSent(false), 1800);
        }}
        className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-2 px-3 pb-4 pt-3"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          placeholder={`Reply to ${author?.name.split(" ")[0]}…`}
          aria-label="Send a message"
          className="h-10 flex-1 rounded-full border border-white/40 bg-transparent px-4 text-sm text-white outline-none placeholder:text-white/60 focus:border-white"
        />
        <button
          type="button"
          onClick={toggleLike}
          aria-label={isLiked ? "Unlike" : "Like"}
          aria-pressed={isLiked}
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
        >
          <Heart className={cn("size-6", isLiked && "fill-like text-like")} />
        </button>
        {message.trim() ? (
          <button
            type="submit"
            aria-label="Send message"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            <Send className="size-5" />
          </button>
        ) : (
          <button
            type="button"
            aria-label="Share story"
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15"
          >
            <Share2 className="size-5" />
          </button>
        )}
      </form>
    </div>
  );
}
