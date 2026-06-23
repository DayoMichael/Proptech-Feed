import type { StateCreator } from "zustand";

import {
  EMPTY_FILTERS,
  type FeedFilterState,
} from "@/features/filters/filters";

import type { FeedState } from "./types";

export interface FiltersSlice {
  filters: FeedFilterState;
  setFilter: <K extends keyof FeedFilterState>(
    key: K,
    value: FeedFilterState[K],
  ) => void;
  resetFilters: () => void;
}

export const createFiltersSlice: StateCreator<
  FeedState,
  [],
  [],
  FiltersSlice
> = (set) => ({
  filters: EMPTY_FILTERS,
  setFilter: (key, value) =>
    set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: EMPTY_FILTERS }),
});
