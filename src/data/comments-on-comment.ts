// src/data/comments-on-comment.ts
import { CommentOnComment } from "./schema";

const commentReplies: CommentOnComment[] = [
  { commentID: 6, parentCommentID: 4 },
  { commentID: 7, parentCommentID: 4 },
  { commentID: 9, parentCommentID: 6 },
];

export default commentReplies;
