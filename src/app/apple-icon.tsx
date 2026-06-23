import { ImageResponse } from "next/og";

import { BRAND_COLOR, markDataUri } from "@/lib/brand-mark";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: BRAND_COLOR,
        }}
      >
        <img src={markDataUri()} width={104} height={104} alt="" />
      </div>
    ),
    size,
  );
}
