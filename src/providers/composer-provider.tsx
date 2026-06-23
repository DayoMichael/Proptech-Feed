"use client";

import { createContext, useContext, useState } from "react";

import type { PostCategory } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PostComposerForm } from "@/features/composer/components/post-composer-form";
import { useAuth } from "@/providers/auth-provider";

type ComposerTab = PostCategory | "request";

interface ComposerContextValue {
  open: (tab?: ComposerTab) => void;
}

const ComposerContext = createContext<ComposerContextValue | null>(null);

export function useComposer(): ComposerContextValue {
  const ctx = useContext(ComposerContext);
  if (!ctx) throw new Error("useComposer must be used within ComposerProvider");
  return ctx;
}

export function ComposerProvider({ children }: { children: React.ReactNode }) {
  const { requireAuth } = useAuth();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<ComposerTab>("general");

  const openComposer = (t: ComposerTab = "general") => {
    requireAuth(() => {
      setTab(t);
      setOpen(true);
    });
  };

  return (
    <ComposerContext.Provider value={{ open: openComposer }}>
      {children}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 bg-card p-0 shadow-2xl shadow-black/40 ring-1 ring-border sm:max-w-xl">
          <DialogHeader className="px-5 py-4">
            <DialogTitle className="text-[0.9375rem]">Create post</DialogTitle>
          </DialogHeader>
          {open && (
            <PostComposerForm
              initialTab={tab}
              onDone={() => setOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </ComposerContext.Provider>
  );
}
