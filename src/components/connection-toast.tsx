"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Wifi, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";

type Status = "online" | "offline";

/**
 * A small toast pinned below the top bar that surfaces connectivity changes.
 * Offline stays up until you're back; "Back online" shows briefly then hides.
 * The pill animates its width as the message changes, so it visibly shrinks
 * from the long offline copy down to "Back online".
 */
export function ConnectionToast() {
  const [status, setStatus] = useState<Status>("online");
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState<number>();
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clearHide = () => {
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };

    const goOffline = () => {
      clearHide();
      setStatus("offline");
      setVisible(true);
    };

    const goOnline = () => {
      clearHide();
      setStatus("online");
      setVisible(true);
      hideTimer.current = setTimeout(() => setVisible(false), 3000);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    // Surface it immediately if the page loads already offline.
    if (!navigator.onLine) queueMicrotask(goOffline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      clearHide();
    };
  }, []);

  // Lock the pill to the natural width of its current content, so the change
  // between messages animates the width instead of snapping.
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => setWidth(el.offsetWidth));
    return () => cancelAnimationFrame(id);
  }, [status]);

  const offline = status === "offline";

  return (
    <div
      role="status"
      aria-live="polite"
      style={{ top: "calc(3.5rem + env(safe-area-inset-top) + 0.75rem)" }}
      className={cn(
        "pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4 transition-all duration-300 motion-reduce:transition-none",
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0",
      )}
    >
      <div
        style={{ width }}
        className={cn(
          "overflow-hidden rounded-full shadow-lg ring-1 transition-[width,background-color] duration-300 ease-out motion-reduce:transition-none",
          offline
            ? "bg-red-600 ring-red-700/40"
            : "bg-primary ring-primary/30",
        )}
      >
        <div
          ref={innerRef}
          className={cn(
            "flex w-max items-center gap-2 whitespace-nowrap px-4 py-2 text-sm font-medium",
            offline ? "text-white" : "text-primary-foreground",
          )}
        >
          {offline ? (
            <WifiOff className="size-4 shrink-0" />
          ) : (
            <Wifi className="size-4 shrink-0" />
          )}
          {offline
            ? "You're offline. We'll sync when you reconnect."
            : "Back online"}
        </div>
      </div>
    </div>
  );
}
