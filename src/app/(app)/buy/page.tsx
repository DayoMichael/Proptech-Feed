import type { Metadata } from "next";
import { ShoppingBag } from "lucide-react";

import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = pageMetadata({
  title: "Properties for sale",
  description:
    "Browse houses, apartments and land for sale across Nigeria. Compare prices and locations and save listings on Expert Listing.",
  path: "/buy",
});

export default function Page() {
  return (
    <PagePlaceholder
      icon={ShoppingBag}
      title="Buy"
      description="Properties for sale will appear here as a filtered view of the feed."
    />
  );
}
