import { notFound } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link"; // Import Link for navigation

import users from "@/data/users";
import questions from "@/data/questions";
import answers from "@/data/answers";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart, HeartCrack } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

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
        <p>Asked on {new Date(question.dateAsked).toDateString()}</p>
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
          {answersToThisQuestion.length === 0 && (
            <p className="text-muted-foreground">
              No answers yet. Be the first to answer!
            </p>
          )}

          {answersToThisQuestion.map((answer, idx) => {
            const answerUser = users.find((u) => u.userID === answer.userID);

            return (
              <Card key={idx}>
                <CardHeader>
                  {answerUser ? (
                    <div className="flex gap-2 items-center">
                      <Avatar className="w-[40px] h-[40px]">
                        <AvatarImage src={""} />
                        <AvatarFallback>
                          {answerUser.email?.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{answerUser.name}</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 items-center">
                      <Skeleton className="h-[40px] w-[40px] rounded-full" />
                      <Skeleton className="h-4 w-[250px]" />
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <p>{answer.content}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href={`/answer/${answer.answerID}`}>See More</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </section>
      </main>
    </div>
  );
}
