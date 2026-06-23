"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { compactNumber } from "@/lib/format";
import { COMMUNITIES, useCommunityStore } from "@/store/community-store";
import { Button } from "@/components/ui/button";
import { ScreenPanel } from "@/components/screen-panel";
import { useAuth } from "@/providers/auth-provider";

export function CommunitiesView() {
  const joined = useCommunityStore((s) => s.joined);
  const toggleJoin = useCommunityStore((s) => s.toggleJoin);
  const { requireAuth } = useAuth();

  return (
    <ScreenPanel>
      <header className="shrink-0 border-b px-4 py-3">
        <h1 className="text-xl font-bold tracking-tight">Communities</h1>
        <p className="text-sm text-muted-foreground">
          Join groups to follow listings and conversations
        </p>
      </header>

      <ul className="flex-1 divide-y overflow-y-auto">
        {COMMUNITIES.map((c) => {
          const isJoined = joined.has(c.id);
          return (
            <li key={c.id} className="flex items-center gap-3 px-4 py-3">
              <Image
                src={c.imageUrl}
                alt=""
                width={48}
                height={48}
                className="size-12 shrink-0 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {c.blurb}
                </p>
                <p className="text-xs text-muted-foreground">
                  {compactNumber(c.members)} members
                </p>
              </div>
              <Button
                size="sm"
                variant={isJoined ? "secondary" : "default"}
                onClick={() => requireAuth(() => toggleJoin(c.id))}
                className={cn("shrink-0 rounded-full", isJoined && "px-4")}
              >
                {isJoined ? "Joined" : "Join"}
              </Button>
            </li>
          );
        })}
      </ul>
    </ScreenPanel>
  );
}
