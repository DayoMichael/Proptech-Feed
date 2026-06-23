import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { SearchView } from "@/features/search/views/search-view";

export const metadata: Metadata = pageMetadata({
  title: "Search",
  description: "Search homes, apartments and properties on Expert Listing.",
  path: "/search",
  index: false,
});

export default function Page() {
  return <SearchView />;
}
