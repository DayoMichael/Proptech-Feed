"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ScreenPanel } from "@/components/screen-panel";
import { PostComposerForm } from "@/features/composer/components/post-composer-form";

export default function Page() {
  const router = useRouter();
  return (
    <ScreenPanel>
      <header className="flex shrink-0 items-center gap-3 border-b px-3 py-2.5 sm:px-4">
        <Link
          href="/"
          aria-label="Back"
          className="-ml-1 flex size-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="font-semibold leading-tight">List Property</h1>
          <p className="text-xs text-muted-foreground">
            Reach buyers and renters across the feed
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <PostComposerForm
          hideTabs
          initialTab="property"
          onDone={() => router.push("/")}
        />
      </div>
    </ScreenPanel>
  );
}
