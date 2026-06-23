"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { bottomNav } from "@/config/navigation";
import { press } from "@/motions";
import {
  selectUnreadCount,
  useNotificationStore,
} from "@/store/notification-store";
import { useAuthStore } from "@/store/auth-store";
import { useIsActive } from "@/components/layout/navigation/nav-link";
import { useNavGuard } from "@/providers/auth-provider";
import { NavBadge } from "@/components/layout/navigation/nav-badge";

function BottomNavItem({
  href,
  label,
  icon: Icon,
}: (typeof bottomNav)[number]) {
  const active = useIsActive(href);
  const signedIn = useAuthStore((s) => Boolean(s.user));
  const guard = useNavGuard();
  const notifications = useNotificationStore(selectUnreadCount);
  const count = signedIn && href === "/notifications" ? notifications : 0;

  return (
    <Link
      href={href}
      onClick={guard(href)}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[0.625rem] font-medium transition-colors",
        press,
        active ? "text-primary" : "text-muted-foreground",
      )}
    >
      <span className="relative">
        <Icon
          className={cn(
            "size-5 transition-transform",
            active && "motion-safe:-translate-y-px",
          )}
          aria-hidden
        />
        <NavBadge count={count} className="absolute -right-2 -top-1.5" />
      </span>
      {label}
    </Link>
  );
}

export function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="z-40 shrink-0 border-t bg-card lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch">
        {bottomNav.map((item) => (
          <li key={item.href} className="flex flex-1">
            <BottomNavItem {...item} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
