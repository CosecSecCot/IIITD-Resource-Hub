"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AnswerForm({
  questionID,
  userID,
}: {
  questionID: number;
  userID: number;
}) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionID, userID, content }),
    });

    if (res.ok) {
      setContent("");
      location.reload(); // or use router.refresh() if you convert this to a server component
    } else {
      console.error("Failed to post answer");
    }

    setLoading(false);
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
        placeholder="Write your answer here..."
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </Button>
    </div>
  );
}
