import type { Post, PostTag, User, UserType } from "@/types";

export interface FeedFilterState {
  location: string | null;
  listingType: PostTag | null;
  userType: UserType | null;
  budget: string | null;
}

export const EMPTY_FILTERS: FeedFilterState = {
  location: null,
  listingType: null,
  userType: null,
  budget: null,
};

export const BUDGETS: { key: string; label: string; min: number; max: number }[] =
  [
    { key: "u10", label: "Up to ₦10M", min: 0, max: 10_000_000 },
    { key: "10-50", label: "₦10M – ₦50M", min: 10_000_000, max: 50_000_000 },
    { key: "50-150", label: "₦50M – ₦150M", min: 50_000_000, max: 150_000_000 },
    { key: "150+", label: "₦150M and up", min: 150_000_000, max: Infinity },
  ];

export const LISTING_TYPES: { value: PostTag; label: string }[] = [
  { value: "for_sale", label: "For Sale" },
  { value: "for_rent", label: "For Rent" },
];

export const USER_TYPES: { value: UserType; label: string }[] = [
  { value: "individual", label: "Individual" },
  { value: "agent", label: "Agent" },
  { value: "developer", label: "Developer" },
  { value: "owner", label: "Owner" },
  { value: "broker", label: "Broker" },
];

export function activeFilterCount(filters: FeedFilterState): number {
  return Object.values(filters).filter(Boolean).length;
}

export function matchesFilters(
  post: Post,
  author: User | undefined,
  filters: FeedFilterState,
): boolean {
  if (filters.location && post.location !== filters.location) return false;
  if (filters.listingType && !post.tags.includes(filters.listingType))
    return false;
  if (filters.userType && author?.type !== filters.userType) return false;
  if (filters.budget) {
    const bracket = BUDGETS.find((b) => b.key === filters.budget);
    if (!bracket || post.price == null) return false;
    if (post.price < bracket.min || post.price >= bracket.max) return false;
  }
  return true;
}
