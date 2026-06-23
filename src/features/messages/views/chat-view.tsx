"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageCircle, SendHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { currentUser, users } from "@/lib/mock/data";
import { onlineUserIds } from "@/lib/mock/chat";
import { useChatStore } from "@/store/chat-store";
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
  const endRef = useRef<HTMLDivElement>(null);

  const ids = messageIds ?? [];

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
    if (!text.trim()) return;
    sendMessage(conversationId, text);
    setText("");
  }

  return (
    <div className="-mx-3 -mb-6 -mt-4 flex h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] flex-col overflow-hidden border-0 bg-card sm:-mx-4 lg:mx-0 lg:my-0 lg:h-[calc(100dvh-6.5rem)] lg:rounded-xl lg:border">
      {/* Header */}
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

      {/* Messages */}
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
              <div
                className={cn(
                  "flex",
                  mine ? "justify-end" : "justify-start",
                  firstInRun ? "mt-2 first:mt-0" : "mt-0.5",
                )}
              >
                <div
                  className={cn(
                    "max-w-[78%] px-3.5 py-2 text-sm leading-snug shadow-sm",
                    mine
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground",
                    // Rounded with a subtle tail on the last bubble of a run.
                    mine
                      ? lastInRun
                        ? "rounded-2xl rounded-br-md"
                        : "rounded-2xl"
                      : lastInRun
                        ? "rounded-2xl rounded-bl-md"
                        : "rounded-2xl",
                  )}
                >
                  {message.text}
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

      {/* Composer */}
      <form
        onSubmit={submit}
        className="flex items-center gap-2 border-t px-3 py-3 sm:px-4"
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Message ${peer.name.split(" ")[0]}…`}
          aria-label="Message"
          className={cn(
            "h-11 flex-1 rounded-full border bg-surface-sunken px-4 text-sm",
            focusRing,
          )}
        />
        <button
          type="submit"
          disabled={!text.trim()}
          aria-label="Send message"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-all hover:brightness-105 active:scale-95 disabled:scale-100 disabled:opacity-40"
        >
          <SendHorizontal className="size-5" />
        </button>
      </form>
    </div>
  );
}
