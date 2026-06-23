/** Locally-created media (mock upload) that next/image can't optimize. */
export function isLocalUrl(url: string): boolean {
  return url.startsWith("blob:") || url.startsWith("data:");
}

// Twitter caps in-feed media height so tall portraits don't dominate the
// timeline (their web cap is ~510px).
export const MEDIA_MAX_HEIGHT = "min(510px, 78vh)";

// Bound the width to whatever keeps the height within MEDIA_MAX_HEIGHT, so the
// full image always shows (no crop): the box keeps the image's exact ratio and
// just gets narrower for tall portraits. Deterministic → CLS stays 0.
export function mediaMaxWidth(width: number, height: number): string {
  return `calc(${MEDIA_MAX_HEIGHT} * ${width} / ${height})`;
}
