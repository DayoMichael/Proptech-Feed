"use client";

import { Plus } from "lucide-react";

import { useComposer } from "@/providers/composer-provider";

export function CreatePostFab() {
  const { open } = useComposer();
  return (
    <button
      type="button"
      onClick={() => open()}
      aria-label="Create post"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+4.5rem)] right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-95 lg:hidden"
    >
      <Plus className="size-6" />
    </button>
  );
}
