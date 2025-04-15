"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";

import blogs from "@/data/blogs";
import { BlogCard } from "@/app/_components/blog-card";

export default function Blogs() {
  const [search, setSearch] = useState("");

  const filteredBlogs = useMemo(() => {
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.content.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

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
        {filteredBlogs.map((blog, index) => (
          <BlogCard key={index} {...blog} />
        ))}
      </div>
    </main>
  );
}
