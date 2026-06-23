import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { BoostsView } from "@/features/boosts/views/boosts-view";

export const metadata: Metadata = pageMetadata({
  title: "My boosts",
  description: "Manage boosts on your listings.",
  path: "/boosts",
  index: false,
});

export default function Page() {
  return <BoostsView />;
}
