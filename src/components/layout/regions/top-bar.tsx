import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { DesktopTabs } from "@/components/layout/navigation/desktop-tabs";
import { MobileMenu } from "@/components/layout/navigation/mobile-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { NotificationsBell } from "@/components/layout/navigation/notifications-bell";
import { AuthButton } from "@/features/auth/components/auth-button";

export function TopBar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-card">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center gap-3 px-3 sm:px-4">
        <Brand />

        <div className="ml-2 hidden flex-1 lg:block">
          <DesktopTabs />
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <NotificationsBell className="hidden lg:inline-flex" />
          <Button
            variant="ghost"
            size="sm"
            className="hidden text-muted-foreground hover:text-foreground lg:inline-flex"
          >
            List Property
          </Button>
          <ThemeToggle className="hidden lg:inline-flex" />
          <AuthButton />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
