import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";
import { posts } from "@/lib/mock/data";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/rent", changeFrequency: "daily", priority: 0.9 },
  { path: "/buy", changeFrequency: "daily", priority: 0.9 },
  { path: "/shortlets", changeFrequency: "daily", priority: 0.8 },
  { path: "/snagging", changeFrequency: "monthly", priority: 0.5 },
  { path: "/professionals", changeFrequency: "monthly", priority: 0.5 },
  { path: "/communities", changeFrequency: "weekly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Per-listing entries, with lastmod from each post's timestamp.
  const listingEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/post/${post.id}`),
    lastModified: new Date(post.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...listingEntries];
}
