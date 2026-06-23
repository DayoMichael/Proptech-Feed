"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in production only (it would interfere with
 * dev HMR). The SW caches the app shell and serves a stale-while-revalidate
 * cache for images, so the feed stays usable on flaky / offline connections.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration failures shouldn't break the app */
      });
    };

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
