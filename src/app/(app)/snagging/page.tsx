import { ClipboardCheck } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function Page() {
  return (
    <PagePlaceholder
      icon={ClipboardCheck}
      title="Snagging"
      description="Snagging inspections and reports land here in a later step."
    />
  );
}
