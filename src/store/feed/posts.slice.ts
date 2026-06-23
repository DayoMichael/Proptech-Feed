import type { StateCreator } from "zustand";

import type { Post, User } from "@/types";
import {
  currentUser,
  posts as seedPosts,
  users as seedUsers,
} from "@/lib/mock/data";

import type { FeedState, NewPostDraft } from "./types";

function index<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

let postSeq = 0;
function nextPostId(): string {
  postSeq += 1;
  return `p_${Date.now().toString(36)}_${postSeq}`;
}

const initialPosts = index(seedPosts);

export interface PostsSlice {
  users: Record<string, User>;
  posts: Record<string, Post>;
  feedOrder: string[];
  likedPostIds: Set<string>;
  savedPostIds: Set<string>;
  boostedPostIds: Set<string>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  toggleBoost: (postId: string) => void;
  addPost: (draft: NewPostDraft) => string;
}

export const createPostsSlice: StateCreator<FeedState, [], [], PostsSlice> = (
  set,
) => ({
  users: seedUsers,
  posts: initialPosts,
  feedOrder: seedPosts.map((p) => p.id),
  likedPostIds: new Set(seedPosts.filter((p) => p.likedByMe).map((p) => p.id)),
  savedPostIds: new Set(seedPosts.filter((p) => p.savedByMe).map((p) => p.id)),
  boostedPostIds: new Set<string>(),

  toggleLike: (postId) =>
    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      const liked = state.likedPostIds.has(postId);
      const likedPostIds = new Set(state.likedPostIds);
      if (liked) likedPostIds.delete(postId);
      else likedPostIds.add(postId);
      return {
        likedPostIds,
        posts: {
          ...state.posts,
          [postId]: {
            ...post,
            likedByMe: !liked,
            likeCount: post.likeCount + (liked ? -1 : 1),
          },
        },
      };
    }),

  toggleSave: (postId) =>
    set((state) => {
      const post = state.posts[postId];
      if (!post) return state;
      const saved = state.savedPostIds.has(postId);
      const savedPostIds = new Set(state.savedPostIds);
      if (saved) savedPostIds.delete(postId);
      else savedPostIds.add(postId);
      return {
        savedPostIds,
        posts: {
          ...state.posts,
          [postId]: {
            ...post,
            savedByMe: !saved,
            bookmarkCount: post.bookmarkCount + (saved ? -1 : 1),
          },
        },
      };
    }),

  toggleBoost: (postId) =>
    set((state) => {
      const next = new Set(state.boostedPostIds);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return { boostedPostIds: next };
    }),

  addPost: (draft) => {
    const id = nextPostId();
    set((state) => {
      const post: Post = {
        id,
        authorId: currentUser.id,
        category: draft.category,
        createdAt: new Date().toISOString(),
        text: draft.text.trim(),
        location: draft.location?.trim() || undefined,
        tags: draft.tags,
        media: draft.media,
        likeCount: 0,
        likedByMe: false,
        likedByPreview: [],
        commentCount: 0,
        bookmarkCount: 0,
        savedByMe: false,
        shareCount: 0,
      };
      return {
        posts: { ...state.posts, [id]: post },
        feedOrder: [id, ...state.feedOrder],
      };
    });
    return id;
  },
});
