export function PostCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className="size-10 shrink-0 rounded-full bg-secondary" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-secondary" />
          <div className="h-2.5 w-1/4 rounded bg-secondary" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-full rounded bg-secondary" />
        <div className="h-3 w-5/6 rounded bg-secondary" />
      </div>
      <div className="mt-4 h-52 rounded-xl bg-secondary" />
      <div className="mt-4 flex gap-6">
        <div className="h-4 w-10 rounded bg-secondary" />
        <div className="h-4 w-10 rounded bg-secondary" />
        <div className="h-4 w-10 rounded bg-secondary" />
      </div>
    </div>
  );
}
