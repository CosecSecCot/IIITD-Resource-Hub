import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Resource = {
  user: string;
  title: string;
  description: string;
  category: "PYQ" | "Tutorial" | "Notes" | "Misc"
  tags: string[];
}

const Data: Resource[] = [
  {
    user: "Alice",
    title: "Data Structures PYQ",
    description: "Previous year question papers for Data Structures.",
    category: "PYQ",
    tags: ["DSA", "University", "Exam"],
  },
  {
    user: "Bob",
    title: "React Tutorial",
    description: "A beginner-friendly guide to React.js with examples.",
    category: "Tutorial",
    tags: ["React", "Frontend", "JavaScript"],
  },
  {
    user: "Charlie",
    title: "Operating Systems Notes",
    description: "Comprehensive notes on OS concepts, including scheduling and memory management.",
    category: "Notes",
    tags: ["OS", "Computer Science", "Study Material"],
  },
  {
    user: "David",
    title: "Miscellaneous Study Guide",
    description: "A collection of useful study resources from various domains.",
    category: "Misc",
    tags: ["General", "Study", "Guides"],
  },
  {
    user: "Eve",
    title: "Machine Learning PYQ",
    description: "Past year exam questions for machine learning subjects.",
    category: "PYQ",
    tags: ["ML", "AI", "Exam"],
  },
  {
    user: "Frank",
    title: "JavaScript Basics",
    description: "A tutorial covering the fundamentals of JavaScript.",
    category: "Tutorial",
    tags: ["JavaScript", "Programming", "Web"],
  },
  {
    user: "Grace",
    title: "Computer Networks Notes",
    description: "Detailed notes on networking concepts, including TCP/IP and protocols.",
    category: "Notes",
    tags: ["Networks", "Computer Science", "Study"],
  },
  {
    user: "Hannah",
    title: "Miscellaneous Coding Challenges",
    description: "A set of interesting coding challenges for practice.",
    category: "Misc",
    tags: ["Coding", "Challenges", "Practice"],
  },
];


export default function Resources() {
  return <div className="">
    <main className="max-w-[765px] mx-auto mt-20 mb-20">
      <h1 className="text-6xl font-bold">Resoucres</h1>
      <p className="text-muted-foreground mt-4">Search any type of resource across the whole platform.</p>
      <div className="flex gap-2 mt-20">
        <Input placeholder="Search Resources..." />
        <Button type="submit">Search</Button>
      </div>
      <div className="mt-10 space-y-6">
        {Data.map((resource, index) => {
          return <ResourceCard key={index} {...resource} />;
        })}
      </div>
    </main>
  </div>
}


function ResourceCard({ user, title, description, category, tags }: Resource) {
  return (
    <Card className="cursor-pointer">
      <Link href="resources/1">
        <CardContent>
          <div className="flex gap-6">
            {/* TODO: Fix image propotions */}
            <div className="min-w-[256px] aspect-square bg-secondary rounded-lg" />
            <div className="flex flex-col justify-between">
              <div className="space-y-2">
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <div className="flex">
                </div>
                <div className="flex gap-2">
                  <Badge>{category}</Badge>
                  {tags.map((tag, index) => {
                    return <Badge key={index} variant="secondary">{tag}</Badge>
                  })}
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <Avatar className="w-[40px] h-[40px]">
                  <AvatarImage src="" />
                  <AvatarFallback>{user.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}