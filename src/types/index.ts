export type UserType =
  | "individual"
  | "agent"
  | "developer"
  | "owner"
  | "broker";

export interface User {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  type: UserType;
  verified?: boolean;
}

export type PostCategory = "general" | "property";
export type PostTag = "for_sale" | "for_rent";

export interface ImageMedia {
  type: "image";
  url: string;
  width: number;
  height: number;
  alt: string;
  /** Tiny inline placeholder (data URL)  no extra request on slow networks. */
  blurDataURL?: string;
}

export interface VideoMedia {
  type: "video";
  url: string;
  poster: string;
  width: number;
  height: number;
  durationMs: number;
  alt: string;
  /** Tiny inline placeholder (data URL) for the poster  no extra request. */
  blurDataURL?: string;
}

export type MediaItem = ImageMedia | VideoMedia;

export interface Post {
  id: string;
  authorId: string;
  category: PostCategory;
  /** ISO timestamp. */
  createdAt: string;
  text: string;
  location?: string;
  /** Asking price (sale) or yearly rent, in naira  drives the Budget filter. */
  price?: number;
  tags: PostTag[];
  media: MediaItem[];
  likeCount: number;
  likedByMe: boolean;
  /** User ids shown as stacked avatars in the "liked by" row. */
  likedByPreview: string[];
  commentCount: number;
  /** Id of the comment shown as an inline preview, if any. */
  topCommentId?: string;
  bookmarkCount: number;
  savedByMe: boolean;
  shareCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  parentId?: string;
  authorId: string;
  text: string;
  media?: MediaItem[];
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
  replyCount: number;
}

export interface FeedPage {
  posts: Post[];
  nextCursor: string | null;
}

export interface StorySegment {
  id: string;
  media: MediaItem;
  /** How long an image segment is shown; videos use their own duration. */
  durationMs: number;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  segments: StorySegment[];
}

export type MessageStatus = "sending" | "sent" | "delivered" | "seen";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
}

export interface Conversation {
  id: string;
  /** The other participant in this 1:1 DM. */
  participantId: string;
  lastMessageId?: string;
  unreadCount: number;
}
