import type { Metadata } from "next";
import { BedDouble } from "lucide-react";

import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = pageMetadata({
  title: "Shortlet apartments",
  description:
    "Discover short-let apartments and serviced stays across Nigeria, bookable by the night or week, on Expert Listing.",
  path: "/shortlets",
});

export default function Page() {
  return (
    <PagePlaceholder
      icon={BedDouble}
      title="Shortlets"
      description="Short-let stays will appear here as a filtered view of the feed."
    />
  );
}
