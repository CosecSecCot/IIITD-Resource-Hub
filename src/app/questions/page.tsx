"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function QuestionsPage() {
  const [search, setSearch] = useState("");

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) =>
      q.content.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <main className="max-w-[765px] mx-auto mt-20 mb-20">
      <h1 className="text-6xl font-bold">Questions</h1>
      <p className="text-muted-foreground mt-4">
        Browse student and faculty questions or ask your own.
      </p>
      <div className="flex gap-2 mt-20">
        <Input
          placeholder="Search Questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button type="button">Search</Button>
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
          <div className="flex flex-col gap-3">
            <div className="space-y-2">
              <CardTitle className="text-lg">{content}</CardTitle>
              <CardDescription>
                Asked on {new Date(dateAsked).toLocaleDateString()}
              </CardDescription>
              <div className="flex gap-3 text-sm">
                <Badge>👍 {upvote}</Badge>
                <Badge variant="secondary">👎 {downvote}</Badge>
              </div>
            </div>
            <div className="text-muted-foreground text-sm">
              Asked by {user.name}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
