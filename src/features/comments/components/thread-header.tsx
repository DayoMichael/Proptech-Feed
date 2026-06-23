import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function ThreadHeader({
  title,
  backHref,
}: {
  title: string;
  backHref: string;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-3 mb-1 flex items-center gap-4 bg-background/80 px-1 py-1.5 backdrop-blur sm:-mx-4 sm:px-2 lg:top-14">
      <Link
        href={backHref}
        aria-label="Go back"
        className="flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
      >
        <ArrowLeft className="size-5" />
      </Link>
      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
