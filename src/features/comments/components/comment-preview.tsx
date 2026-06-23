"use client";

import { useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";

import type { MediaItem } from "@/types";
import { MediaLightbox } from "@/components/media/media-lightbox";

export interface PreviewComment {
  id: string;
  handle: string;
  text: string;
  isMine?: boolean;
  media?: MediaItem[];
}

interface CommentPreviewProps {
  items: PreviewComment[];
  commentCount: number;
  postHref: string;
}

export function CommentPreview({
  items,
  commentCount,
  postHref,
}: CommentPreviewProps) {
  const [lightbox, setLightbox] = useState<{
    media: MediaItem[];
    index: number;
  } | null>(null);

  if (items.length === 0 && commentCount === 0) return null;

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="space-y-1.5">
          {item.text && (
            <Link
              href={`/comment/${item.id}`}
              className="line-clamp-2 block text-sm transition-opacity hover:opacity-80"
            >
              <span className="font-medium">
                {item.isMine ? "You" : item.handle}
              </span>{" "}
              <span className="text-muted-foreground">{item.text}</span>
            </Link>
          )}

          {item.media && item.media.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.media.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightbox({ media: item.media!, index: i })}
                  aria-label={m.type === "video" ? "View video" : "View image"}
                  className="relative size-16 cursor-zoom-in overflow-hidden rounded-lg border bg-surface-sunken"
                >
                  {m.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.url}
                      alt={m.alt}
                      className="size-full object-cover"
                    />
                  ) : (
                    <>
                      <video
                        src={m.url}
                        muted
                        className="size-full object-cover"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                        <Play className="size-4 fill-current" />
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {commentCount > items.length && (
        <Link
          href={postHref}
          className="block text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          View all {commentCount} comments
        </Link>
      )}

      <MediaLightbox
        media={lightbox?.media ?? []}
        index={lightbox?.index ?? null}
        onIndexChange={(i) =>
          setLightbox((prev) => (prev ? { ...prev, index: i } : prev))
        }
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}
