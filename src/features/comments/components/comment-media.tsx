"use client";

import { useState } from "react";

import type { MediaItem } from "@/types";
import { MediaLightbox } from "@/components/media/media-lightbox";

export function CommentMedia({ media }: { media?: MediaItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!media || media.length === 0) return null;

  return (
    <>
      <div className="mt-2 space-y-2">
        {media.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpenIndex(i)}
            aria-label={item.type === "video" ? "View video" : "View image"}
            className="flex w-full cursor-zoom-in justify-center"
          >
            {item.type === "image" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.url}
                alt={item.alt}
                className="max-h-80 w-auto max-w-full rounded-xl border object-contain"
              />
            ) : (
              <video
                src={item.url}
                playsInline
                muted
                className="max-h-80 w-auto max-w-full rounded-xl border bg-black object-contain"
              />
            )}
          </button>
        ))}
      </div>

      <MediaLightbox
        media={media}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
