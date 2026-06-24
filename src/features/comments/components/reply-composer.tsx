"use client";

import { useRef, useState } from "react";
import { Film, ImageIcon, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFeedStore } from "@/store/feed/feed-store";
import { currentUser } from "@/lib/mock/data";
import type { MediaItem } from "@/types";
import { useAuth } from "@/providers/auth-provider";

interface Attachment {
  id: string;
  type: "image" | "video";
  url: string;
  name: string;
}

interface ReplyComposerProps {
  postId: string;
  parentId?: string;
  placeholder?: string;
  autoFocus?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
  onSubmitted?: (commentId: string) => void;
  onCancel?: () => void;
}

let attachmentSeq = 0;

export function ReplyComposer({
  postId,
  parentId,
  placeholder = "Add a comment…",
  autoFocus,
  inputRef,
  onSubmitted,
  onCancel,
}: ReplyComposerProps) {
  const addComment = useFeedStore((s) => s.addComment);
  const { requireAuth } = useAuth();
  const [value, setValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [focused, setFocused] = useState(false);

  const imageInput = useRef<HTMLInputElement>(null);
  const gifInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const canSend = value.trim().length > 0 || attachments.length > 0;
  const showToolbar = focused || canSend;

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next: Attachment[] = Array.from(files).map((file) => {
      attachmentSeq += 1;
      return {
        id: `att_${attachmentSeq}`,
        type: file.type.startsWith("video") ? "video" : "image",
        url: URL.createObjectURL(file),
        name: file.name,
      };
    });
    setAttachments((prev) => [...prev, ...next]);
  }

  function removeAttachment(id: string) {
    setAttachments((prev) => {
      const target = prev.find((a) => a.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((a) => a.id !== id);
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSend) return;
    requireAuth(() => {
      const media: MediaItem[] = attachments.map((a) =>
        a.type === "video"
          ? { type: "video", url: a.url, poster: "", width: 0, height: 0, durationMs: 0, alt: a.name }
          : { type: "image", url: a.url, width: 0, height: 0, alt: a.name },
      );
      const id = addComment(postId, parentId, value, media);
      setValue("");
      setAttachments([]);
      onSubmitted?.(id);
    });
  }

  return (
    <form onSubmit={submit}>
      <div className="rounded-2xl border border-input bg-surface-sunken transition-colors focus-within:border-ring">
        <div className="flex items-center gap-2 px-3 py-2">
          <Avatar className="size-7 shrink-0">
            <AvatarImage src={currentUser.avatarUrl} alt="" />
            <AvatarFallback className="text-[0.625rem]">
              {currentUser.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <input
            ref={inputRef}
            autoFocus={autoFocus}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholder}
            aria-label={placeholder}
            className="h-8 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
          />
        </div>

        {attachments.length > 0 && (
          <div className="grid grid-cols-3 gap-2 px-3 pb-2 sm:grid-cols-4">
            {attachments.map((a) => (
              <div
                key={a.id}
                className="relative aspect-square overflow-hidden rounded-lg border bg-background"
              >
                {a.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={a.url} alt={a.name} className="size-full object-cover" />
                ) : (
                  <video src={a.url} className="size-full object-cover" muted />
                )}
                <button
                  type="button"
                  onClick={() => removeAttachment(a.id)}
                  aria-label="Remove attachment"
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black/80"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {showToolbar && (
          <div className="flex items-center justify-between border-t px-2 py-1.5">
            <div className="flex items-center gap-0.5">
              <MediaButton label="Add photo" onClick={() => imageInput.current?.click()}>
                <ImageIcon className="size-4" />
              </MediaButton>
              <MediaButton label="Add GIF" onClick={() => gifInput.current?.click()}>
                <span className="text-[0.625rem] font-bold leading-none">GIF</span>
              </MediaButton>
              <MediaButton label="Add video" onClick={() => videoInput.current?.click()}>
                <Film className="size-4" />
              </MediaButton>
            </div>
            <div className="flex items-center gap-1">
              {onCancel && (
                <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" size="sm" disabled={!canSend}>
                Reply
              </Button>
            </div>
          </div>
        )}
      </div>

      <input
        ref={imageInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={gifInput}
        type="file"
        accept="image/gif"
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={videoInput}
        type="file"
        accept="video/*"
        multiple
        hidden
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </form>
  );
}

function MediaButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex size-8 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10",
      )}
    >
      {children}
    </button>
  );
}
