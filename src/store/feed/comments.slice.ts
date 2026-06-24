import type { StateCreator } from "zustand";

import type { Comment, MediaItem } from "@/types";
import { comments as seedComments, currentUser } from "@/lib/mock/data";

import type { FeedState } from "./types";

function buildIndexes(comments: Record<string, Comment>) {
  const ordered = Object.values(comments).sort(
    (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
  );
  const commentsByPost: Record<string, string[]> = {};
  const repliesByComment: Record<string, string[]> = {};
  for (const c of ordered) {
    if (c.parentId) (repliesByComment[c.parentId] ??= []).push(c.id);
    else (commentsByPost[c.postId] ??= []).push(c.id);
  }
  return { commentsByPost, repliesByComment };
}

let commentSeq = 0;
function nextCommentId(): string {
  commentSeq += 1;
  return `c_${Date.now().toString(36)}_${commentSeq}`;
}

const initialIndexes = buildIndexes(seedComments);

export interface CommentsSlice {
  comments: Record<string, Comment>;
  commentsByPost: Record<string, string[]>;
  repliesByComment: Record<string, string[]>;
  toggleCommentLike: (commentId: string) => void;
  addComment: (
    postId: string,
    parentId: string | undefined,
    text: string,
    media?: MediaItem[],
  ) => string;
}

export const createCommentsSlice: StateCreator<
  FeedState,
  [],
  [],
  CommentsSlice
> = (set) => ({
  comments: seedComments,
  commentsByPost: initialIndexes.commentsByPost,
  repliesByComment: initialIndexes.repliesByComment,

  toggleCommentLike: (commentId) =>
    set((state) => {
      const comment = state.comments[commentId];
      if (!comment) return state;
      const liked = comment.likedByMe;
      return {
        comments: {
          ...state.comments,
          [commentId]: {
            ...comment,
            likedByMe: !liked,
            likeCount: comment.likeCount + (liked ? -1 : 1),
          },
        },
      };
    }),

  addComment: (postId, parentId, text, media) => {
    const id = nextCommentId();
    set((state) => {
      const body = text.trim();
      const post = state.posts[postId];
      if ((!body && !media?.length) || !post) return state;

      const comment: Comment = {
        id,
        postId,
        parentId,
        authorId: currentUser.id,
        text: body,
        media: media?.length ? media : undefined,
        createdAt: new Date().toISOString(),
        likeCount: 0,
        likedByMe: false,
        replyCount: 0,
      };

      const comments = { ...state.comments, [id]: comment };
      const next: Partial<FeedState> = { comments };

      if (parentId) {
        if (comments[parentId]) {
          comments[parentId] = {
            ...comments[parentId],
            replyCount: comments[parentId].replyCount + 1,
          };
        }
        next.repliesByComment = {
          ...state.repliesByComment,
          [parentId]: [...(state.repliesByComment[parentId] ?? []), id],
        };
      } else {
        next.commentsByPost = {
          ...state.commentsByPost,
          [postId]: [...(state.commentsByPost[postId] ?? []), id],
        };
      }

      next.posts = {
        ...state.posts,
        [postId]: {
          ...post,
          commentCount: post.commentCount + 1,
          topCommentId: post.topCommentId ?? id,
        },
      };

      return next;
    });
    return id;
  },
});
