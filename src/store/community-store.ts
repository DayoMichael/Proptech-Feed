import { create } from "zustand";

export interface Community {
  id: string;
  name: string;
  members: number;
  blurb: string;
  imageUrl: string;
}

const cover = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=160`;

export const COMMUNITIES: Community[] = [
  {
    id: "lekki-landlords",
    name: "Lekki Landlords",
    members: 12400,
    blurb: "Landlords & property managers across Lekki.",
    imageUrl: cover("1568605114967-8130f3a36994"),
  },
  {
    id: "abuja-developers",
    name: "Abuja Developers Group",
    members: 5600,
    blurb: "Developers shaping Abuja's skyline.",
    imageUrl: cover("1564013799919-ab600027ffc6"),
  },
  {
    id: "house-hunting-lagos",
    name: "House Hunting Lagos",
    members: 9100,
    blurb: "Find your next home in Lagos.",
    imageUrl: cover("1600596542815-ffad4c1539a9"),
  },
  {
    id: "shortlet-owners",
    name: "Shortlet Owners NG",
    members: 3200,
    blurb: "Owners & managers of shortlet apartments.",
    imageUrl: cover("1505691938895-1758d7feb511"),
  },
  {
    id: "first-time-buyers",
    name: "First-time Buyers",
    members: 7400,
    blurb: "Guidance for first-time property buyers.",
    imageUrl: cover("1512917774080-9991f1c4c750"),
  },
];

interface CommunityState {
  joined: Set<string>;
  toggleJoin: (id: string) => void;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  joined: new Set<string>(["house-hunting-lagos"]),
  toggleJoin: (id) =>
    set((state) => {
      const next = new Set(state.joined);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { joined: next };
    }),
}));
