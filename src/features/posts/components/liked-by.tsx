import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { compactNumber } from "@/lib/format";
import type { User } from "@/types";

interface LikedByProps {
  users: User[];
  likeCount: number;
}

export function LikedBy({ users, likeCount }: LikedByProps) {
  if (likeCount <= 0 || users.length === 0) return null;

  const lead = users[0];
  const others = likeCount - 1;

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="flex -space-x-2">
        {users.slice(0, 3).map((user) => (
          <Avatar
            key={user.id}
            className="size-5 border-2 border-card"
          >
            <AvatarImage src={user.avatarUrl} alt="" loading="lazy" />
            <AvatarFallback className="text-[0.5rem]">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span>
        Liked by <span className="font-medium text-foreground">{lead.handle}</span>
        {others > 0 && ` and ${compactNumber(others)} others`}
      </span>
    </div>
  );
}
