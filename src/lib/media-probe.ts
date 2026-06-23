import type { MediaItem } from "@/types";

import { compressImage } from "./media/compress-image";

export function probeImage(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 16, height: 9 });
    img.src = url;
  });
}

export function probeVideo(
  url: string,
): Promise<{ width: number; height: number; poster: string }> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.src = url;
    const done = (poster: string) =>
      resolve({
        width: video.videoWidth || 16,
        height: video.videoHeight || 9,
        poster,
      });
    video.onloadeddata = () => {
      video.currentTime = Math.min(0.1, video.duration || 0);
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas
          .getContext("2d")
          ?.drawImage(video, 0, 0, canvas.width, canvas.height);
        done(canvas.toDataURL("image/jpeg", 0.6));
      } catch {
        done("");
      }
    };
    video.onerror = () => done("");
  });
}

/** Turn a picked File into a renderable MediaItem (with captured dimensions). */
export async function fileToMediaItem(file: File): Promise<MediaItem> {
  if (file.type.startsWith("video")) {
    const url = URL.createObjectURL(file);
    const { width, height, poster } = await probeVideo(url);
    return { type: "video", url, poster, width, height, durationMs: 0, alt: file.name };
  }
  const { url, width, height } = await compressImage(file);
  return { type: "image", url, width, height, alt: file.name };
}
