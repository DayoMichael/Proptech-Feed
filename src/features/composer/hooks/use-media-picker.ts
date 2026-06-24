"use client";

import { useCallback, useState } from "react";

import type { MediaItem } from "@/types";
import { probeVideo } from "@/lib/media-probe";
import { compressImage } from "@/lib/media/compress-image";

export interface PickedMedia {
  id: string;
  type: "image" | "video";
  url: string;
  poster?: string;
  width: number;
  height: number;
  name: string;
}

let seq = 0;

export function useMediaPicker() {
  const [picked, setPicked] = useState<PickedMedia[]>([]);

  const addFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      seq += 1;
      const id = `m_${seq}`;
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith("video");
      const base: PickedMedia = {
        id,
        type: isVideo ? "video" : "image",
        url,
        width: 16,
        height: 9,
        name: file.name,
      };
      setPicked((prev) => [...prev, base]);

      const apply = (patch: Partial<PickedMedia>) =>
        setPicked((prev) =>
          prev.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        );

      if (isVideo) {
        probeVideo(url).then(({ width, height, poster }) =>
          apply({ width, height, poster }),
        );
      } else {
        compressImage(file)
          .then((result) => {
            apply({
              url: result.url,
              width: result.width,
              height: result.height,
            });
            URL.revokeObjectURL(url);
          })
          .catch(() => {
          });
      }
    });
  }, []);

  const remove = useCallback((id: string) => {
    setPicked((prev) => {
      const target = prev.find((m) => m.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  const clear = useCallback(() => setPicked([]), []);

  const toMediaItems = useCallback(
    (): MediaItem[] =>
      picked.map((m) =>
        m.type === "video"
          ? {
              type: "video",
              url: m.url,
              poster: m.poster ?? "",
              width: m.width,
              height: m.height,
              durationMs: 0,
              alt: m.name,
            }
          : {
              type: "image",
              url: m.url,
              width: m.width,
              height: m.height,
              alt: m.name,
            },
      ),
    [picked],
  );

  return { picked, addFiles, remove, clear, toMediaItems };
}
