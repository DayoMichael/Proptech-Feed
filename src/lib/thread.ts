import type { Comment } from "@/types";

/**
 * The ancestor chain of a comment, root-most first (… → grandparent → parent),
 * excluding the comment itself. The root post sits above index 0.
 * X shows this chain above the focal comment; depth lives in navigation, not
 * indentation.
 */
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
