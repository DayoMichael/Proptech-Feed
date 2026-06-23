import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { CommunitiesView } from "@/features/communities/views/communities-view";

export const metadata: Metadata = pageMetadata({
  title: "Property communities",
  description:
    "Join location and interest-based property communities on Expert Listing to follow the listings and conversations that matter to you.",
  path: "/communities",
});

export default function Page() {
  return <CommunitiesView />;
}
