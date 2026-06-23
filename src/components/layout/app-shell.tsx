import { TopBar } from "@/components/layout/regions/top-bar";
import { LeftSidebar } from "@/components/layout/regions/left-sidebar";
import { RightSidebar } from "@/components/layout/regions/right-sidebar";
import { BottomNav } from "@/components/layout/navigation/bottom-nav";
import { CreatePostFab } from "@/components/layout/create-post-fab";
import { ConnectionToast } from "@/components/connection-toast";
import { ComposerProvider } from "@/providers/composer-provider";
import { AuthProvider } from "@/providers/auth-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
    <ComposerProvider>
    <div className="flex h-dvh flex-col overflow-hidden lg:block lg:h-auto lg:min-h-dvh lg:overflow-visible">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <TopBar />

      <div className="flex-1 overflow-y-auto overscroll-contain lg:flex-none lg:overflow-visible">
        <div className="mx-auto flex max-w-[1280px] gap-6 px-3 sm:px-4 lg:gap-8">
          <LeftSidebar />

          <main
            id="main"
            className="min-w-0 flex-1 pb-6 pt-4 lg:max-w-[600px] lg:pb-10"
          >
            {children}
          </main>

          <RightSidebar />
        </div>
      </div>

      <BottomNav />
      <CreatePostFab />
      <ConnectionToast />
    </div>
    </ComposerProvider>
    </AuthProvider>
  );
}
