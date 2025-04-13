"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PostBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/blogs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        content,
      }),
    });

    if (response.ok) {
      setSubmitted(true);
      setTimeout(() => router.push("/blogs"), 1500); // Redirect to blogs listing
    }
  };

  return (
    <div className="max-w-[765px] mx-auto mt-20 mb-20">
      <h1 className="text-6xl font-bold">Write a Blog</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        Share your thoughts, insights, or experiences with the community.
      </p>

      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <div>
          <Input
            placeholder="Enter a catchy blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Textarea
            placeholder="Write your blog content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={10}
          />
        </div>
        <Button type="submit" className="mt-4">
          Publish
        </Button>
      </form>

      {submitted && (
        <div className="mt-6 text-green-600">
          <p>Your blog has been posted successfully!</p>
        </div>
      )}
    </div>
  );
}
