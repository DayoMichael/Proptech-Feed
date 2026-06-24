"use client";

import { useRef, useState } from "react";
import {
  Building2,
  ImagePlus,
  Inbox,
  MessageCircle,
  Tag,
  Video,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed/feed-store";
import { currentUser } from "@/lib/mock/data";
import type { PostCategory, PostTag } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMediaPicker } from "@/features/composer/hooks/use-media-picker";
import { LocationInput } from "@/features/composer/components/location-input";
import { useAuth } from "@/providers/auth-provider";

const TABS: {
  id: PostCategory | "request";
  label: string;
  Icon: LucideIcon;
}[] = [
  { id: "property", label: "Property", Icon: Building2 },
  { id: "general", label: "General", Icon: MessageCircle },
  { id: "request", label: "Request", Icon: Inbox },
];

const PLACEHOLDERS: Record<string, string> = {
  property: "Describe the property  type, location, price, features…",
  general: "Share an update, ask a question, say hi…",
  request: "Tell the community what you're looking for…",
};

const TAGS: { id: PostTag; label: string }[] = [
  { id: "for_sale", label: "For Sale" },
  { id: "for_rent", label: "For Rent" },
];

export function PostComposerForm({
  initialTab = "general",
  hideTabs = false,
  onDone,
}: {
  initialTab?: PostCategory | "request";
  hideTabs?: boolean;
  onDone?: () => void;
}) {
  const addPost = useFeedStore((s) => s.addPost);
  const { requireAuth } = useAuth();
  const { picked, addFiles, remove, toMediaItems, clear } = useMediaPicker();

  const [tab, setTab] = useState(initialTab);
  const [text, setText] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState<PostTag[]>([]);

  const imageInput = useRef<HTMLInputElement>(null);
  const gifInput = useRef<HTMLInputElement>(null);
  const videoInput = useRef<HTMLInputElement>(null);

  const showListingFields = tab === "property" || tab === "request";
  const canPost = text.trim().length > 0 || picked.length > 0;

  function toggleTag(id: PostTag) {
    setTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canPost) return;
    requireAuth(() => {
      addPost({
        category: tab === "request" ? "property" : tab,
        text,
        location,
        tags: showListingFields ? tags : [],
        media: toMediaItems(),
      });
      setText("");
      setLocation("");
      setTags([]);
      clear();
      onDone?.();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col">
      {!hideTabs && (
      <div
        role="tablist"
        aria-label="Post type"
        className="flex border-b border-border/70"
      >
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={cn(
              "relative flex flex-1 items-center justify-center gap-2 px-3 py-3.5 text-sm font-medium transition-colors",
              tab === id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4.5" aria-hidden />
            {label}
            {tab === id && (
              <span className="absolute inset-x-5 -bottom-px h-0.5 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
      )}

      <div className="flex gap-3 px-5 pb-1 pt-5">
        <Avatar className="size-10 shrink-0">
          <AvatarImage src={currentUser.avatarUrl} alt="" />
          <AvatarFallback className="text-xs">
            {currentUser.name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-4 pt-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={PLACEHOLDERS[tab]}
            aria-label="Post text"
            rows={4}
            className="w-full resize-none bg-transparent text-base leading-relaxed outline-none placeholder:text-muted-foreground md:text-[0.9375rem]"
          />

          {picked.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {picked.map((m) => (
                <div
                  key={m.id}
                  className="relative aspect-square overflow-hidden rounded-lg border bg-surface-sunken"
                >
                  {m.type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={m.url}
                      alt={m.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    <video
                      src={m.url}
                      muted
                      className="size-full object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => remove(m.id)}
                    aria-label="Remove media"
                    className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/65 text-white transition-colors hover:bg-black/80"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showListingFields && (
            <div className="flex flex-wrap items-center gap-2">
              <Tag className="size-4 text-muted-foreground" aria-hidden />
              {TAGS.map(({ id, label }) => {
                const active = tags.includes(id);
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleTag(id)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      active
                        ? id === "for_sale"
                          ? "border-transparent bg-chip-sale text-chip-sale-foreground"
                          : "border-transparent bg-chip-rent text-chip-rent-foreground"
                        : "text-muted-foreground hover:bg-secondary",
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          <LocationInput value={location} onChange={setLocation} />
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-border/70 px-4 py-3">
        <div className="flex items-center gap-1">
          <MediaButton
            label="Add photo"
            onClick={() => imageInput.current?.click()}
          >
            <ImagePlus className="size-5" />
          </MediaButton>
          <MediaButton
            label="Add GIF"
            onClick={() => gifInput.current?.click()}
          >
            <span className="rounded-[5px] border-[1.5px] border-current px-1 py-px text-[0.625rem] font-bold leading-none tracking-tight">
              GIF
            </span>
          </MediaButton>
          <MediaButton
            label="Add video"
            onClick={() => videoInput.current?.click()}
          >
            <Video className="size-5" />
          </MediaButton>
        </div>
        <Button type="submit" disabled={!canPost} className="rounded-full px-7">
          Post
        </Button>
      </div>

      <FileInput ref={imageInput} accept="image/*" onFiles={addFiles} />
      <FileInput ref={gifInput} accept="image/gif" onFiles={addFiles} />
      <FileInput ref={videoInput} accept="video/*" onFiles={addFiles} />
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
      className="flex size-10 items-center justify-center rounded-full text-primary transition-colors hover:bg-primary/10 active:scale-95"
    >
      {children}
    </button>
  );
}

function FileInput({
  ref,
  accept,
  onFiles,
}: {
  ref: React.Ref<HTMLInputElement>;
  accept: string;
  onFiles: (files: FileList | null) => void;
}) {
  return (
    <input
      ref={ref}
      type="file"
      accept={accept}
      multiple
      hidden
      onChange={(e) => {
        onFiles(e.target.files);
        e.target.value = "";
      }}
    />
  );
}
