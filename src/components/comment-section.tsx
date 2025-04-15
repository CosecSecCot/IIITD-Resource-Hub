"use client";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Toggle } from "./ui/toggle";
import { Heart, HeartCrack } from "lucide-react";
import { Comment } from "@/data/schema";
import users from "@/data/users";

import commentReplies from "@/data/comments-on-comment";
import allComments from "@/data/comments";

export function CommentSection({ comments }: { comments: Comment[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Comments</h2>
      <div className="space-y-4">
        <Textarea placeholder="Add a Comment..." />
        <Button type="submit">Submit</Button>
      </div>
      <div className="space-y-6 overflow-x-scroll px-2 py-4">
        {comments.map((comment, index) => {
          if (!comment) return;
          return (
            <UserComment key={index} comment={comment} noReplies={false} />
          );
        })}
      </div>
    </div>
  );
}

export function UserComment({
  comment,
  noReplies = false,
}: {
  comment: Comment;
  noReplies: boolean;
}) {
  const { commentID, content, date, upvote, downvote, isDeleted, userID } =
    comment;

  const user = users.find((user) => user.userID === userID);
  const [showReplies, setShowReplies] = useState(false);

  // Find all reply relationships for the current comment.
  const replyRelations = commentReplies.filter(
    (rel) => rel.parentCommentID === commentID,
  );
  // For each found relation, find the full comment details from allComments.
  const replies = replyRelations
    .map((rel) => allComments.find((c) => c.commentID === rel.commentID))
    .filter((c): c is Comment => c !== undefined); // Filter out any potential undefined values

  if (!user) {
    return;
  }
  return (
    <div className="flex flex-col pt-2 items-start">
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src="" />
          <AvatarFallback>
            {user.email.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="grid gap-1.5">
          <div className="flex items-center gap-2">
            <div className="font-bold">{user.name}</div>
            <div className="text-xs text-muted-foreground">
              {new Date(date).toDateString()}
            </div>
          </div>
          <div className={`text-sm ${isDeleted ? "italic" : ""}`}>
            {isDeleted ? "This comment is deleted" : content}
          </div>
          <div className="flex space-x-2">
            <Toggle aria-label="Upvote" size="sm" className="cursor-pointer">
              <Heart className="h-4 w-4" />
              {upvote}
            </Toggle>
            <Toggle aria-label="Downvote" size="sm" className="cursor-pointer">
              <HeartCrack className="h-4 w-4" />
              {downvote}
            </Toggle>
          </div>
          {replies.length > 0 && !showReplies && !noReplies && (
            <Button
              variant="outline"
              onClick={() => setShowReplies(!showReplies)}
              className="mt-2 w-fit cursor-pointer"
            >
              Show Replies
            </Button>
          )}
        </div>
      </div>
      {showReplies &&
        !noReplies &&
        replies.map((reply) => (
          <div
            className="pt-4 ml-5 pl-11 border-l border-[#c4c4c5]"
            key={reply.commentID}
          >
            <UserComment comment={reply} noReplies={noReplies} />
          </div>
        ))}
    </div>
  );
}
