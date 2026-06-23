import { ImageResponse } from "next/og";

import { BRAND_COLOR, markDataUri } from "@/lib/brand-mark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <img src={markDataUri()} width={19} height={19} alt="" />
      </div>
    ),
    size,
  );
}
