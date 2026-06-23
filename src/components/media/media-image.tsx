import { cn } from "@/lib/utils";
import { isLocalUrl, mediaMaxWidth } from "@/lib/media";
import type { ImageMedia } from "@/types";
import { BlurImage } from "@/components/media/blur-image";

const FEED_SIZES = "(min-width: 1024px) 600px, 100vw";

interface MediaImageProps {
  media: ImageMedia;
  priority?: boolean;
  dataSaver?: boolean;
  className?: string;
  onOpen?: () => void;
}

export function MediaImage({
  media,
  priority,
  dataSaver,
  className,
  onOpen,
}: MediaImageProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label="View image"
      className={cn(
        "relative mx-auto block w-full cursor-zoom-in overflow-hidden rounded-xl border bg-surface-sunken",
        className,
      )}
      style={{
        aspectRatio: `${media.width} / ${media.height}`,
        maxWidth: mediaMaxWidth(media.width, media.height),
      }}
    >
      {isLocalUrl(media.url) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={media.url}
          alt={media.alt}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <BlurImage
          src={media.url}
          alt={media.alt}
          sizes={FEED_SIZES}
          quality={dataSaver ? 35 : 72}
          priority={priority}
          blurDataURL={media.blurDataURL}
        />
      )}
    </button>
  );
}
