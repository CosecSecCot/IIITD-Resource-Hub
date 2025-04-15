import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentSection } from "@/components/comment-section";

import users from "@/data/users";
import answers from "@/data/answers";
import comments from "@/data/comments";
import commentOnAnswer from "@/data/comments-on-answer";
import { Toggle } from "@/components/ui/toggle";
import { Heart, HeartCrack } from "lucide-react";

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ answerID: string }>;
}) {
  const answerID = parseInt((await params).answerID, 10);

  const answer = answers.find((a) => a.answerID === answerID);
  if (!answer) notFound();

  const answerUser = users.find((u) => u.userID === answer.userID);
  if (!answerUser) notFound();

  // Get comments related to the answer
  const answerComments = commentOnAnswer
    .filter((entry) => entry.answerID === answer.answerID)
    .map(({ commentID }) => comments.find((c) => c.commentID === commentID))
    .filter((c) => c != undefined);

  return (
    <div className="flex justify-center">
      <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-6">
        <div className="flex gap-2 items-center">
          <Avatar className="w-[48px] h-[48px]">
            <AvatarImage src={""} />
            <AvatarFallback>
              {answerUser.email?.slice(0, 2).toUpperCase() || "AU"}
            </AvatarFallback>
          </Avatar>
          <span>{answerUser.name}</span>
        </div>
        <p className="text-sm text-secondary-foreground">
          Answered on {new Date(answer.dateAnswered).toDateString()}
        </p>
        <p className="text-xl mt-4">{answer.content}</p>
        <div className="flex space-x-4">
          <Toggle aria-label="Upvote" className="cursor-pointer">
            <Heart className="h-4 w-4" />
            {answer.upvote}
          </Toggle>
          <Toggle aria-label="Downvote" className="cursor-pointer">
            <HeartCrack className="h-4 w-4" />
            {answer.downvote}
          </Toggle>
        </div>
        <section className="space-y-8 mt-10">
          {answerComments.length === 0 ? (
            <p className="text-muted-foreground">No comments yet.</p>
          ) : (
            <CommentSection comments={answerComments} />
          )}
        </section>
      </main>
    </div>
  );
}
