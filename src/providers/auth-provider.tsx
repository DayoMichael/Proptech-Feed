"use client";

import { createContext, useContext, useRef, useState } from "react";

import { useAuthStore } from "@/store/auth-store";
import { isProtectedRoute } from "@/config/navigation";
import { SignInDialog } from "@/features/auth/components/sign-in-dialog";

interface AuthContextValue {
  /** Run `action` if signed in, otherwise prompt sign-in and run it after. */
  requireAuth: (action?: () => void) => boolean;
  openSignIn: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/**
 * Click handler for nav links: signed-out users hitting a protected route get
 * the sign-in modal instead of landing on a gated page.
 */
export function useNavGuard() {
  const user = useAuthStore((s) => s.user);
  const { openSignIn } = useAuth();
  return (href: string) => (event: React.MouseEvent) => {
    if (!user && isProtectedRoute(href)) {
      event.preventDefault();
      openSignIn();
    }
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const signIn = useAuthStore((s) => s.signIn);
  const [open, setOpen] = useState(false);
  const pending = useRef<(() => void) | null>(null);

  const requireAuth = (action?: () => void) => {
    if (user) {
      action?.();
      return true;
    }
    pending.current = action ?? null;
    setOpen(true);
    return false;
  };

  const openSignIn = () => setOpen(true);

  const onSuccess = () => {
    signIn();
    setOpen(false);
    const action = pending.current;
    pending.current = null;
    action?.();
  };

  return (
    <AuthContext.Provider value={{ requireAuth, openSignIn }}>
      {children}
      <SignInDialog open={open} onOpenChange={setOpen} onSuccess={onSuccess} />
    </AuthContext.Provider>
  );
}
