"use client";

import { useMemo, useState } from "react";
import { MapPin, Search as SearchIcon, SearchX } from "lucide-react";

import { useFeedStore } from "@/store/feed/feed-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserTypeBadge } from "@/features/posts/components/user-type-badge";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";
import { PostCard } from "@/features/posts/components/post-card";
import { EmptyState } from "@/components/empty-state";
import { ScreenPanel } from "@/components/screen-panel";
import { cn } from "@/lib/utils";
import { focusRing } from "@/motions";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
      {children}
    </h2>
  );
}

export function SearchView() {
  const feedOrder = useFeedStore((s) => s.feedOrder);
  const posts = useFeedStore((s) => s.posts);
  const users = useFeedStore((s) => s.users);
  const [query, setQuery] = useState("");

  const trending = useMemo(
    () =>
      [...new Set(Object.values(posts).map((p) => p.location).filter(Boolean))]
        .slice(0, 6)
        .map(String),
    [posts],
  );

  const q = query.trim().toLowerCase();

  const postResults = q
    ? feedOrder.filter((id) => {
        const p = posts[id];
        const u = users[p.authorId];
        return (
          p.text.toLowerCase().includes(q) ||
          (p.location ?? "").toLowerCase().includes(q) ||
          u?.name.toLowerCase().includes(q) ||
          u?.handle.toLowerCase().includes(q)
        );
      })
    : [];

  const peopleResults = q
    ? Object.values(users).filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.handle.toLowerCase().includes(q),
      )
    : [];

  const empty = q && postResults.length === 0 && peopleResults.length === 0;

  return (
    <ScreenPanel>
      <div className="shrink-0 border-b p-3">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            placeholder="Search posts, people, locations"
            aria-label="Search"
            className={cn(
              "h-11 w-full rounded-full border bg-surface-sunken pl-11 pr-4 text-base md:text-sm",
              focusRing,
            )}
          />
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4">
        {!q && (
          <section className="space-y-3">
            <SectionLabel>Trending locations</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {trending.map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setQuery(loc)}
                  className="flex items-center gap-1.5 rounded-full border bg-surface-sunken px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-ring/60 hover:text-foreground"
                >
                  <MapPin className="size-3.5 text-primary" />
                  {loc}
                </button>
              ))}
            </div>
          </section>
        )}

        {empty && (
          <EmptyState
            icon={SearchX}
            title={`No results for “${query.trim()}”`}
            description="Try a different keyword or location."
          />
        )}

        {peopleResults.length > 0 && (
          <section className="space-y-2">
            <SectionLabel>People</SectionLabel>
            <ul className="divide-y overflow-hidden rounded-xl border bg-surface-sunken/40">
              {peopleResults.map((u) => (
                <li key={u.id} className="flex items-center gap-3 px-4 py-3">
                  <Avatar className="size-11 shrink-0">
                    <AvatarImage src={u.avatarUrl} alt="" loading="lazy" />
                    <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1 font-semibold">
                      <span className="truncate">{u.name}</span>
                      {u.verified && <VerifiedBadge />}
                    </p>
                    <p className="text-xs text-muted-foreground">@{u.handle}</p>
                  </div>
                  <UserTypeBadge type={u.type} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {postResults.length > 0 && (
          <section className="space-y-2">
            <SectionLabel>Posts · {postResults.length}</SectionLabel>
            <div className="space-y-4">
              {postResults.map((id, i) => (
                <PostCard key={id} postId={id} priority={i < 2} />
              ))}
            </div>
          </section>
        )}
      </div>
    </ScreenPanel>
  );
}
