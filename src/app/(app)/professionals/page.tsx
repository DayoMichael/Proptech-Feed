import { Briefcase } from "lucide-react";

import { PagePlaceholder } from "@/components/layout/page-placeholder";

export default function Page() {
  return (
    <PagePlaceholder
      icon={Briefcase}
      title="Find Professionals"
      description="Agents, developers and service pros will be discoverable here."
    />
  );
}
