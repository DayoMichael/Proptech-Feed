"use client";

import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { currentUser, users } from "@/lib/mock/data";
import { fileToMediaItem } from "@/lib/media-probe";
import { useFeedStore } from "@/store/feed/feed-store";
import { useAuthStore } from "@/store/auth-store";
import type { Story } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StoryViewer } from "@/features/stories/components/story-viewer";
import { useScrollOverflow } from "@/hooks/use-scroll-overflow";

interface OpenState {
  list: Story[];
  index: number;
}

export function StoriesRail() {
  const stories = useFeedStore((s) => s.stories);
  const seenStories = useFeedStore((s) => s.seenStories);
  const addStory = useFeedStore((s) => s.addStory);
  const signedIn = useAuthStore((s) => Boolean(s.user));

  const [open, setOpen] = useState<OpenState | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { ref: railRef, canScrollLeft, canScrollRight } =
    useScrollOverflow<HTMLUListElement>([stories.length]);

  const myStory = stories.find((s) => s.userId === currentUser.id) ?? null;

  const others = useMemo(() => {
    const list = stories.filter((s) => s.userId !== currentUser.id);
    return [...list].sort(
      (a, b) => Number(seenStories.has(a.id)) - Number(seenStories.has(b.id)),
    );
  }, [stories, seenStories]);

  function scrollByRail(direction: 1 | -1) {
    railRef.current?.scrollBy({
      left: railRef.current.clientWidth * 0.8 * direction,
      behavior: "smooth",
    });
  }

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      addStory(await fileToMediaItem(file));
    }
  }

  return (
    <section aria-label="Stories" className="relative -mx-3 sm:mx-0">
      <ul
        ref={railRef}
        className="flex gap-3 overflow-x-auto px-3 pb-1 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {signedIn && (
        <li>
          <div className="flex w-16 shrink-0 flex-col items-center gap-1.5">
            <span className="relative">
              <button
                type="button"
                onClick={() =>
                  myStory
                    ? setOpen({ list: [myStory], index: 0 })
                    : fileRef.current?.click()
                }
                aria-label={myStory ? "View your story" : "Add to your story"}
                className={cn(
                  "block rounded-full p-[2px]",
                  myStory && !seenStories.has(myStory.id)
                    ? "bg-gradient-to-tr from-primary to-brand"
                    : "bg-transparent",
                )}
              >
                <Avatar className="size-14 border-2 border-card">
                  <AvatarImage src={currentUser.avatarUrl} alt="" />
                  <AvatarFallback className="text-xs">You</AvatarFallback>
                </Avatar>
              </button>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                aria-label="Add to your story"
                className="absolute bottom-0 right-0 flex size-5 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground"
              >
                <Plus className="size-3" />
              </button>
            </span>
            <span className="text-[0.625rem] text-muted-foreground">Your story</span>
          </div>
        </li>
        )}

        {others.map((story, i) => {
          const user = users[story.userId];
          return (
            <li key={story.id}>
              <button
                type="button"
                onClick={() => setOpen({ list: others, index: i })}
                aria-label={`View ${user.name}'s story`}
                className="flex w-16 shrink-0 flex-col items-center gap-1.5"
              >
                <span
                  className={cn(
                    "rounded-full p-[2px]",
                    seenStories.has(story.id)
                      ? "bg-border"
                      : "bg-gradient-to-tr from-primary to-brand",
                  )}
                >
                  <Avatar className="size-14 border-2 border-card">
                    <AvatarImage src={user.avatarUrl} alt="" loading="lazy" />
                    <AvatarFallback className="text-xs">
                      {user.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                </span>
                <span className="max-w-full truncate text-[0.625rem] text-muted-foreground">
                  {user.name.split(" ")[0]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {canScrollLeft && (
        <div className="pointer-events-none absolute left-0 top-0 hidden h-14 items-center pl-1 pr-8 sm:flex bg-gradient-to-r from-background to-transparent">
          <button
            type="button"
            onClick={() => scrollByRail(-1)}
            aria-label="Scroll stories left"
            className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-4" />
          </button>
        </div>
      )}

      {canScrollRight && (
        <div className="pointer-events-none absolute right-0 top-0 hidden h-14 items-center pl-8 pr-1 sm:flex bg-gradient-to-l from-background to-transparent">
          <button
            type="button"
            onClick={() => scrollByRail(1)}
            aria-label="Scroll stories right"
            className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:bg-secondary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {open && (
        <StoryViewer
          stories={open.list}
          startIndex={open.index}
          onClose={() => setOpen(null)}
        />
      )}
    </section>
  );
}
