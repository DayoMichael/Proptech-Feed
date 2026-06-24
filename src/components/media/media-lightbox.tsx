"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import type { MediaItem } from "@/types";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface MediaLightboxProps {
  media: MediaItem[];
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const NAV_BTN =
  "absolute top-1/2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20 disabled:pointer-events-none disabled:opacity-0";

export function MediaLightbox({
  media,
  index,
  onIndexChange,
  onClose,
}: MediaLightboxProps) {
  const open = index !== null;
  const i = index ?? 0;
  const item = media[i];
  const hasMany = media.length > 1;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && i < media.length - 1) onIndexChange(i + 1);
      if (e.key === "ArrowLeft" && i > 0) onIndexChange(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, i, media.length, onIndexChange]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 left-0 top-0 z-50 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 items-center justify-center rounded-none border-0 bg-black/95 p-0 ring-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">Media viewer</DialogTitle>

        <DialogClose asChild>
          <button
            type="button"
            aria-label="Close"
            className="absolute left-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/20"
          >
            <X className="size-5" />
          </button>
        </DialogClose>

        <DialogClose className="absolute inset-0" aria-label="Close" tabIndex={-1} />

        <div className="relative z-10 flex max-h-dvh max-w-[96vw] items-center justify-center">
          {item?.type === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.url}
              alt={item.alt}
              width={item.width || undefined}
              height={item.height || undefined}
              className="max-h-[92dvh] w-auto max-w-[96vw] object-contain"
            />
          ) : item?.type === "video" ? (
            <video
              src={item.url}
              poster={item.poster || undefined}
              controls
              autoPlay
              playsInline
              className="max-h-[92dvh] w-auto max-w-[96vw]"
            />
          ) : null}
        </div>

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => onIndexChange(Math.max(i - 1, 0))}
              disabled={i === 0}
              aria-label="Previous"
              className={`${NAV_BTN} left-3`}
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              type="button"
              onClick={() => onIndexChange(Math.min(i + 1, media.length - 1))}
              disabled={i === media.length - 1}
              aria-label="Next"
              className={`${NAV_BTN} right-3`}
            >
              <ChevronRight className="size-6" />
            </button>
            <span className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white tabular-nums backdrop-blur">
              {i + 1} / {media.length}
            </span>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
