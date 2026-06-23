"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { iconPress } from "@/motions";
import { selectUnreadCount, useNotificationStore } from "@/store/notification-store";
import { useAuthStore } from "@/store/auth-store";
import { NavBadge } from "@/components/layout/navigation/nav-badge";

export function NotificationsBell({ className }: { className?: string }) {
  const signedIn = useAuthStore((s) => Boolean(s.user));
  const unread = useNotificationStore(selectUnreadCount);
  const count = signedIn ? unread : 0;
  return (
    <Link
      href="/notifications"
      aria-label={count > 0 ? `Notifications, ${count} unread` : "Notifications"}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted",
        iconPress,
        className,
      )}
    >
      <Bell className="size-5" />
      <NavBadge count={count} className="absolute -right-0.5 -top-0.5" />
    </Link>
  );
}
