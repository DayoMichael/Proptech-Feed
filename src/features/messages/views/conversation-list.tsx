"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MailPlus, Search, SquarePen } from "lucide-react";

import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/format";
import { currentUser, users } from "@/lib/mock/data";
import { onlineUserIds } from "@/lib/mock/chat";
import { useChatStore } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";
import { EmptyState } from "@/components/empty-state";

export function ConversationList() {
  const order = useChatStore((s) => s.conversationOrder);
  const conversations = useChatStore((s) => s.conversations);
  const messages = useChatStore((s) => s.messages);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return order;
    return order.filter((id) =>
      users[conversations[id].participantId]?.name.toLowerCase().includes(q),
    );
  }, [order, conversations, query]);

  return (
    <div className="-mx-3 -mb-6 -mt-4 flex h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] flex-col overflow-hidden border-0 bg-card sm:-mx-4 lg:mx-0 lg:my-0 lg:h-[calc(100dvh-6.5rem)] lg:rounded-xl lg:border">
      <header className="flex shrink-0 items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">Messages</h1>
        <button
          type="button"
          aria-label="New message"
          className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <SquarePen className="size-5" />
        </button>
      </header>

      <div className="shrink-0 border-b px-3 pb-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search messages"
            aria-label="Search messages"
            className="h-10 w-full rounded-full border bg-surface-sunken pl-10 pr-4 text-base outline-none focus:border-ring md:text-sm"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <EmptyState
            icon={MailPlus}
            title={query ? "No matches" : "No messages yet"}
            description={
              query
                ? "Try a different name."
                : "Reply to a story or message an agent to start a conversation."
            }
          />
        </div>
      ) : (
        <ul className="flex-1 overflow-y-auto p-1.5">
          {filtered.map((id) => {
            const conversation = conversations[id];
            const user = users[conversation.participantId];
            const last = conversation.lastMessageId
              ? messages[conversation.lastMessageId]
              : undefined;
            const unread = conversation.unreadCount > 0;

            return (
              <li key={id}>
                <Link
                  href={`/messages/${id}`}
                  className="flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-secondary/50"
                >
                  <span className="relative shrink-0">
                    <Avatar className="size-14">
                      <AvatarImage src={user.avatarUrl} alt="" loading="lazy" />
                      <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    {onlineUserIds.has(user.id) && (
                      <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-card bg-primary" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-1">
                      <span className="flex min-w-0 items-center gap-1">
                        <span className="truncate font-semibold">{user.name}</span>
                        {user.verified && <VerifiedBadge />}
                      </span>
                      {last && (
                        <span
                          className={cn(
                            "ml-auto shrink-0 text-xs",
                            unread
                              ? "font-semibold text-primary"
                              : "text-muted-foreground",
                          )}
                        >
                          {relativeTime(last.createdAt)}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <p
                        className={cn(
                          "min-w-0 flex-1 truncate text-sm",
                          unread
                            ? "font-medium text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {last?.senderId === currentUser.id && "You: "}
                        {last?.storyReply && "Replied to story · "}
                        {last?.text}
                      </p>
                      {unread && (
                        <span className="size-2.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
