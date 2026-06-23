import { ShoppingBag } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function Page() {
  return (
    <PagePlaceholder
      icon={ShoppingBag}
      title="Buy"
      description="Properties for sale will appear here as a filtered view of the feed."
    />
  );
}
