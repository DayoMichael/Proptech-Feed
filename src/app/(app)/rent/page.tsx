import type { Metadata } from "next";
import { KeyRound } from "lucide-react";

import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = pageMetadata({
  title: "Properties for rent",
  description:
    "Find homes and apartments for rent across Nigeria. Filter rentals by location, budget and listing type on Expert Listing.",
  path: "/rent",
});

export default function Page() {
  return (
    <PagePlaceholder
      icon={KeyRound}
      title="Rent"
      description="Rental listings will appear here as a filtered view of the feed."
    />
  );
}
