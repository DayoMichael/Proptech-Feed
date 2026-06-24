"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

import type { VideoMedia } from "@/types";
import { isLocalUrl, mediaMaxWidth } from "@/lib/media";
import { clearActiveVideo, setActiveVideo } from "@/lib/video-manager";
import { BlurImage } from "@/components/media/blur-image";

const FEED_SIZES = "(min-width: 1024px) 600px, 100vw";

function formatDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MediaVideo({
  media,
  priority,
  dataSaver,
}: {
  media: VideoMedia;
  priority?: boolean;
  dataSaver?: boolean;
}) {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Stable identity so the single-video manager can match set/clear calls.
  const pauseSelf = useRef(() => videoRef.current?.pause());

  useEffect(() => {
    const el = videoRef.current;
    if (!started || !el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) el.pause();
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (started) void resume();
  }, [started]);

  async function resume() {
    const el = videoRef.current;
    if (!el) return;
    try {
      await el.play();
    } catch {
      try {
        el.load();
        await el.play();
      } catch {
      }
    }
  }

  function play() {
    if (!started) {
      setStarted(true);
      return;
    }
    void resume();
  }

  return (
    <div
      className="relative mx-auto w-full overflow-hidden rounded-xl border bg-surface-sunken"
      style={{
        aspectRatio: `${media.width} / ${media.height}`,
        maxWidth: mediaMaxWidth(media.width, media.height),
      }}
    >
      {started && (
        <video
          ref={videoRef}
          className="size-full object-cover"
          src={media.url}
          poster={media.poster}
          controls
          muted
          playsInline
          preload="none"
          onPlay={() => {
            setPlaying(true);
            setActiveVideo(pauseSelf.current);
          }}
          onPause={() => {
            setPlaying(false);
            clearActiveVideo(pauseSelf.current);
          }}
        />
      )}

      {!playing && (
        <button
          type="button"
          onClick={play}
          className="group absolute inset-0"
          aria-label={`Play video: ${media.alt}`}
        >
          {!started &&
            (isLocalUrl(media.poster) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={media.poster}
                alt={media.alt}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <BlurImage
                src={media.poster}
                alt={media.alt}
                sizes={FEED_SIZES}
                quality={dataSaver ? 35 : 72}
                priority={priority}
                blurDataURL={media.blurDataURL}
              />
            ))}
          <span className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="flex size-14 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur transition-transform group-hover:scale-105 group-active:scale-95">
              <Play className="size-7 translate-x-0.5 fill-current" />
            </span>
          </span>
          {!started && dataSaver && (
            <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white">
              Data Saver · tap to load
            </span>
          )}
          {!started && (
            <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white tabular-nums">
              {formatDuration(media.durationMs)}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
