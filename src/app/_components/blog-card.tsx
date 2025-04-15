import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

import users from "@/data/users";

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
