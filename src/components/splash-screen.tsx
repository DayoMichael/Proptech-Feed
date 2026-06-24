"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { LogoSvg } from "@/components/logo-svg";
import { useSplashScreen } from "@/hooks/use-splash-screen";

const LottieLogo = dynamic(() => import("@/components/lottie-logo"), {
  ssr: false,
  loading: () => <LogoSvg className="h-9 w-auto text-primary" />,
});

export function SplashScreen() {
  const { animate, hiding, done, markAnimComplete } = useSplashScreen();

  if (done) return null;

  return (
    <div
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500",
        hiding && "pointer-events-none opacity-0",
      )}
    >
      {animate ? (
        <LottieLogo className="h-9 w-auto" onComplete={markAnimComplete} />
      ) : (
        <LogoSvg className="h-9 w-auto text-primary" />
      )}
    </div>
  );
}
