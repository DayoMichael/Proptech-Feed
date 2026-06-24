import { cn } from "@/lib/utils";

export function ScreenPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "-mx-3 -mb-6 -mt-4 flex h-[calc(100dvh-7rem-env(safe-area-inset-bottom))] flex-col overflow-hidden border-0 bg-card sm:-mx-4 lg:mx-0 lg:my-0 lg:h-[calc(100dvh-6.5rem)] lg:rounded-xl lg:border",
        className,
      )}
    >
      {children}
    </div>
  );
}
