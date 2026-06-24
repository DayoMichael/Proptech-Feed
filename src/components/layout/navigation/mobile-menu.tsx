"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { sidebarNav } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { FeedFilters } from "@/features/filters/components/feed-filters";
import { useNavGuard } from "@/providers/auth-provider";
import { useComposer } from "@/providers/composer-provider";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const guard = useNavGuard();
  const { open: openComposer } = useComposer();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[18rem] p-0">
        <SheetHeader className="flex-row items-center justify-between px-4">
          <SheetTitle asChild>
            <Brand />
          </SheetTitle>
          <ThemeToggle />
        </SheetHeader>

        <nav aria-label="Sections" className="px-2">
          <ul className="space-y-1">
            {sidebarNav.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <SheetClose asChild>
                    <Link
                      href={item.href}
                      onClick={guard(item.href)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                      )}
                    >
                      <item.icon className="size-5 shrink-0" />
                      {item.label}
                    </Link>
                  </SheetClose>
                </li>
              );
            })}
          </ul>
        </nav>

        <Separator className="my-4" />

        <div className="px-4">
          <FeedFilters />
        </div>

        <div className="px-4 pt-6">
          <Button
            className="w-full gap-2"
            onClick={() => {
              setOpen(false);
              openComposer();
            }}
          >
            <Plus className="size-4" />
            Create Post
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
