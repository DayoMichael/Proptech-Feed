"use client";

import { useEffect, useRef, useState } from "react";

export interface ScrollOverflow<T extends HTMLElement> {
  ref: React.RefObject<T | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
}

export function useScrollOverflow<T extends HTMLElement>(
  deps: React.DependencyList = [],
): ScrollOverflow<T> {
  const ref = useRef<T>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { ref, canScrollLeft, canScrollRight };
}
