import { create } from "zustand";

import type { User } from "@/types";
import { currentUser } from "@/lib/mock/data";

interface AuthState {
  user: User | null;
  signIn: () => void;
  signOut: () => void;
}

/**
 * Mock auth  in-memory like the rest of the demo (resets on refresh). Signing
 * in resolves to the demo user; gated actions check `user` before running.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  signIn: () => set({ user: currentUser }),
  signOut: () => set({ user: null }),
}));
