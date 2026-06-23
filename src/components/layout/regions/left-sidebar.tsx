"use client";

import { Plus } from "lucide-react";

import { sidebarNav } from "@/config/navigation";
import { useChatStore } from "@/store/chat-store";
import { useAuthStore } from "@/store/auth-store";
import { Button } from "@/components/ui/button";
import { NavLink } from "@/components/layout/navigation/nav-link";
import { NavBadge } from "@/components/layout/navigation/nav-badge";
import { FeedFilters } from "@/features/filters/components/feed-filters";
import { useComposer } from "@/providers/composer-provider";
import { useNavGuard } from "@/providers/auth-provider";

export function LeftSidebar() {
  const { open } = useComposer();
  const guard = useNavGuard();
  const signedIn = useAuthStore((s) => Boolean(s.user));
  const unread = useChatStore((s) =>
    Object.values(s.conversations).reduce((n, c) => n + c.unreadCount, 0),
  );
  const messages = signedIn ? unread : 0;

  return (
    <aside
      aria-label="Sections and filters"
      className="hidden w-60 shrink-0 lg:block"
    >
      <div className="sticky top-18 space-y-4">
        <nav aria-label="Sections" className="rounded-xl border bg-card p-2">
          <ul className="space-y-1">
            {sidebarNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  onClick={guard(item.href)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
                  activeClassName="bg-secondary text-foreground"
                  inactiveClassName="text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                >
                  <item.icon className="size-5 shrink-0" />
                  {item.label}
                  {item.href === "/messages" && (
                    <NavBadge count={messages} className="ml-auto" />
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <FeedFilters />

        <Button onClick={() => open()} className="w-full gap-2">
          <Plus className="size-4" />
          Create Post
        </Button>
      </div>
    </aside>
  );
}
