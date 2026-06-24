import type { MediaItem, PostCategory, PostTag } from "@/types";

import type { PostsSlice } from "./posts.slice";
import type { CommentsSlice } from "./comments.slice";
import type { StoriesSlice } from "./stories.slice";
import type { FiltersSlice } from "./filters.slice";

export type FeedState = PostsSlice & CommentsSlice & StoriesSlice & FiltersSlice;

export interface NewPostDraft {
  category: PostCategory;
  text: string;
  location?: string;
  tags: PostTag[];
  media: MediaItem[];
}
