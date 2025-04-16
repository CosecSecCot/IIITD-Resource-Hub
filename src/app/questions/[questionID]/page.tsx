import { notFound } from "next/navigation";
import { neon } from "@neondatabase/serverless";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, HeartCrack } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { AnswerForm } from "@/app/_components/answer-section";
import {
  getClerkUserData,
  getDBUserFromCurrentClerkUser,
} from "@/app/_actions/clerk";

export const dynamic = "force-dynamic";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ questionID: string }>;
}) {
  const sql = neon(process.env.DATABASE_URL!);
  const questionID = parseInt((await params).questionID, 10);

  // eslint-disable-next-line prefer-const
  let [questionResult, answersResult] = await Promise.all([
    sql`SELECT * FROM Questions WHERE QuestionID = ${questionID}`,
    sql`
      SELECT
        a.answerid,
        a.content,
        a.dateanswered,
        a.upvote,
        a.downvote,
        a.verified,
        a.questionid,
        a.userid,
        u.name AS username,
        u.email AS useremail,
        u.clerkuserid
      FROM Answers a
      INNER JOIN Users u ON a.userid = u.userid
      WHERE a.questionid = ${questionID}
      ORDER BY a.dateanswered DESC;
    `,
  ]);

  answersResult = await Promise.all(
    answersResult.map(async (answer) => ({
      ...answer,
      userimgurl: (await getClerkUserData(answer["clerkuserid"]))?.imageUrl,
    })),
  );

  const question = questionResult[0];
  if (!question) notFound();

  const userResult =
    await sql`SELECT * FROM Users WHERE UserID = ${question.userid}`;
  const user = userResult[0];
  if (!user) notFound();

  // Assume logged in user (for answer posting) for now
  const loggedInUserID = await getDBUserFromCurrentClerkUser();

  return (
    <div className="flex justify-center">
      <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-6">
        <div className="flex gap-2 items-center">
          <Avatar className="w-[48px] h-[48px]">
            <AvatarImage src={""} />
            <AvatarFallback>
              {user.email?.slice(0, 2).toUpperCase() || "AU"}
            </AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>
        <h1 className="text-4xl font-bold">{question.content}</h1>
        <p>Asked on {new Date(question.dateasked).toDateString()}</p>
        <div className="flex space-x-4">
          <Toggle aria-label="Upvote" className="cursor-pointer">
            <Heart className="h-4 w-4" />
            {question.upvote}
          </Toggle>
          <Toggle aria-label="Downvote" className="cursor-pointer">
            <HeartCrack className="h-4 w-4" />
            {question.downvote}
          </Toggle>
        </div>

        <section className="space-y-8 mt-10">
          <h2 className="text-2xl font-semibold">Answers</h2>
          {loggedInUserID ? (
            <AnswerForm
              questionID={question.questionid}
              userID={loggedInUserID["userid"]}
            />
          ) : (
            ""
          )}

          {answersResult.length === 0 && (
            <p className="text-muted-foreground">
              No answers yet. Be the first to answer!
            </p>
          )}

          {answersResult.map((answer) => (
            <Card key={answer.answerid}>
              <CardHeader>
                <div className="flex gap-2 items-center">
                  <Avatar className="w-[40px] h-[40px]">
                    <AvatarImage src={answer.userimgurl} />
                    <AvatarFallback>
                      {answer.useremail.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{answer.username}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p>{answer.content}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild>
                  <Link href={`/answer/${answer.answerid}`}>See More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
