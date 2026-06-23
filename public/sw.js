// Minimal service worker for offline resilience on flaky networks.
// - App shell + Next static assets: cache-first.
// - Images (Unsplash / avatars): stale-while-revalidate.
// - Page navigations: network-first, falling back to the cached shell offline.

const VERSION = "el-v1";
const STATIC_CACHE = `static-${VERSION}`;
const IMG_CACHE = `img-${VERSION}`;
const PAGE_CACHE = `page-${VERSION}`;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(["/"])),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isImage(request, url) {
  return (
    request.destination === "image" ||
    url.hostname === "images.unsplash.com" ||
    url.hostname === "i.pravatar.cc"
  );
}

// Background Sync: when the browser regains connectivity it fires this even if
// the tab was closed. We broadcast a flush signal to any live clients so the
// optimistic mutation outbox (likes / comments / DMs) can drain in order.
// The queue itself is client-side; a production build would persist it to
// IndexedDB so the SW could replay it with no tab open.
self.addEventListener("sync", (event) => {
  if (event.tag === "outbox-sync") {
    event.waitUntil(
      self.clients
        .matchAll({ includeUncontrolled: true })
        .then((clients) =>
          clients.forEach((c) => c.postMessage({ type: "flush-outbox" })),
        ),
    );
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Page navigations  network-first, fall back to cache, then the shell.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match("/");
        }),
    );
    return;
  }

  // Images  stale-while-revalidate.
  if (isImage(request, url)) {
    event.respondWith(
      caches.open(IMG_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      }),
    );
    return;
  }

  // Next static assets and other same-origin GETs  cache-first.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok && url.pathname.startsWith("/_next/")) {
          cache.put(request, response.clone());
        }
        return response;
      }),
    );
  }
});
