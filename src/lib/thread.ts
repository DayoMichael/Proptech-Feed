import type { Comment } from "@/types";

export function collectAncestors(
  comments: Record<string, Comment>,
  commentId: string,
): string[] {
  const chain: string[] = [];
  let parentId = comments[commentId]?.parentId;
  while (parentId && comments[parentId]) {
    chain.unshift(parentId);
    parentId = comments[parentId].parentId;
  }
  return chain;
}
