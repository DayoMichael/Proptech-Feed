import { Tag } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PostTag } from "@/types";

const TAG_CONFIG: Record<PostTag, { label: string; className: string }> = {
  for_sale: {
    label: "For Sale",
    className: "bg-chip-sale text-chip-sale-foreground",
  },
  for_rent: {
    label: "For Rent",
    className: "bg-chip-rent text-chip-rent-foreground",
  },
};

export function TagChip({ tag }: { tag: PostTag }) {
  const { label, className } = TAG_CONFIG[tag];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        className,
      )}
    >
      <Tag className="size-3" aria-hidden />
      {label}
    </span>
  );
}
