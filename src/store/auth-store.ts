import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { User } from "@/types";
import { currentUser } from "@/lib/mock/data";

interface AuthState {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      signIn: () => set({ user: currentUser }),
      signOut: () => set({ user: null }),
    }),
    { name: "auth-session" },
  ),
);
