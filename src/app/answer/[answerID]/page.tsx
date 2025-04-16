import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { getClerkUserData } from "@/app/_actions/clerk";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Heart, HeartCrack } from "lucide-react";
import { CommentSection } from "@/components/comment-section";

export const dynamic = "force-dynamic";

export default async function AnswerPage({
  params,
}: {
  params: Promise<{ answerID: string }>;
}) {
  const sql = neon(process.env.DATABASE_URL!);
  const answerID = parseInt((await params).answerID, 10);

  // Fetch the answer from the "answers" table.
  const answerResult = await sql`
    SELECT * FROM answers WHERE answerID = ${answerID};
  `;
  const answer = answerResult[0];
  console.log(answer);
  if (!answer) notFound();

  // Fetch the user who posted the answer.
  const userResult = await sql`
    SELECT * FROM Users WHERE UserID = ${answer.userid};
  `;
  const answerUser = userResult[0];
  console.log(answerUser);
  if (!answerUser) notFound();

  // Query to fetch comments for this answer by joining CommentOnAnswer, Comment, and Users.
  const commentsResult = await sql`
    SELECT
      c.commentid,
      c.content,
      c.date,
      c.upvote,
      c.downvote,
      c.isdeleted,
      c.userid,
      u.name AS username,
      u.email AS useremail,
      u.clerkuserid
    FROM CommentOnAnswer ca
    INNER JOIN Comment c ON ca.commentid = c.commentid
    INNER JOIN Users u ON c.userid = u.userid
    WHERE ca.answerid = ${answerID}
    ORDER BY c.date ASC;
  `;
  let answerComments = commentsResult;

  // Enrich each comment with the user's image URL using your getClerkUserData helper.
  answerComments = await Promise.all(
    answerComments.map(async (comment) => {
      const clerkData = await getClerkUserData(comment.clerkuserid);
      return {
        ...comment,
        userimgurl: clerkData?.imageUrl || "",
      };
    }),
  );

  return (
    <div className="flex justify-center">
      <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-6">
        <div className="flex gap-2 items-center">
          <Avatar className="w-[48px] h-[48px]">
            <AvatarImage src={answerUser.userimgurl} />
            <AvatarFallback>
              {answerUser.email?.slice(0, 2).toUpperCase() || "AU"}
            </AvatarFallback>
          </Avatar>
          <span>{answerUser.name}</span>
        </div>
        <p className="text-sm text-secondary-foreground">
          Answered on {new Date(answer.dateanswered).toDateString()}
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
          <CommentSection comments={answerComments} answerID={answerID} />
        </section>
      </main>
    </div>
  );
}
