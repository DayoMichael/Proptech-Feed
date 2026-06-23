import { ImageResponse } from "next/og";

import { OG_ALT, OG_SIZE, ogElement } from "@/lib/og";

export const alt = OG_ALT;
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(ogElement(), size);
}
