"use client";

import { AtSign, Heart, MessageCircle, Reply, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { relativeTime } from "@/lib/format";
import { users } from "@/lib/mock/data";
import {
  useNotificationStore,
  type NotificationItem,
  type NotificationKind,
} from "@/store/notification-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScreenPanel } from "@/components/screen-panel";

const ICON: Record<NotificationKind, { Icon: LucideIcon; className: string }> = {
  like: { Icon: Heart, className: "bg-like/15 text-like" },
  comment: { Icon: MessageCircle, className: "bg-primary/15 text-primary" },
  reply: { Icon: Reply, className: "bg-primary/15 text-primary" },
  follow: { Icon: UserPlus, className: "bg-primary/15 text-primary" },
  mention: { Icon: AtSign, className: "bg-amber-500/15 text-amber-500" },
};

function isoFor(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

function Row({
  n,
  onRead,
}: {
  n: NotificationItem;
  onRead: (id: string) => void;
}) {
  const user = users[n.userId];
  const { Icon, className } = ICON[n.kind];
  return (
    <li
      role="button"
      tabIndex={0}
      onClick={() => onRead(n.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onRead(n.id);
      }}
      className={cn(
        "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-secondary/40",
        !n.read && "bg-primary/5",
      )}
    >
      <span className="relative shrink-0">
        <Avatar className="size-11">
          <AvatarImage src={user.avatarUrl} alt="" loading="lazy" />
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full border-2 border-card",
            className,
          )}
        >
          <Icon className="size-3" />
        </span>
      </span>

      <p className="min-w-0 flex-1 text-sm leading-snug">
        <span className="font-semibold">{user.name}</span>{" "}
        <span className="text-muted-foreground">{n.text}</span>
      </p>

      <span className="shrink-0 text-xs text-muted-foreground">
        {relativeTime(isoFor(n.minutesAgo))}
      </span>
      {!n.read && <span className="size-2 shrink-0 rounded-full bg-primary" />}
    </li>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="bg-card px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </p>
  );
}

export function NotificationsView() {
  const items = useNotificationStore((s) => s.notifications);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);
  const unread = items.filter((n) => !n.read);
  const earlier = items.filter((n) => n.read);

  return (
    <ScreenPanel>
      <header className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">Notifications</h1>
        {unread.length > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="text-sm font-medium text-primary transition-colors hover:underline"
          >
            Mark all read
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        {unread.length > 0 && (
          <>
            <GroupLabel>New</GroupLabel>
            <ul className="divide-y">
              {unread.map((n) => (
                <Row key={n.id} n={n} onRead={markRead} />
              ))}
            </ul>
          </>
        )}
        {earlier.length > 0 && (
          <>
            <GroupLabel>Earlier</GroupLabel>
            <ul className="divide-y">
              {earlier.map((n) => (
                <Row key={n.id} n={n} onRead={markRead} />
              ))}
            </ul>
          </>
        )}
      </div>
    </ScreenPanel>
  );
}
