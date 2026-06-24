"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  MessageCircle,
  SendHorizontal,
  Video,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { MediaItem, Message } from "@/types";
import { currentUser, users } from "@/lib/mock/data";
import { onlineUserIds } from "@/lib/mock/chat";
import { useChatStore } from "@/store/chat-store";
import { useMediaPicker } from "@/features/composer/hooks/use-media-picker";
import { MediaLightbox } from "@/components/media/media-lightbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";
import { EmptyState } from "@/components/empty-state";
import { MessageStatus, TypingDots } from "@/features/messages/components/message-status";
import { focusRing } from "@/motions";

const STATUS_LABEL: Record<string, string> = {
  sending: "Sending…",
  sent: "Sent",
  delivered: "Delivered",
  seen: "Seen",
};

const GAP_MS = 20 * 60_000;

function clockTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function storyReplyLabel(
  reply: NonNullable<Message["storyReply"]>,
  mine: boolean,
): string {
  if (reply.authorId === currentUser.id) return "Replied to your story";
  const name = users[reply.authorId]?.name.split(" ")[0] ?? "their";
  return `${mine ? "You replied to" : "Replied to"} ${name}'s story`;
}

export function ChatView({ conversationId }: { conversationId: string }) {
  const conversation = useChatStore((s) => s.conversations[conversationId]);
  const messages = useChatStore((s) => s.messages);
  const messageIds = useChatStore(
    (s) => s.messagesByConversation[conversationId],
  );
  const typing = useChatStore((s) => s.typing[conversationId]);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const markRead = useChatStore((s) => s.markConversationRead);

  const [text, setText] = useState("");
  const { picked, addFiles, remove, clear, toMediaItems } = useMediaPicker();
  const imageInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<{
    media: MediaItem[];
    index: number;
  } | null>(null);

  const ids = messageIds ?? [];
  const canSend = text.trim().length > 0 || picked.length > 0;

  useEffect(() => {
    markRead(conversationId);
  }, [conversationId, ids.length, markRead]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [ids.length, typing]);

  if (!conversation) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Conversation not found"
        description="This thread may have been removed."
        className="rounded-xl border bg-card"
      />
    );
  }

  const peer = users[conversation.participantId];
  const online = onlineUserIds.has(peer.id);
  const lastMineId = [...ids].reverse().find((id) => messages[id].senderId === currentUser.id);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    sendMessage(conversationId, text, undefined, toMediaItems());
    setText("");
    clear();
  }

  return (
    <div className="-mx-3 -mb-6 -mt-4 flex h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] flex-col overflow-hidden border-0 bg-card sm:-mx-4 lg:mx-0 lg:my-0 lg:h-[calc(100dvh-6.5rem)] lg:rounded-xl lg:border">
      <div className="flex items-center gap-3 border-b px-3 py-2.5 sm:px-4">
        <Link
          href="/messages"
          aria-label="Back to messages"
          className="-ml-1 flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <span className="relative shrink-0">
          <Avatar className="size-10">
            <AvatarImage src={peer.avatarUrl} alt="" />
            <AvatarFallback className="text-xs">
              {peer.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          {online && (
            <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-card bg-primary" />
          )}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <span className="truncate font-semibold leading-tight">
              {peer.name}
            </span>
            {peer.verified && <VerifiedBadge />}
          </div>
          <span
            className={cn(
              "text-xs",
              typing ? "text-primary" : "text-muted-foreground",
            )}
          >
            {typing ? "typing…" : online ? "Active now" : `@${peer.handle}`}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        {ids.map((id, i) => {
          const message = messages[id];
          const mine = message.senderId === currentUser.id;
          const prev = i > 0 ? messages[ids[i - 1]] : undefined;
          const next = ids[i + 1] ? messages[ids[i + 1]] : undefined;
          const firstInRun = !prev || prev.senderId !== message.senderId;
          const lastInRun = !next || next.senderId !== message.senderId;
          const showTime =
            !prev ||
            +new Date(message.createdAt) - +new Date(prev.createdAt) > GAP_MS;

          return (
            <div key={id}>
              {showTime && (
                <div className="py-3 text-center text-[0.6875rem] font-medium text-muted-foreground">
                  {clockTime(message.createdAt)}
                </div>
              )}
              {message.storyReply && (
                <div
                  className={cn(
                    "mb-1 mt-2 flex items-end gap-2 first:mt-0",
                    mine ? "justify-end" : "justify-start",
                  )}
                >
                  <span className="text-[0.6875rem] text-muted-foreground">
                    {storyReplyLabel(message.storyReply, mine)}
                  </span>
                  <div className="h-12 w-8 shrink-0 overflow-hidden rounded-md border border-border bg-surface-sunken">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={message.storyReply.thumbnailUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  </div>
                </div>
              )}
              <div
                className={cn(
                  "flex",
                  mine ? "justify-end" : "justify-start",
                  message.storyReply
                    ? "mt-0"
                    : firstInRun
                      ? "mt-2 first:mt-0"
                      : "mt-0.5",
                )}
              >
                <div
                  className={cn(
                    "max-w-[78%] overflow-hidden shadow-sm",
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                    mine
                      ? lastInRun
                        ? "rounded-2xl rounded-br-md"
                        : "rounded-2xl"
                      : lastInRun
                        ? "rounded-2xl rounded-bl-md"
                        : "rounded-2xl",
                  )}
                >
                  {message.media && message.media.length > 0 && (
                    <ChatMedia
                      media={message.media}
                      onOpen={(index) =>
                        setLightbox({ media: message.media!, index })
                      }
                    />
                  )}
                  {message.text && (
                    <p className="px-3.5 py-2 text-sm leading-snug">
                      {message.text}
                    </p>
                  )}
                </div>
              </div>
              {mine && id === lastMineId && (
                <div className="mt-1 flex items-center justify-end gap-1 pr-1 text-[0.625rem] text-muted-foreground">
                  <span>{STATUS_LABEL[message.status]}</span>
                  <MessageStatus status={message.status} />
                </div>
              )}
            </div>
          );
        })}

        {typing && (
          <div className="mt-2 flex justify-start">
            <div className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
              <TypingDots />
            </div>
          </div>
        )}

        <div ref={endRef} />
      </div>

      <form onSubmit={submit} className="border-t px-3 py-3 sm:px-4">
        {picked.length > 0 && (
          <ul className="mb-2 flex gap-2 overflow-x-auto pb-1">
            {picked.map((m) => (
              <li
                key={m.id}
                className="relative size-16 shrink-0 overflow-hidden rounded-lg border bg-surface-sunken"
              >
                {m.type === "video" ? (
                  <video src={m.url} muted className="size-full object-cover" />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.name} className="size-full object-cover" />
                )}
                <button
                  type="button"
                  onClick={() => remove(m.id)}
                  aria-label="Remove attachment"
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black/80"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => imageInput.current?.click()}
            aria-label="Add photo"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
          >
            <ImagePlus className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => videoInput.current?.click()}
            aria-label="Add video"
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10"
          >
            <Video className="size-5" />
          </button>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Message ${peer.name.split(" ")[0]}…`}
            aria-label="Message"
            className={cn(
              "h-11 min-w-0 flex-1 rounded-full border bg-surface-sunken px-4 text-base md:text-sm",
              focusRing,
            )}
          />
          <button
            type="submit"
            disabled={!canSend}
            aria-label="Send message"
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:brightness-105 active:scale-95 disabled:scale-100 disabled:opacity-40"
          >
            <SendHorizontal className="size-5" />
          </button>
        </div>

        <input
          ref={imageInput}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={videoInput}
          type="file"
          accept="video/*"
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </form>

      <MediaLightbox
        media={lightbox?.media ?? []}
        index={lightbox ? lightbox.index : null}
        onIndexChange={(index) =>
          setLightbox((prev) => (prev ? { ...prev, index } : prev))
        }
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}

function ChatMedia({
  media,
  onOpen,
}: {
  media: NonNullable<Message["media"]>;
  onOpen: (index: number) => void;
}) {
  // A single attachment keeps its own aspect ratio (capped) so the bubble wraps
  // it tightly; multiple attachments tile as uniform squares.
  if (media.length === 1) {
    const item = media[0];
    return item.type === "video" ? (
      <video
        src={item.url}
        poster={item.poster || undefined}
        controls
        playsInline
        muted
        className="max-h-80 w-64 max-w-full bg-black object-contain"
      />
    ) : (
      <button
        type="button"
        onClick={() => onOpen(0)}
        aria-label="View image"
        className="block"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt={item.alt}
          className="max-h-80 w-auto max-w-64 object-contain"
        />
      </button>
    );
  }

  return (
    <div className="grid w-64 grid-cols-2 gap-0.5">
      {media.map((item, i) =>
        item.type === "video" ? (
          <video
            key={i}
            src={item.url}
            poster={item.poster || undefined}
            controls
            playsInline
            muted
            className="aspect-square w-full bg-black object-cover"
          />
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => onOpen(i)}
            aria-label="View image"
            className="block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.url}
              alt={item.alt}
              className="aspect-square w-full object-cover"
            />
          </button>
        ),
      )}
    </div>
  );
}
