"use client";

import { useMemo } from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFeedStore } from "@/store/feed/feed-store";
import {
  BUDGETS,
  LISTING_TYPES,
  USER_TYPES,
  activeFilterCount,
} from "@/features/filters/filters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Option {
  value: string;
  label: string;
}

function FilterRow({
  label,
  placeholder,
  value,
  options,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string | null;
  options: Option[];
  onChange: (value: string | null) => void;
}) {
  const selected = options.find((o) => o.value === value);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/40"
        >
          <span className="text-base font-medium">{label}</span>
          <span className="flex items-center gap-2 text-sm">
            {selected && (
              <span className="max-w-32 truncate text-muted-foreground">
                {selected.label}
              </span>
            )}
            <ChevronDown className="size-4 text-muted-foreground" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="max-h-72 min-w-56 overflow-y-auto"
      >
        <DropdownMenuRadioGroup
          value={value ?? ""}
          onValueChange={(v) => onChange(v || null)}
        >
          <DropdownMenuRadioItem value="">{placeholder}</DropdownMenuRadioItem>
          {options.map((o) => (
            <DropdownMenuRadioItem key={o.value} value={o.value}>
              {o.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FilterControls({ className }: { className?: string }) {
  const posts = useFeedStore((s) => s.posts);
  const filters = useFeedStore((s) => s.filters);
  const setFilter = useFeedStore((s) => s.setFilter);
  const resetFilters = useFeedStore((s) => s.resetFilters);

  const locationOptions = useMemo(
    () =>
      [...new Set(Object.values(posts).map((p) => p.location).filter(Boolean))]
        .sort()
        .map((loc) => ({ value: loc as string, label: loc as string })),
    [posts],
  );

  const count = activeFilterCount(filters);

  return (
    <div
      className={cn(
        "divide-y overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      <FilterRow
        label="Location"
        placeholder="Any location"
        value={filters.location}
        options={locationOptions}
        onChange={(v) => setFilter("location", v)}
      />
      <FilterRow
        label="Listing Type"
        placeholder="For Sale / Rent"
        value={filters.listingType}
        options={LISTING_TYPES}
        onChange={(v) => setFilter("listingType", v as never)}
      />
      <FilterRow
        label="Budget"
        placeholder="Any budget"
        value={filters.budget}
        options={BUDGETS.map((b) => ({ value: b.key, label: b.label }))}
        onChange={(v) => setFilter("budget", v)}
      />
      <FilterRow
        label="User Type"
        placeholder="Any user"
        value={filters.userType}
        options={USER_TYPES}
        onChange={(v) => setFilter("userType", v as never)}
      />

      {count > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-full px-4 py-3 text-center text-sm font-medium text-primary transition-colors hover:bg-primary/10"
        >
          Clear filters ({count})
        </button>
      )}
    </div>
  );
}
