import { Check, CheckCheck, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import type { MessageStatus as Status } from "@/types";

export function MessageStatus({ status }: { status: Status }) {
  if (status === "sending")
    return <Clock className="size-3 text-muted-foreground" aria-label="Sending" />;
  if (status === "sent")
    return <Check className="size-3 text-muted-foreground" aria-label="Sent" />;
  return (
    <CheckCheck
      className={cn(
        "size-3",
        status === "seen" ? "text-primary" : "text-muted-foreground",
      )}
      aria-label={status === "seen" ? "Seen" : "Delivered"}
    />
  );
}

export function TypingDots() {
  return (
    <span className="flex items-center gap-1" aria-label="Typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
