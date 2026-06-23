import { create } from "zustand";

import { createPostsSlice } from "./posts.slice";
import { createCommentsSlice } from "./comments.slice";
import { createStoriesSlice } from "./stories.slice";
import { createFiltersSlice } from "./filters.slice";
import type { FeedState } from "./types";

export type { FeedState, NewPostDraft } from "./types";

/**
 * Normalized feed store, composed from responsibility slices (posts, comments,
 * stories, filters). Each slice co-locates its own state and actions; they
 * share one store so actions can read/update across slices via `set`.
 */
export const useFeedStore = create<FeedState>()((...args) => ({
  ...createPostsSlice(...args),
  ...createCommentsSlice(...args),
  ...createStoriesSlice(...args),
  ...createFiltersSlice(...args),
}));
