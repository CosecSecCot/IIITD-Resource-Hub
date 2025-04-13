"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useMemo, useState } from "react";

import questions from "@/data/questions"; // this is your array
import users from "@/data/users"; // assuming you have user info
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, HeartCrack } from "lucide-react";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) =>
      q.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <main className="md:w-[765px] px-10 mx-auto mt-20 mb-20">
      <h1 className="md:text-6xl text-5xl font-bold">Questions</h1>
      <p className="text-muted-foreground mt-4">
        Browse student and faculty questions or ask your own.
      </p>
      <div className="flex md:flex-row flex-col gap-2 mt-20">
        <Input
          placeholder="Search Questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="button" className="w-fit">
          Search
        </Button>
      </div>
      <div className="mt-10 space-y-6">
        {filteredQuestions.map((q) => (
          <QuestionCard key={q.questionID} {...q} />
        ))}
      </div>
    </main>
  );
}

function QuestionCard({
  questionID,
  content,
  dateAsked,
  upvote,
  downvote,
  userID,
}: {
  questionID: number;
  content: string;
  dateAsked: string;
  upvote: number;
  downvote: number;
  userID: number;
}) {
  const user = users.find((u) => u.userID === userID);
  if (!user) return null;

  return (
    <Card className="cursor-pointer">
      <Link href={`/questions/${questionID}`}>
        <CardContent>
          <div className="flex flex-col space-y-6">
            <div className="space-y-2">
              <CardTitle className="text-lg">{content}</CardTitle>
              <CardDescription>
                {new Date(dateAsked).toDateString()}
              </CardDescription>
              <div className="flex space-x-4">
                <div className="flex space-x-2 items-center">
                  <Heart className="h-4 w-4" />
                  <span>{upvote}</span>
                </div>
                <div className="flex space-x-2 items-center">
                  <HeartCrack className="h-4 w-4" />
                  <span>{downvote}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Avatar className="w-[40px] h-[40px]">
                <AvatarImage src="" />
                <AvatarFallback>
                  {user.email?.slice(0, 2).toUpperCase() || "AU"}
                </AvatarFallback>
              </Avatar>
              <span>{user.name}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
