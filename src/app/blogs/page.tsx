"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState, useTransition } from "react";

import { BlogCard, BlogCardProps } from "@/app/_components/blog-card";

export default function Blogs() {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState<BlogCardProps[]>([]);
  const [isPending, startTransition] = useTransition();

  async function loadBlogs() {
    try {
      const res = await fetch(`/api/blogs`);
      if (!res.ok) {
        console.error("Error fetching blogs");
        return;
      }
      const data = await res.json();
      console.log(data);
      setBlogs(data);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    }
  }

  useEffect(() => {
    startTransition(() => {
      loadBlogs();
    });
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [blogs, search]);

  return (
    <main className="md:w-[765px] px-10 mx-auto mt-20 mb-20">
      <h1 className="md:text-6xl text-5xl font-bold">Blogs</h1>
      <p className="text-muted-foreground mt-4">
        Explore blog articles by students and faculty.
      </p>
      <div className="flex md:flex-row flex-col gap-2 mt-20">
        <Input
          placeholder="Search Blogs..."
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
          filteredBlogs.map((blog, index) => <BlogCard key={index} {...blog} />)
        )}
      </div>
    </main>
  );
}
