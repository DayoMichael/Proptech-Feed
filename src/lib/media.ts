export function isLocalUrl(url: string): boolean {
  return url.startsWith("blob:") || url.startsWith("data:");
}

export const MEDIA_MAX_HEIGHT = "min(510px, 78vh)";

export function mediaMaxWidth(width: number, height: number): string {
  return `calc(${MEDIA_MAX_HEIGHT} * ${width} / ${height})`;
}
