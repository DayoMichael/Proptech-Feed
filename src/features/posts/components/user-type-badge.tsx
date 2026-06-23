import type { UserType } from "@/types";

const LABELS: Record<UserType, string> = {
  individual: "Individual",
  agent: "Agent",
  developer: "Developer",
  owner: "Owner",
  broker: "Broker",
};

export function UserTypeBadge({ type }: { type: UserType }) {
  return (
    <span className="text-xs text-muted-foreground">{LABELS[type]}</span>
  );
}
