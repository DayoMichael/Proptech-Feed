import type { Metadata } from "next";

import { posts, users } from "@/lib/mock/data";
import {
  listingHeadline,
  listingJsonLd,
  pageMetadata,
  truncate,
  SITE_DESCRIPTION,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { PostConversation } from "@/features/posts/views/post-conversation";

function findPost(postId: string) {
  return posts.find((p) => p.id === postId);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;
  const post = findPost(postId);
  if (!post) {
    return pageMetadata({
      title: "Listing not found",
      description: SITE_DESCRIPTION,
      path: `/post/${postId}`,
      index: false,
    });
  }
  const description = post.text
    ? truncate(post.text, 160)
    : `${listingHeadline(post)} on Expert Listing.`;
  return pageMetadata({
    title: listingHeadline(post),
    description,
    path: `/post/${post.id}`,
  });
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const post = findPost(postId);

  return (
    <>
      {post && <JsonLd data={listingJsonLd(post, users[post.authorId])} />}
      <PostConversation postId={postId} />
    </>
  );
}
