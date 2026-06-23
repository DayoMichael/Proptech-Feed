"use client";

import { useState } from "react";

import type { ImageMedia, MediaItem } from "@/types";
import { MediaImage } from "@/components/media/media-image";
import { MediaCarousel } from "@/components/media/media-carousel";
import { MediaVideo } from "@/components/media/media-video";
import { MediaLightbox } from "@/components/media/media-lightbox";

interface PostMediaProps {
  media: MediaItem[];
  priority?: boolean;
  dataSaver?: boolean;
}

export function PostMedia({ media, priority, dataSaver }: PostMediaProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (media.length === 0) return null;

  const first = media[0];
  const images = media.filter((m): m is ImageMedia => m.type === "image");

  return (
    <>
      {first.type === "video" ? (
        <MediaVideo media={first} priority={priority} dataSaver={dataSaver} />
      ) : images.length === 1 ? (
        <MediaImage
          media={images[0]}
          priority={priority}
          dataSaver={dataSaver}
          onOpen={() => setOpenIndex(0)}
        />
      ) : (
        <MediaCarousel
          images={images}
          priority={priority}
          dataSaver={dataSaver}
          onOpen={(i) => setOpenIndex(i)}
        />
      )}

      <MediaLightbox
        media={images}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
