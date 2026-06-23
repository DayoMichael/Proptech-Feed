"use client";

import { MapPin } from "lucide-react";

import { currentUser } from "@/lib/mock/data";
import { useAuthStore } from "@/store/auth-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useComposer } from "@/providers/composer-provider";

const TABS = [
  { id: "property", label: "Property" },
  { id: "general", label: "General" },
  { id: "request", label: "Request" },
] as const;

export function FeedComposer() {
  const { open } = useComposer();
  const signedIn = useAuthStore((s) => Boolean(s.user));

  if (!signedIn) return null;

  return (
    <section aria-label="Create a post" className="rounded-xl border bg-card">
      <div className="flex border-b px-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => open(id)}
            className="px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {label}
          </button>
        ))}
      </div>

      <div className="p-3">
        <div className="flex items-center gap-1">
          <Avatar className="size-9 shrink-0">
            <AvatarImage src={currentUser.avatarUrl} alt="" />
            <AvatarFallback className="text-xs">
              {currentUser.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => open()}
            className="flex h-9 flex-1 items-center truncate rounded-full bg-surface-sunken px-2 text-left text-sm text-muted-foreground"
          >
            Share an update, ask a question, say hi…
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between pt-3">
          <div className="flex gap-1 text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => open()}
            >
              <MapPin className="size-4" />
              Location
            </Button>
          </div>
          <Button
            type="button"
            size="sm"
            className="gap-1.5 rounded-full p-4"
            onClick={() => open()}
          >
            Post
          </Button>
        </div>
      </div>
    </section>
  );
}
