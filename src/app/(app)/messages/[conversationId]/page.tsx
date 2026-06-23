import type { Metadata } from "next";

import { pageMetadata } from "@/lib/seo";
import { ChatView } from "@/features/messages/views/chat-view";

export const metadata: Metadata = pageMetadata({
  title: "Conversation",
  description: "A private conversation on Expert Listing.",
  path: "/messages",
  index: false,
});

export default async function Page({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ChatView conversationId={conversationId} />;
}
