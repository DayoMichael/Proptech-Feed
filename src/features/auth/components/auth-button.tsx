"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { useAuthStore } from "@/store/auth-store";
import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { iconPress } from "@/motions";
import { cn } from "@/lib/utils";

export function AuthButton() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const { openSignIn } = useAuth();

  if (!user) {
    return (
      <Button
        variant="ghost"
        onClick={openSignIn}
        className={cn(
          "px-2 text-base font-semibold text-foreground hover:bg-transparent",
          "lg:rounded-full lg:bg-primary lg:px-4 lg:text-sm lg:text-primary-foreground lg:hover:bg-primary/90",
        )}
      >
        Sign In
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account"
          className={cn("rounded-full ring-2 ring-transparent hover:ring-border", iconPress)}
        >
          <Avatar className="size-9">
            <AvatarImage src={user.avatarUrl} alt="" />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href="/profile" className="gap-2">
            <UserRound className="size-4" />
            View profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut} className="gap-2">
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
