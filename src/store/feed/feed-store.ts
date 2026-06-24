import { create } from "zustand";

import { createPostsSlice } from "./posts.slice";
import { createCommentsSlice } from "./comments.slice";
import { createStoriesSlice } from "./stories.slice";
import { createFiltersSlice } from "./filters.slice";
import type { FeedState } from "./types";

export type { FeedState, NewPostDraft } from "./types";

export const useFeedStore = create<FeedState>()((...args) => ({
  ...createPostsSlice(...args),
  ...createCommentsSlice(...args),
  ...createStoriesSlice(...args),
  ...createFiltersSlice(...args),
}));
