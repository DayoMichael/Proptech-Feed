import type { StateCreator } from "zustand";

import type { MediaItem, Story } from "@/types";
import { currentUser, stories as seedStories } from "@/lib/mock/data";

import type { FeedState } from "./types";

const STORY_IMAGE_MS = 5_000;

let storySeq = 0;
function nextStoryId(): string {
  storySeq += 1;
  return `seg_${Date.now().toString(36)}_${storySeq}`;
}

export interface StoriesSlice {
  stories: Story[];
  /** Story ids the viewer has already watched (drives the rail ring state). */
  seenStories: Set<string>;
  markStorySeen: (storyId: string) => void;
  /** Add a segment to the current user's story (creating it if needed). */
  addStory: (media: MediaItem) => void;
}

export const createStoriesSlice: StateCreator<
  FeedState,
  [],
  [],
  StoriesSlice
> = (set) => ({
  stories: seedStories,
  seenStories: new Set<string>(),

  markStorySeen: (storyId) =>
    set((state) =>
      state.seenStories.has(storyId)
        ? state
        : { seenStories: new Set(state.seenStories).add(storyId) },
    ),

  addStory: (media) =>
    set((state) => {
      const segment = {
        id: nextStoryId(),
        media,
        durationMs: media.type === "video" ? media.durationMs : STORY_IMAGE_MS,
        createdAt: new Date().toISOString(),
      };
      const mine = state.stories.find((s) => s.userId === currentUser.id);
      if (mine) {
        const updated: Story = {
          ...mine,
          segments: [...mine.segments, segment],
        };
        const rest = state.stories.filter((s) => s.id !== mine.id);
        return { stories: [updated, ...rest] };
      }
      const created: Story = {
        id: `st-${currentUser.id}`,
        userId: currentUser.id,
        segments: [segment],
      };
      return { stories: [created, ...state.stories] };
    }),
});
