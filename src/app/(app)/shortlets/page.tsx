import { BedDouble } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function Page() {
  return (
    <PagePlaceholder
      icon={BedDouble}
      title="Shortlets"
      description="Short-let stays will appear here as a filtered view of the feed."
    />
  );
}
