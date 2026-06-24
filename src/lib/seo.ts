import type { Metadata } from "next";

import type { Post, User } from "@/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

export const SITE_NAME = "Expert Listing";
export const SITE_DESCRIPTION =
  "Real estate listings, simplified. Browse homes, apartments, and properties for sale and rent across Nigeria.";
export const BRAND_COLOR = "#2F8F63";

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${SITE_URL}/`).toString();
}

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  index?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  index = true,
}: PageMetaInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: index ? undefined : { index: false, follow: false },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: path,
    },
    twitter: {
      title: fullTitle,
      description,
    },
  };
}

export function siteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: absoluteUrl("/apple-icon"),
        description: SITE_DESCRIPTION,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        publisher: { "@id": `${SITE_URL}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
}

export function listingJsonLd(post: Post, author: User) {
  const images = post.media
    .filter((m) => m.type === "image")
    .map((m) => m.url)
    .filter((url) => url.startsWith("http"));

  const forRent = post.tags.includes("for_rent");

  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    url: absoluteUrl(`/post/${post.id}`),
    name: listingHeadline(post),
    description: post.text || listingHeadline(post),
    datePosted: post.createdAt,
    ...(images.length ? { image: images } : {}),
    ...(post.price
      ? {
          offers: {
            "@type": "Offer",
            price: String(post.price),
            priceCurrency: "NGN",
            availability: "https://schema.org/InStock",
            ...(forRent
              ? {
                  businessFunction: "http://purl.org/goodrelations/v1#LeaseOut",
                }
              : {}),
          },
        }
      : {}),
    ...(post.location
      ? {
          about: {
            "@type": "Residence",
            address: {
              "@type": "PostalAddress",
              addressLocality: post.location,
              addressCountry: "NG",
            },
          },
        }
      : {}),
    provider: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
    },
    author: { "@type": "Person", name: author.name },
  };
}

export function listingHeadline(post: Post): string {
  const firstLine = post.text.split("\n")[0]?.trim();
  if (firstLine) return truncate(firstLine, 70);
  if (post.location) return `Property in ${post.location}`;
  return "Property listing";
}

export function truncate(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length <= max ? clean : `${clean.slice(0, max - 1).trimEnd()}…`;
}
