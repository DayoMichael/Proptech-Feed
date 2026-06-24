import { cn } from "@/lib/utils";
import { pop } from "@/motions";

export function NavBadge({
  count,
  className,
}: {
  count: number;
  className?: string;
}) {
  if (count <= 0) return null;
  return (
    <span
      aria-hidden
      className={cn(
        "flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-none text-primary-foreground ring-2 ring-card",
        pop,
        className,
      )}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
