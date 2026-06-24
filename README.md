# Property Feed

A mobile-first property feed built for places where the connection is bad and the data plan is small. Twitter and Instagram fused together, but for real estate: posts, stories, threaded comments, likes, saves, shares, DMs, and a passkey sign in.

## Running it

```bash
npm install
npm run dev
npm run build && npm start
```

Node 18+, no env vars, runs on mock data. Two things to know: feed state lives in memory so a refresh resets posts, likes, and comments, but sign in's are persisted. The passkey prompt is credential-less.

This project caters for one of the biggest issues in the real estate market, show casing quality housing without getting compromised by slow networks.

To see it the way I built it: throttle to Slow 3G and 4x CPU in a phone viewport, scroll (images blur in, nothing jumps), flip on Save-Data, then load once and go offline and keep navigating.

## Why Next.js

The problem is a byte-counting problem, and nextjs helps to solve this as `next/image` does the heavy lifting: AVIF/WebP, responsive sizes, lazy loading, priority hints, out of the box. On 3G that alone decides whether the feed loads. Server components keep most of the page off the JS bundle, and route-level splitting plus prefetch mean a tab only costs what it needs while the next likely page loads on the idle radio. TypeScript, strict mode throughout.

## Three pages, because selling/renting/buying a property is a conversation

The part I spent the most time on is what happens when you tap a post. You build enough feeds and you start to feel where the obvious models break.

The feed is for scanning: post, media, interaction bar, a "liked by" line, and one top comment with a reply box. That comment is the hook, it tells you a conversation exists without asking you to commit.

The post page is the post in full with top-level replies. The thread page centres one comment, collapses its parents, shows its replies, and re-roots when you tap any reply.

The reasoning: Instagram buries comments in a flat list with no permalink, which is fine for broadcasting but it can be difficult to follow, Reddit threads properly but deep nesting on a small phone can be a bad ux. So I took Reddit's data model, real parent-child threading, and Twitter's navigation, re-root on tap and collapse the parents.

## What you can do

- Sign in with a passkey (and you're prompted to when you try to post, like, comment, or open a gated page)
- **Post with media** — attach a photo (single image or a multi-image carousel) or a video, alongside text and location search in the composer
- Like and reply, in proper threads
- **Message in DMs** — send text, photos, and video, with typing and seen states; the same upload pipeline as the composer
- **Reply to a story** — your reply opens (or reuses) a DM with the story segment attached as context, Instagram-style
- Save and share posts
- Notifications
- Stories, with a full-screen viewer and upload
- Search, profiles, boosts, communities, notifications, and filters
- Light and dark themes

## How the data is shaped

This is why it stays quick. Everything is flat and keyed by id, with feed order as a separate list of ids. Like a post and I touch one post and re-render one card, never the whole list. That's what keeps it fast.

## Media on a slow link

Optimizing the media is also important, as thats one of the core things that lag when the network becomes slow.

- **Modern formats, sized to the device.** Every image is served through `next/image` as AVIF or WebP and sized to the screen it's on, so a phone never downloads a desktop-sized file. On a slow or metered connection it drops to an even lighter version automatically.
- **Something on screen immediately.** Each post carries a tiny blurred version of its image inline, so there's no second request to wait on. You see that blur instantly, and the full image stays hidden until it has fully loaded and then fades in, rather than painting in line by line on a weak signal.
- **No layout shift.** Every image and video sits in a box whose aspect ratio is known up front, so the space is reserved before any bytes arrive and the content around it never jumps as media loads.
- **Compression off the main thread.** When you upload, the image is downscaled and re-encoded to WebP on a Web Worker. This was a deliberate choice: `async` and promises still run on the same single main thread, so doing this inline would freeze scrolling and tapping while a large phone photo is processed. A worker runs on a genuinely separate thread, so the work happens in parallel and the interface stays smooth. If a browser doesn't support it, it quietly falls back to the original file so an upload never fails.
- **Restrained video.** Video never autoplays on cellular, pauses as soon as it scrolls off screen, and only one ever plays at a time, so it doesn't quietly burn through someone's data.

## Virtualization and infinite scroll

Virtualization was important here too, because a hundred-post feed that renders everything stutters on a small device: the browser still has to lay out and paint cards you can't even see, which eats memory and frames. So virtualization helps to solve this, which means only what you actually see does work, and I get this without a virtual list library fighting the scroll position or breaking links. Infinite scroll loads two screens early with skeletons at the edge instead of a blank gap. Signed out, you get five posts then a sign-in prompt.

## Offline

Offline was worth handling properly, because on these networks a dropped or flaky connection is the normal case, not the edge case. The app reads the connection and drops to Data Saver on slow or metered networks (lighter images, no video preload), and a toast tells you the moment you go offline or come back so you're never left guessing. It installs as a PWA, and the service worker caches the shell and serves images stale-while-revalidate, so a flaky link still gives you the last feed instead of a blank screen. The worker also has background-sync wiring that fires on reconnect; since this runs on mock data the action queue is in memory, but that's the piece that lets anything you did offline settle once you're back online.

## Organized feature-first

```
src/
  app/                 routes, each page renders a feature view
  features/<feature>/  feed, posts, comments, stories, composer, messages, auth...
  components/          shared UI (ui, media, layout)
  providers/           auth, composer, theme
  store/               zustand, feed store split by responsibility
```

Actions live with their state, the Zustand way, and the feed store is split into slices by what they do rather than a state pile and an actions pile.

## Accessibility

Semantic HTML, labelled controls, keyboard support, visible focus.
