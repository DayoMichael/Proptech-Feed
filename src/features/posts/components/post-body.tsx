"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed/feed-store";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PostHeader } from "@/features/posts/components/post-header";
import { LocationChip } from "@/features/posts/components/location-chip";
import { TagChip } from "@/features/posts/components/tag-chip";
import { PostMedia } from "@/features/posts/components/post-media";
import { InteractionBar } from "@/features/posts/components/interaction-bar";
import { LikedBy } from "@/features/posts/components/liked-by";
import { StoryViewer } from "@/features/stories/components/story-viewer";

interface PostBodyProps {
  postId: string;
  priority?: boolean;
  onComment?: () => void;
}

export function PostBody({ postId, priority, onComment }: PostBodyProps) {
  const post = useFeedStore((s) => s.posts[postId]);
  const users = useFeedStore((s) => s.users);
  const stories = useFeedStore((s) => s.stories);
  const seenStories = useFeedStore((s) => s.seenStories);
  const { dataSaver } = useNetworkStatus();
  const [storyOpen, setStoryOpen] = useState(false);

  if (!post) return null;

  const author = users[post.authorId];
  const authorStory = stories.find((s) => s.userId === post.authorId);
  const hasStory = Boolean(authorStory);
  const storySeen = authorStory ? seenStories.has(authorStory.id) : false;
  const likedByUsers = post.likedByPreview
    .map((id) => users[id])
    .filter(Boolean);

  const avatar = (
    <>
      {hasStory && (
        <span
          aria-hidden
          className={cn(
            "absolute -inset-0.5 rounded-full",
            storySeen ? "bg-border" : "bg-gradient-to-tr from-primary to-brand",
          )}
        />
      )}
      <Avatar className={cn("relative size-10", hasStory && "border-2 border-card")}>
        <AvatarImage src={author.avatarUrl} alt="" />
        <AvatarFallback>{author.name.slice(0, 2)}</AvatarFallback>
      </Avatar>
    </>
  );

  return (
    <div className="flex items-start gap-3">
      {hasStory ? (
        <button
          type="button"
          onClick={() => setStoryOpen(true)}
          aria-label={`View ${author.name}'s story`}
          className="relative size-10 shrink-0"
        >
          {avatar}
        </button>
      ) : (
        <div className="relative size-10 shrink-0">{avatar}</div>
      )}

      <div className="min-w-0 flex-1 space-y-3">
        <PostHeader
          author={author}
          category={post.category}
          createdAt={post.createdAt}
        />

        {post.text && (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {post.text}
          </p>
        )}

        {(post.location || post.tags.length > 0) && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            {post.location && <LocationChip location={post.location} />}
            {post.tags.map((tag) => (
              <TagChip key={tag} tag={tag} />
            ))}
          </div>
        )}

        {post.media.length > 0 && (
          <PostMedia
            media={post.media}
            priority={priority}
            dataSaver={dataSaver}
          />
        )}

        <InteractionBar postId={post.id} onComment={onComment} />

        <LikedBy users={likedByUsers} likeCount={post.likeCount} />
      </div>

      {storyOpen && authorStory && (
        <StoryViewer
          stories={[authorStory]}
          startIndex={0}
          onClose={() => setStoryOpen(false)}
        />
      )}
    </div>
  );
}
