import type { Metadata } from "next";
import { Briefcase } from "lucide-react";

import { pageMetadata } from "@/lib/seo";
import { PagePlaceholder } from "@/components/layout/page-placeholder";

export const metadata: Metadata = pageMetadata({
  title: "Find property professionals",
  description:
    "Connect with verified agents, developers and property service professionals across Nigeria on Expert Listing.",
  path: "/professionals",
});

export default function Page() {
  return (
    <PagePlaceholder
      icon={Briefcase}
      title="Find Professionals"
      description="Agents, developers and service pros will be discoverable here."
    />
  );
}
