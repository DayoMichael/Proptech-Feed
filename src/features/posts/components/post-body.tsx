"use client";

import { useFeedStore } from "@/store/feed/feed-store";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { PostHeader } from "@/features/posts/components/post-header";
import { LocationChip } from "@/features/posts/components/location-chip";
import { TagChip } from "@/features/posts/components/tag-chip";
import { PostMedia } from "@/features/posts/components/post-media";
import { InteractionBar } from "@/features/posts/components/interaction-bar";
import { LikedBy } from "@/features/posts/components/liked-by";

interface PostBodyProps {
  postId: string;
  priority?: boolean;
  onComment?: () => void;
}

export function PostBody({ postId, priority, onComment }: PostBodyProps) {
  const post = useFeedStore((s) => s.posts[postId]);
  const users = useFeedStore((s) => s.users);
  const { dataSaver } = useNetworkStatus();

  if (!post) return null;

  const author = users[post.authorId];
  const likedByUsers = post.likedByPreview
    .map((id) => users[id])
    .filter(Boolean);

  return (
    <div className="space-y-3">
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
  );
}
