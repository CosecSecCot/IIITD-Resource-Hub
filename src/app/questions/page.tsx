"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState, useTransition } from "react";

import { QuestionCard, QuestionProps } from "@/app/_components/question-card";

export const dynamic = "force-dynamic";

export default function QuestionsPage() {
  const [search, setSearch] = useState("");
  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [isPending, startTransition] = useTransition();

  async function loadQuestions() {
    try {
      const res = await fetch(`/api/questions`);
      if (!res.ok) {
        console.error("Error fetching questions");
        return;
      }
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error("Failed to load questions:", err);
    }
  }

  useEffect(() => {
    startTransition(() => {
      loadQuestions();
    });
  }, []);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) =>
      q.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [questions, search]);

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
        {isPending ? (
          <div>Loading...</div>
        ) : (
          filteredQuestions.map((q, index) => (
            <QuestionCard key={index} {...q} />
          ))
        )}
      </div>
    </main>
  );
}
