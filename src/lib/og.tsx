import { BRAND_COLOR, markDataUri } from "@/lib/brand-mark";
import { SITE_NAME } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "Expert Listing — Real estate listings, simplified.";

/** Shared 1200×630 social card used by the OG and Twitter image routes. */
export function ogElement() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: `linear-gradient(135deg, ${BRAND_COLOR} 0%, #25774f 100%)`,
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={markDataUri()} width={64} height={64} alt="" />
        <span style={{ fontSize: 40, fontWeight: 700 }}>{SITE_NAME}</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <span style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
          Real estate listings, simplified.
        </span>
        <span style={{ fontSize: 34, opacity: 0.9 }}>
          Browse homes, apartments and properties for sale and rent.
        </span>
      </div>
    </div>
  );
}
