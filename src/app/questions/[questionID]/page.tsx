import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link"; // Import Link for navigation

import users from "@/data/users";
import questions from "@/data/questions";
import answers from "@/data/answers";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ questionID: string }>;
}) {
  const questionID = parseInt((await params).questionID, 10);

  const question = questions.find((q) => q.questionID === questionID);
  if (!question) notFound();

  const user = users.find((u) => u.userID === question.userID);
  if (!user) notFound();

  const answersToThisQuestion = answers.filter(
    (a) => a.questionID === questionID,
  );

  return (
    <div className="flex justify-center">
      <main className="md:w-[765px] w-full px-10 mt-10 mb-20 space-y-10">
        {/* Author Info */}
        <div className="flex gap-2 items-center">
          <Avatar className="w-[48px] h-[48px]">
            <AvatarImage src={""} />
            <AvatarFallback>
              {user.email?.slice(0, 2).toUpperCase() || "AU"}
            </AvatarFallback>
          </Avatar>
          <span>{user.name}</span>
        </div>

        {/* Question Content */}
        <h1 className="text-4xl font-bold">{question.content}</h1>

        {/* Metadata */}
        <div className="flex gap-2 flex-wrap text-sm">
          <Badge variant="secondary">
            Asked on {new Date(question.dateAsked).toDateString()}
          </Badge>
          <Badge>👍 {question.upvote}</Badge>
          <Badge variant="destructive">👎 {question.downvote}</Badge>
        </div>

        {/* Answer Section */}
        <section className="space-y-8 mt-10">
          <h2 className="text-2xl font-semibold">Answers</h2>

          {answersToThisQuestion.length === 0 && (
            <p className="text-muted-foreground">
              No answers yet. Be the first to reply!
            </p>
          )}

          {answersToThisQuestion.map((answer) => {
            const answerUser = users.find((u) => u.userID === answer.userID);

            return (
              <div
                key={answer.answerID}
                className="border border-border rounded-xl p-5 space-y-4"
              >
                {/* Answer Author */}
                {answerUser && (
                  <div className="flex gap-2 items-center">
                    <Avatar className="w-[40px] h-[40px]">
                      <AvatarImage src={""} />
                      <AvatarFallback>
                        {answerUser.email?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{answerUser.name}</span>
                  </div>
                )}

                {/* Answer Content */}
                <p className="text-lg">{answer.content}</p>

                {/* Link to the answer detail page */}
                <Link
                  href={`/answer/${answer.answerID}`}
                  className="text-blue-600 underline mt-2 inline-block"
                >
                  View details
                </Link>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
