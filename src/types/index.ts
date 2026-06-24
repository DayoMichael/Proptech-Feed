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
  blurDataURL?: string;
}

export type MediaItem = ImageMedia | VideoMedia;

export interface Post {
  id: string;
  authorId: string;
  category: PostCategory;
  createdAt: string;
  text: string;
  location?: string;
  price?: number;
  tags: PostTag[];
  media: MediaItem[];
  likeCount: number;
  likedByMe: boolean;
  likedByPreview: string[];
  commentCount: number;
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
  durationMs: number;
  createdAt: string;
}

export interface Story {
  id: string;
  userId: string;
  segments: StorySegment[];
}

export type MessageStatus = "sending" | "sent" | "delivered" | "seen";

export interface StoryReplyRef {
  storyId: string;
  segmentId: string;
  authorId: string;
  thumbnailUrl: string;
  blurDataURL?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  status: MessageStatus;
  storyReply?: StoryReplyRef;
  media?: MediaItem[];
}

export interface Conversation {
  id: string;
  participantId: string;
  lastMessageId?: string;
  unreadCount: number;
}
