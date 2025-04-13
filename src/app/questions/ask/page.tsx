"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AskQuestionPage() {
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        question,
      }),
    });

    if (response.ok) {
      setSubmitted(true);
      setTimeout(() => router.push("/questions"), 1500); // Redirect after success
    }
  };

  return (
    <div className="max-w-[765px] mx-auto mt-20 mb-20">
      <h1 className="text-6xl font-bold">Ask a Question</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        Use the form below to ask a detailed question. You’ll get better answers when you're specific!
      </p>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="Enter a brief title for your question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Describe your question in detail..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            rows={8}
          />
        </div>
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>

      {submitted && (
        <div className="mt-6 text-green-600">
          <p>Your question has been submitted successfully!</p>
        </div>
      )}
    </div>
  );
}
