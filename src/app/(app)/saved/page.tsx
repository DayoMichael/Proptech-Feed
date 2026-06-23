import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { SavedList } from "@/features/saved/views/saved-list";

export const metadata: Metadata = pageMetadata({
  title: "Saved listings",
  description: "Listings you've saved on Expert Listing.",
  path: "/saved",
  index: false,
});

export default function Page() {
  return <SavedList />;
}
