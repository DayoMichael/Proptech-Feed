"use client";

import { useEffect, useState } from "react";

const HARD_TIMEOUT = 6000;
const STATIC_DURATION = 1200;
const FADE_DURATION = 500;

export interface SplashState {
  animate: boolean;
  hiding: boolean;
  done: boolean;
  markAnimComplete: () => void;
}

export function useSplashScreen(): SplashState {
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

  useEffect(() => {
    if (hiding || !pageLoaded || !animComplete) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHiding(true);
    const t = setTimeout(() => setDone(true), FADE_DURATION);
    return () => clearTimeout(t);
  }, [hiding, pageLoaded, animComplete]);

  return { animate, hiding, done, markAnimComplete: () => setAnimComplete(true) };
}
