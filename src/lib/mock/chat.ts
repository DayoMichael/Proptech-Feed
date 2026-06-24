import type { Conversation, Message } from "@/types";
import { currentUser } from "@/lib/mock/data";

function minutesAgo(min: number): string {
  return new Date(Date.now() - min * 60_000).toISOString();
}

const me = currentUser.id;

export const seedConversations: Conversation[] = [
  {
    id: "cv-dan",
    participantId: "dan",
    lastMessageId: "m-dan-3",
    unreadCount: 1,
  },
  {
    id: "cv-amaka",
    participantId: "amaka",
    lastMessageId: "m-amaka-2",
    unreadCount: 0,
  },
  {
    id: "cv-felix",
    participantId: "felix",
    lastMessageId: "m-felix-1",
    unreadCount: 0,
  },
  {
    id: "cv-boyd",
    participantId: "boyd",
    lastMessageId: "m-boyd-2",
    unreadCount: 0,
  },
];

export const seedMessages: Message[] = [
  {
    id: "m-dan-1",
    conversationId: "cv-dan",
    senderId: me,
    text: "Hi Dan, is the 3-bedroom in Lekki still available?",
    createdAt: minutesAgo(48),
    status: "seen",
  },
  {
    id: "m-dan-2",
    conversationId: "cv-dan",
    senderId: "dan",
    text: "Yes it is! Inspection opens Saturday from 10am.",
    createdAt: minutesAgo(45),
    status: "seen",
  },
  {
    id: "m-dan-3",
    conversationId: "cv-dan",
    senderId: "dan",
    text: "Want me to put your name down?",
    createdAt: minutesAgo(12),
    status: "delivered",
  },

  {
    id: "m-amaka-1",
    conversationId: "cv-amaka",
    senderId: "amaka",
    text: "Thanks for saving my listing 🙏",
    createdAt: minutesAgo(220),
    status: "seen",
  },
  {
    id: "m-amaka-2",
    conversationId: "cv-amaka",
    senderId: me,
    text: "Of course  the terrace shots are stunning.",
    createdAt: minutesAgo(210),
    status: "seen",
  },

  {
    id: "m-felix-1",
    conversationId: "cv-felix",
    senderId: "felix",
    text: "Still looking for that 2-bed in Yaba?",
    createdAt: minutesAgo(1500),
    status: "seen",
  },

  {
    id: "m-boyd-1",
    conversationId: "cv-boyd",
    senderId: me,
    text: "Loved the construction update video.",
    createdAt: minutesAgo(2880),
    status: "seen",
  },
  {
    id: "m-boyd-2",
    conversationId: "cv-boyd",
    senderId: "boyd",
    text: "Appreciate it! Handover is on track for Q4.",
    createdAt: minutesAgo(2875),
    status: "seen",
  },
];

export const onlineUserIds = new Set(["dan", "amaka", "ima"]);

export const AUTO_REPLIES = [
  "Got it  let me check and get back to you shortly.",
  "Sure! When works best for an inspection?",
  "Thanks for reaching out 🙏",
  "Noted. I'll send over the details now.",
  "That works for me. Talk soon!",
];
