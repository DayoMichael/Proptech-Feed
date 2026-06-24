import { MoreHorizontal } from "lucide-react";

import { relativeTime } from "@/lib/format";
import type { Post, User } from "@/types";
import { UserTypeBadge } from "@/features/posts/components/user-type-badge";
import { VerifiedBadge } from "@/features/posts/components/verified-badge";

const CATEGORY_LABEL: Record<Post["category"], string> = {
  general: "General",
  property: "Property",
};

interface PostHeaderProps {
  author: User;
  category: Post["category"];
  createdAt: string;
}

export function PostHeader({ author, category, createdAt }: PostHeaderProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-1.5">
          <span className="truncate font-medium leading-tight">
            {author.name}
          </span>
          {author.verified && <VerifiedBadge className="size-4 shrink-0" />}
          <span aria-hidden className="text-muted-foreground">
            ·
          </span>
          <UserTypeBadge type={author.type} />
        </div>
        <p className="text-xs text-muted-foreground">
          {CATEGORY_LABEL[category]} · {relativeTime(createdAt)}
        </p>
      </div>

      <button
        type="button"
        aria-label="Post options"
        className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
      >
        <MoreHorizontal className="size-5" />
      </button>
    </div>
  );
}
