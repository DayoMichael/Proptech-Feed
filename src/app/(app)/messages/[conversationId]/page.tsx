import { ChatView } from "@/features/messages/views/chat-view";

export default async function Page({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ChatView conversationId={conversationId} />;
}
