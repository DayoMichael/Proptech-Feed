import { create } from "zustand";

export type NotificationKind =
  | "like"
  | "comment"
  | "reply"
  | "follow"
  | "mention";

export interface NotificationItem {
  id: string;
  userId: string;
  kind: NotificationKind;
  text: string;
  minutesAgo: number;
  read: boolean;
}

const SEED: NotificationItem[] = [
  { id: "n1", userId: "dan", kind: "like", text: "liked your comment", minutesAgo: 4, read: false },
  { id: "n2", userId: "amaka", kind: "comment", text: "commented: “Stunning finishing 👏”", minutesAgo: 22, read: false },
  { id: "n3", userId: "felix", kind: "follow", text: "started following you", minutesAgo: 90, read: false },
  { id: "n4", userId: "boyd", kind: "reply", text: "replied to your comment", minutesAgo: 160, read: true },
  { id: "n5", userId: "daniel", kind: "mention", text: "mentioned you in a post", minutesAgo: 320, read: true },
  { id: "n6", userId: "ima", kind: "like", text: "liked your post", minutesAgo: 700, read: true },
];

interface NotificationState {
  notifications: NotificationItem[];
  markRead: (id: string) => void;
  markAllRead: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: SEED,
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
}));

export const selectUnreadCount = (s: NotificationState) =>
  s.notifications.reduce((n, item) => n + (item.read ? 0 : 1), 0);
