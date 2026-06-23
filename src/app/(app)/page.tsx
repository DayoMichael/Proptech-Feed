import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { FeedView } from "@/features/feed/views/feed-view";

export const metadata: Metadata = pageMetadata({
  title: "Property feed",
  description:
    "Browse the latest homes, apartments and properties for sale and rent across Nigeria, with photos, prices and locations in one fast feed.",
  path: "/",
});

export default function FeedPage() {
  return <FeedView />;
}
