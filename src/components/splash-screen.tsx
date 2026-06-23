"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";
import { LogoSvg } from "@/components/logo-svg";

// Lottie runtime + animation data load as a separate chunk so they never block
// first paint; the static logo shows until it arrives.
const LottieLogo = dynamic(() => import("@/components/lottie-logo"), {
  ssr: false,
  loading: () => <LogoSvg className="h-9 w-auto text-primary" />,
});

// Safety net: dismiss even if the animation never reports completion.
const HARD_TIMEOUT = 6000;
// Fallback duration when we're not animating (reduced motion / no Lottie).
const STATIC_DURATION = 1200;

export function SplashScreen() {
  const [animate, setAnimate] = useState(true);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [animComplete, setAnimComplete] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (reduced) setAnimate(false);

    const markLoaded = () => active && setPageLoaded(true);
    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded, { once: true });

    const staticTimer = reduced
      ? setTimeout(() => active && setAnimComplete(true), STATIC_DURATION)
      : undefined;
    const hardTimer = setTimeout(
      () => active && setAnimComplete(true),
      HARD_TIMEOUT,
    );

    return () => {
      active = false;
      window.removeEventListener("load", markLoaded);
      if (staticTimer) clearTimeout(staticTimer);
      clearTimeout(hardTimer);
    };
  }, []);

  // Dismiss only once the animation has finished AND the page has loaded.
  useEffect(() => {
    if (hiding || !pageLoaded || !animComplete) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHiding(true);
    const t = setTimeout(() => setDone(true), 500);
    return () => clearTimeout(t);
  }, [hiding, pageLoaded, animComplete]);

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
        <LottieLogo
          className="h-9 w-auto"
          onComplete={() => setAnimComplete(true)}
        />
      ) : (
        <LogoSvg className="h-9 w-auto text-primary" />
      )}
    </div>
  );
}
