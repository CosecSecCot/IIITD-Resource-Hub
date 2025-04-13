import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CommentSection } from "@/components/comment-section";

import users from "@/data/users";
import answers from "@/data/answers";
import comments from "@/data/comments";
import commentOnAnswer from "@/data/comments-on-answer";

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
    .filter((c) => c != null);

  return (
    <div className="flex justify-center">
      <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-10">
        {/* Answer Author */}
        <div className="flex gap-2 items-center">
          <Avatar className="w-[48px] h-[48px]">
            <AvatarImage src={""} />
            <AvatarFallback>
              {answerUser.email?.slice(0, 2).toUpperCase() || "AU"}
            </AvatarFallback>
          </Avatar>
          <span>{answerUser.name}</span>
        </div>

        {/* Answer Content */}
        <h2 className="text-3xl font-semibold mt-4">{answer.content}</h2>

        {/* Metadata */}
        <div className="flex gap-2 flex-wrap text-sm mt-4">
          <Badge variant="secondary">
            Answered on {new Date(answer.dateAnswered).toDateString()}
          </Badge>
        </div>

        {/* Comments Section */}
        <section className="space-y-8 mt-10">
          {/* Display Comments */}
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
