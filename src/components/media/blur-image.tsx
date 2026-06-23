"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface BlurImageProps {
  src: string;
  alt: string;
  sizes: string;
  quality?: number;
  priority?: boolean;
  blurDataURL?: string;
  className?: string;
}

/**
 * A `fill` image that stays blurred until the full image has loaded, then
 * fades in  instead of letting the real image paint progressively over a slow
 * connection. The blur is its own layer (a tiny embedded data URL) so there's
 * no extra request and zero layout shift.
 */
export function BlurImage({
  src,
  alt,
  sizes,
  quality,
  priority,
  blurDataURL,
  className,
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A cached image can already be complete before onLoad would fire.
  useEffect(() => {
    if (imgRef.current?.complete) {
      queueMicrotask(() => setLoaded(true));
    }
  }, []);

  return (
    <>
      {blurDataURL && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 scale-110 bg-cover bg-center blur-xl transition-opacity duration-500",
            loaded ? "opacity-0" : "opacity-100",
          )}
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      )}
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        quality={quality}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={cn(
          "object-cover transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className,
        )}
      />
    </>
  );
}
