"use client";

import { SlidersHorizontal, X } from "lucide-react";

import { useFeedStore } from "@/store/feed/feed-store";
import {
  BUDGETS,
  LISTING_TYPES,
  USER_TYPES,
  activeFilterCount,
  type FeedFilterState,
} from "@/features/filters/filters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilterControls } from "@/features/filters/components/filter-controls";

function activeChips(filters: FeedFilterState) {
  const chips: { key: keyof FeedFilterState; label: string }[] = [];
  if (filters.location) chips.push({ key: "location", label: filters.location });
  if (filters.listingType)
    chips.push({
      key: "listingType",
      label:
        LISTING_TYPES.find((l) => l.value === filters.listingType)?.label ?? "",
    });
  if (filters.budget)
    chips.push({
      key: "budget",
      label: BUDGETS.find((b) => b.key === filters.budget)?.label ?? "",
    });
  if (filters.userType)
    chips.push({
      key: "userType",
      label: USER_TYPES.find((u) => u.value === filters.userType)?.label ?? "",
    });
  return chips;
}

export function FeedFilterBar() {
  const filters = useFeedStore((s) => s.filters);
  const setFilter = useFeedStore((s) => s.setFilter);
  const count = activeFilterCount(filters);
  const chips = activeChips(filters);

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-full border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {count > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[0.625rem] font-semibold text-primary-foreground">
                {count}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl px-4 pb-6">
          <SheetHeader className="px-0">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <FilterControls />
        </SheetContent>
      </Sheet>

      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => setFilter(chip.key, null)}
          className="flex shrink-0 items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary"
        >
          {chip.label}
          <X className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
