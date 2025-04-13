"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useMemo, useState } from "react";

import blogs from "@/data/blogs";
import users from "@/data/users";

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

export function BlogCard({
  blogID,
  userID,
  title,
  content,
  dateCreated,
}: {
  blogID: number;
  userID: number;
  title: string;
  content: string;
  dateCreated: string;
}) {
  const user = users.find((u) => u.userID === userID);
  if (!user) return null;

  return (
    <Card className="cursor-pointer">
      <Link href={`blogs/${blogID}`}>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="space-y-2">
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription>
                {new Date(dateCreated).toDateString()}
              </CardDescription>
              <p className="line-clamp-3">{content}</p>
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
