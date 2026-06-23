import type { Metadata } from "next";
import { ClipboardCheck } from "lucide-react";

import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = pageMetadata({
  title: "Snagging inspections",
  description:
    "Book snagging inspections and view defect reports for new-build properties in Nigeria on Expert Listing.",
  path: "/snagging",
});

export default function Page() {
  return (
    <PagePlaceholder
      icon={ClipboardCheck}
      title="Snagging"
      description="Snagging inspections and reports land here in a later step."
    />
  );
}
