"use client";

import { useRouter } from "next/navigation";

import { ThreadHeader } from "@/features/comments/components/thread-header";
import { PostComposerForm } from "@/features/composer/components/post-composer-form";

export default function CreatePage() {
  const router = useRouter();

  return (
    <div>
      <ThreadHeader title="Create post" backHref="/" />
      <div className="overflow-hidden rounded-xl border bg-card">
        <PostComposerForm onDone={() => router.push("/")} />
      </div>
    </div>
  );
}
