import { KeyRound } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function Page() {
  return (
    <PagePlaceholder
      icon={KeyRound}
      title="Rent"
      description="Rental listings will appear here as a filtered view of the feed."
    />
  );
}
