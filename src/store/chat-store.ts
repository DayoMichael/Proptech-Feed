import { create } from "zustand";

import type { Conversation, Message, MediaItem, StoryReplyRef } from "@/types";
import { currentUser } from "@/lib/mock/data";
import { AUTO_REPLIES, seedConversations, seedMessages } from "@/lib/mock/chat";
import { chatSocket, type ServerEvent } from "@/lib/chat-socket";

interface ChatState {
  conversations: Record<string, Conversation>;
  messages: Record<string, Message>;
  messagesByConversation: Record<string, string[]>;
  conversationOrder: string[];
  typing: Record<string, boolean>;
  sendMessage: (
    conversationId: string,
    text: string,
    storyReply?: StoryReplyRef,
    media?: MediaItem[],
  ) => void;
  getOrCreateConversationWith: (userId: string) => string;
  sendMessageToUser: (
    userId: string,
    text: string,
    storyReply?: StoryReplyRef,
  ) => string;
  markConversationRead: (conversationId: string) => void;
}

const me = currentUser.id;

let messageSeq = 0;
function nextMessageId(): string {
  messageSeq += 1;
  return `m_${Date.now().toString(36)}_${messageSeq}`;
}

let replySeq = 0;

function buildMessageIndex(messages: Message[]) {
  const ordered = [...messages].sort(
    (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
  );
  const byConversation: Record<string, string[]> = {};
  for (const m of ordered) {
    (byConversation[m.conversationId] ??= []).push(m.id);
  }
  return byConversation;
}

function index<T extends { id: string }>(items: T[]): Record<string, T> {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: index(seedConversations),
  messages: index(seedMessages),
  messagesByConversation: buildMessageIndex(seedMessages),
  conversationOrder: seedConversations.map((c) => c.id),
  typing: {},

  getOrCreateConversationWith: (userId) => {
    const existing = Object.values(get().conversations).find(
      (c) => c.participantId === userId,
    );
    if (existing) return existing.id;

    const id = `cv-${userId}`;
    const conversation: Conversation = {
      id,
      participantId: userId,
      unreadCount: 0,
    };
    set((state) => ({
      conversations: { ...state.conversations, [id]: conversation },
      messagesByConversation: { ...state.messagesByConversation, [id]: [] },
      conversationOrder: [id, ...state.conversationOrder],
    }));
    return id;
  },

  sendMessage: (conversationId, text, storyReply, media) => {
    const body = text.trim();
    const hasMedia = Boolean(media && media.length > 0);
    if (!body && !hasMedia) return;
    const conversation = get().conversations[conversationId];
    if (!conversation) return;

    const message: Message = {
      id: nextMessageId(),
      conversationId,
      senderId: me,
      text: body,
      createdAt: new Date().toISOString(),
      status: "sending",
      ...(storyReply ? { storyReply } : {}),
      ...(hasMedia ? { media } : {}),
    };

    set((state) => ({
      messages: { ...state.messages, [message.id]: message },
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [
          ...(state.messagesByConversation[conversationId] ?? []),
          message.id,
        ],
      },
      conversations: {
        ...state.conversations,
        [conversationId]: { ...conversation, lastMessageId: message.id },
      },
      conversationOrder: [
        conversationId,
        ...state.conversationOrder.filter((id) => id !== conversationId),
      ],
    }));

    setTimeout(() => patchStatus(set, message.id, "sent"), 250);

    chatSocket.send(message, () => {
      replySeq += 1;
      return {
        id: nextMessageId(),
        conversationId,
        senderId: conversation.participantId,
        text: AUTO_REPLIES[replySeq % AUTO_REPLIES.length],
        createdAt: new Date().toISOString(),
        status: "delivered",
      };
    });
  },

  sendMessageToUser: (userId, text, storyReply) => {
    const conversationId = get().getOrCreateConversationWith(userId);
    get().sendMessage(conversationId, text, storyReply);
    return conversationId;
  },

  markConversationRead: (conversationId) =>
    set((state) => {
      const conversation = state.conversations[conversationId];
      if (!conversation || conversation.unreadCount === 0) return state;
      return {
        conversations: {
          ...state.conversations,
          [conversationId]: { ...conversation, unreadCount: 0 },
        },
      };
    }),
}));

function patchStatus(
  set: (fn: (state: ChatState) => Partial<ChatState>) => void,
  messageId: string,
  status: Message["status"],
) {
  set((state) => {
    const message = state.messages[messageId];
    if (!message) return state;
    return {
      messages: { ...state.messages, [messageId]: { ...message, status } },
    };
  });
}

chatSocket.on((event: ServerEvent) => {
  const set = useChatStore.setState;
  const get = useChatStore.getState;

  if (event.type === "delivered") {
    patchStatus(set, event.messageId, "delivered");
    return;
  }

  if (event.type === "seen") {
    set((state) => {
      const ids = state.messagesByConversation[event.conversationId] ?? [];
      const messages = { ...state.messages };
      for (const id of ids) {
        const m = messages[id];
        if (m && m.senderId === me && m.status !== "seen") {
          messages[id] = { ...m, status: "seen" };
        }
      }
      return { messages };
    });
    return;
  }

  if (event.type === "typing") {
    set((state) => ({
      typing: { ...state.typing, [event.conversationId]: event.isTyping },
    }));
    return;
  }

  const { message } = event;
  const conversation = get().conversations[message.conversationId];
  if (!conversation) return;
  set((state) => ({
    messages: { ...state.messages, [message.id]: message },
    messagesByConversation: {
      ...state.messagesByConversation,
      [message.conversationId]: [
        ...(state.messagesByConversation[message.conversationId] ?? []),
        message.id,
      ],
    },
    conversations: {
      ...state.conversations,
      [message.conversationId]: {
        ...conversation,
        lastMessageId: message.id,
        unreadCount: conversation.unreadCount + 1,
      },
    },
    conversationOrder: [
      message.conversationId,
      ...state.conversationOrder.filter((id) => id !== message.conversationId),
    ],
  }));
});
