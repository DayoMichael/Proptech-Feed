"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { isLocalUrl, mediaMaxWidth } from "@/lib/media";
import type { ImageMedia } from "@/types";
import { BlurImage } from "@/components/media/blur-image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const FEED_SIZES = "(min-width: 1024px) 600px, 100vw";

interface MediaCarouselProps {
  images: ImageMedia[];
  priority?: boolean;
  dataSaver?: boolean;
  onOpen?: (index: number) => void;
}

export function MediaCarousel({
  images,
  priority,
  dataSaver,
  onOpen,
}: MediaCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const first = images[0];

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div
      className="mx-auto"
      style={{ maxWidth: mediaMaxWidth(first.width, first.height) }}
    >
      <Carousel
        setApi={setApi}
        opts={{ align: "start" }}
        className="group relative w-full overflow-hidden rounded-xl border bg-surface-sunken"
        aria-roledescription="carousel"
        aria-label={`${images.length} photos`}
      >
      <div style={{ aspectRatio: `${first.width} / ${first.height}` }}>
        <CarouselContent className="ml-0 h-full">
          {images.map((image, i) => {
            // Only mount slides near the active one so we don't fetch every
            // photo up front; Data Saver narrows that to the current slide.
            const window = dataSaver ? 0 : 1;
            const nearby = Math.abs(i - current) <= window;
            return (
              <CarouselItem key={image.url} className="relative h-full pl-0">
                <button
                  type="button"
                  onClick={() => onOpen?.(i)}
                  aria-label="View image"
                  className="relative block size-full cursor-zoom-in"
                  style={{ aspectRatio: `${first.width} / ${first.height}` }}
                >
                  {isLocalUrl(image.url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : nearby ? (
                    <BlurImage
                      src={image.url}
                      alt={image.alt}
                      sizes={FEED_SIZES}
                      quality={dataSaver ? 35 : 72}
                      priority={priority && i === 0}
                      blurDataURL={image.blurDataURL}
                    />
                  ) : (
                    <div
                      aria-hidden
                      className="size-full bg-cover bg-center"
                      style={
                        image.blurDataURL
                          ? { backgroundImage: `url(${image.blurDataURL})` }
                          : undefined
                      }
                    />
                  )}
                </button>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </div>

      <span className="absolute right-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white tabular-nums">
        {current + 1}/{images.length}
      </span>

        <CarouselPrevious className="left-2 hidden border-none bg-black/45 text-white hover:bg-black/65 hover:text-white group-hover:flex disabled:opacity-0" />
        <CarouselNext className="right-2 hidden border-none bg-black/45 text-white hover:bg-black/65 hover:text-white group-hover:flex disabled:opacity-0" />
      </Carousel>

      <div className="mt-2 flex justify-center gap-0.5">
        {images.map((image, i) => (
          <button
            key={image.url}
            type="button"
            onClick={() => api?.scrollTo(i)}
            aria-label={`Go to image ${i + 1}`}
            aria-current={i === current}
            className="flex size-4 items-center justify-center"
          >
            <span
              className={cn(
                "size-1.5 rounded-full transition-colors",
                i === current ? "bg-primary" : "bg-border hover:bg-muted-foreground",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
