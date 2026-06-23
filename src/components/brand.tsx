import Link from "next/link";

import { cn } from "@/lib/utils";
import { LogoSvg } from "@/components/logo-svg";

export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn("flex items-center text-primary", className)}
      aria-label="Expert Listing  home"
    >
      <LogoSvg className="h-5.5" />
      <span className="sr-only">Expert Listing</span>
    </Link>
  );
}
